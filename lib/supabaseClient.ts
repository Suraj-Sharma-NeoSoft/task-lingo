// Import the Supabase client creation function from the SDK
import { createClient } from '@supabase/supabase-js';

// Retrieve the Supabase project URL from environment variables
// The "!" asserts that the value is not null or undefined (required by TypeScript)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Retrieve the Supabase anonymous public key from environment variables
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create and export a Supabase client instance using the URL and key
// This client will be used throughout the app to interact with Supabase services
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
