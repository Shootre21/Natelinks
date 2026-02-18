import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zfbfyhypkpfjnjptwblu.supabase.co';
const supabaseKey = 'sb_publishable_rBVWnRq0RUqvIiielBT22Q_BKlXdHCL';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper for session management
export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};