import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ftmfmzyrbdypyqkjhwgh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0bWZtenlyYmR5cHlxa2pod2doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODYxMDAsImV4cCI6MjA5MDE2MjEwMH0._Wc3ZMoJnqBI1HyMAhl9Zo3bMrhSU9FivmcJEyMfNk0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
