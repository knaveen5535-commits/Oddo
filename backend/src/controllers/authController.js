const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { prisma } = require('../config/db');
const supabase = require('../config/supabase');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google Authentication
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, picture, sub } = ticket.getPayload();

    // Check if user exists
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create user if not exists
      user = await prisma.user.create({
        data: {
          name,
          email,
          avatar: picture,
          password: await bcrypt.hash(sub, 10), // Placeholder password
        },
      });
    }

    // Create token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    });
  } catch (error) {
    console.error('Google Auth Error:', error.message);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

// @desc    Signup via Supabase admin API (bypasses client signup rate limit)
// @route   POST /api/auth/supabase-signup
// @access  Public
const supabaseSignup = async (req, res) => {
  const { firstName, lastName, email, phone, dob, region, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: `${firstName} ${lastName}`.trim(),
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        region: region || null,
        birth_date: dob || null,
      },
    });

    let userId = data?.user?.id ?? null;
    let userEmail = data?.user?.email ?? email;

    if (error) {
      if (!error.message.toLowerCase().includes('already')) {
        console.error('[SIGNUP] createUser error for', email, ':', error.message);
        return res.status(400).json({ success: false, message: error.message });
      }
    }

    const phoneNumber = phone ? parseInt(String(phone).replace(/\D/g, ''), 10) || 0 : 0;
    const dobNumber = dob ? Math.floor(Date.parse(dob) / 1000) : 0;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const rowData = {
      'first name': firstName,
      'last name': lastName,
      email: userEmail,
      phone: phoneNumber,
      dob: dobNumber,
      region: region || '',
      password: hashedPassword,
    };

    const { data: existingRow } = await supabase
      .from('sign up')
      .select('email')
      .eq('email', userEmail);

    let insertError = null;
    if (existingRow && existingRow.length > 0) {
      const result = await supabase.from('sign up').update(rowData).eq('email', userEmail);
      insertError = result.error;
    } else {
      const result = await supabase.from('sign up').insert(rowData);
      insertError = result.error;
    }

    if (insertError) {
      console.error('[SIGNUP] sign up table upsert failed:', insertError.message);
      return res.status(500).json({ success: false, message: insertError.message });
    }

    res.status(201).json({
      success: true,
      user: { id: userId, email: userEmail },
    });
  } catch (err) {
    console.error('[SIGNUP] Supabase signup error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Upsert a Supabase Google OAuth user into the sign up table
// @route   POST /api/auth/supabase-google-upsert
// @access  Public
const supabaseGoogleUpsert = async (req, res) => {
  const { email, firstName, lastName } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const { data: existingRow } = await supabase
      .from('sign up')
      .select('email')
      .eq('email', email);

    if (existingRow && existingRow.length > 0) {
      return res.status(200).json({ success: true, row: 'exists' });
    }

    const { error: insertError } = await supabase.from('sign up').insert({
      'first name': firstName || '',
      'last name': lastName || '',
      email,
      phone: 0,
      dob: 0,
      region: '',
      password: 'google-oauth',
    });

    if (insertError) {
      return res.status(500).json({ success: false, message: insertError.message });
    }

    res.status(201).json({ success: true, row: 'created' });
  } catch (err) {
    console.error('[SIGNUP] Google upsert error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update user profile data
// @route   PUT /api/auth/profile
// @access  Public (should be protected by auth middleware in real app, but using simple check here)
const updateProfile = async (req, res) => {
  const { email, fullName, bio, location } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    // 1. Get the user from Supabase to find their ID
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('[PROFILE] Error listing users:', listError.message);
      return res.status(500).json({ success: false, message: listError.message });
    }
    
    const user = users.users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in auth' });
    }

    // 2. Update auth user metadata
    const { error: updateAuthError } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        full_name: fullName,
        bio: bio,
        location: location
      }
    });

    if (updateAuthError) {
      console.error('[PROFILE] Error updating auth metadata:', updateAuthError.message);
      return res.status(500).json({ success: false, message: updateAuthError.message });
    }

    // 3. Try to update the 'sign up' table
    const firstName = fullName.split(' ')[0] || '';
    const lastName = fullName.split(' ').slice(1).join(' ') || '';
    
    const { data: existingRow } = await supabase
      .from('sign up')
      .select('email')
      .eq('email', email);

    if (existingRow && existingRow.length > 0) {
      const { error: dbUpdateError } = await supabase
        .from('sign up')
        .update({
          'first name': firstName,
          'last name': lastName
        })
        .eq('email', email);
        
      if (dbUpdateError) {
        console.error('[PROFILE] Error updating sign up table:', dbUpdateError.message);
      }
    }

    res.status(200).json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('[PROFILE] Profile update error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, googleLogin, supabaseSignup, supabaseGoogleUpsert, updateProfile };
