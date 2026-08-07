const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isMock = !supabaseUrl || !supabaseServiceKey;

// DEV MOCK: verifies the unsigned dev tokens produced by the frontend mock.
// Only used when Supabase credentials are missing from backend/.env.
function mockGetUser(token) {
  try {
    const payload = jwt.decode(token);
    if (!payload || !payload.sub || !payload.email) {
      return { data: { user: null }, error: new Error('Invalid token payload') };
    }
    return {
      data: {
        user: {
          id: payload.sub,
          email: payload.email,
          email_confirmed_at: null,
          user_metadata: payload.user_metadata || {},
          app_metadata: payload.app_metadata || { provider: 'email' },
        },
      },
      error: null,
    };
  } catch (err) {
    return { data: { user: null }, error: err };
  }
}

const mockSupabase = {
  auth: { getUser: mockGetUser },
};

const supabase = isMock ? mockSupabase : createClient(supabaseUrl, supabaseServiceKey);

if (isMock) {
  console.warn(
    '[AUTH] Supabase credentials missing from backend/.env - running with DEV MOCK token verification.'
  );
}

module.exports = supabase;
