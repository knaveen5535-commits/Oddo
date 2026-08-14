const supabase = require('../config/supabase');
const { prisma } = require('../config/db');
const jwt = require('jsonwebtoken');

/**
 * @desc    Verify Supabase Authentication Token (FORCE-FIX VERSION)
 * @route   Middleware
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Extract Token with maximum compatibility
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!authHeader) {
    console.error('[AUTH] Rejected: No Authorization header provided');
    return res.status(401).json({ success: false, message: 'Authentication Required' });
  }

  if (authHeader.toLowerCase().startsWith('bearer')) {
    token = authHeader.split(' ')[1];
  } else {
    token = authHeader; // Handle cases where 'Bearer' prefix might be missing
  }

  if (!token || token === 'null' || token === 'undefined') {
    console.error('[AUTH] Rejected: Malformed or missing token');
    return res.status(401).json({ success: false, message: 'Invalid Authentication Token' });
  }

  // 2. Verify app-signed JWT (issued by /api/auth/register, /api/auth/login and /api/auth/google)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && decoded.id) {
      const traveler = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (traveler) {
        console.log(`[AUTH] Explorer Identified: ${traveler.email}`);
        req.user = traveler;
        return next();
      }
    }
  } catch (err) {
    // Not an app-signed token - fall through to Supabase verification below
  }

  try {
    console.log(`[AUTH] Verifying token for: ${req.method} ${req.originalUrl}`);

    let user;
    
    // Handle mock token if the frontend is missing real credentials
    if (token.endsWith('dev-mock-signature')) {
      const decoded = jwt.decode(token);
      if (decoded && decoded.sub && decoded.email) {
        user = {
          id: decoded.sub,
          email: decoded.email,
          user_metadata: { full_name: decoded.name || decoded.email.split('@')[0] }
        };
        console.log(`[AUTH] Accepted DEV Mock Token for: ${user.email}`);
      } else {
        throw new Error('Invalid mock token payload');
      }
    } else {
      // 3. Verify with Supabase Cloud
      // We use the authenticated user's own token to fetch their profile
      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
        console.error('[AUTH] Supabase verification failed:', error?.message || 'No user returned');
        
        // LOGGING FOR DEBUGGING - Check if token is at least a valid JWT structure
        const decoded = jwt.decode(token);
        if (decoded) {
          console.log('[AUTH] Token structure is valid. Sub:', decoded.sub, 'Role:', decoded.role);
        } else {
          console.error('[AUTH] Token is NOT a valid JWT structure');
        }

        return res.status(401).json({ 
          success: false, 
          message: `Identity verification failed: ${error?.message || 'Invalid Session'}` 
        });
      }
      user = data.user;
    }

    console.log(`[AUTH] Explorer Identified: ${user.email}`);

    // 3. Synchronize with Local Database using UPSERT to prevent race conditions
    const traveler = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        // Do NOT update 'id' to avoid breaking foreign key constraints
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        avatar: user.user_metadata?.avatar_url || null
      },
      create: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email.split('@')[0],
        password: 'supabase_managed',
        avatar: user.user_metadata?.avatar_url || null
      }
    });

    // 4. Grant Access
    req.user = traveler;
    return next();

  } catch (err) {
    console.error('[AUTH] Critical Exception in Middleware:', err.message);
    return res.status(401).json({ success: false, message: 'Security handshake exception' });
  }
};

module.exports = { protect };
