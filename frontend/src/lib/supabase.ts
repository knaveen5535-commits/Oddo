import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ncsejvzgencnobkkwaph.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jc2VqdnpnZW5jbm9ia2t3YXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMjA3NjEsImV4cCI6MjA5MTg5Njc2MX0.zqqoHGqlre9WeZ4LxlzPFpsJi0ARRUHCpFCxqccPEC0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
