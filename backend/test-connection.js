import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
    try {
        const { data, error } = await supabase.from('questions').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Connection Error:', error.message);
        } else {
            console.log('Successfully connected to Supabase!');
            console.log('Total questions:', data);
        }
    } catch (err) {
        console.error('Execution Error:', err.message);
    }
}

test();
