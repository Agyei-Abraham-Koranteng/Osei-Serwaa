import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl === 'your_supabase_project_url') {
    throw new Error('Supabase URL is missing or invalid. Please update .env file and restart the server.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'your_supabase_anon_key') {
    throw new Error('Supabase Anon Key is missing or invalid. Please update .env file and restart the server.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
