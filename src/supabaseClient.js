// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://kxqjyqohhjkggtqnwubd.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || 'sb_publishable_sQjeQCi8f6J4iQgyP3jGSA_7fK1Noek';

if (!process.env.REACT_APP_SUPABASE_URL) {
  console.warn("Supabase URL or Key is missing in .env. Using fallback to prevent crash.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
