const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://ncsejvzgencnobkkwaph.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jc2VqdnpnZW5jbm9ia2t3YXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMjA3NjEsImV4cCI6MjA5MTg5Njc2MX0.zqqoHGqlre9WeZ4LxlzPFpsJi0ARRUHCpFCxqccPEC0';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('Supabase credentials missing from .env. Using fallback cloud identifiers.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
