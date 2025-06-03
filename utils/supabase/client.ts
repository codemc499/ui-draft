import { createBrowserClient } from '@supabase/ssr';

// No changes needed if already using environment variables directly
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single instance of the Supabase client for the browser
const supabase = createBrowserClient(supabaseUrl, supabaseKey);

export default supabase;
