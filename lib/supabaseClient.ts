// [NEW]
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL or Key is not set. Supabase client will not be initialized for writes.");
}

export const supabase = createClient(supabaseUrl!, supabaseKey!);