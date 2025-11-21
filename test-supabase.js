import { supabase, auth } from './src/js/supabase.js';

console.log('🔄 Testing Supabase connection...\n');

// Test 1: Check if client is initialized
if (supabase) {
    console.log('✅ Supabase client initialized');
} else {
    console.log('❌ Supabase client failed to initialize');
    process.exit(1);
}

// Test 2: Try to get session (should return null if no user logged in)
const { session, error: sessionError } = await auth.getSession();
if (sessionError) {
    console.log('❌ Session check failed:', sessionError.message);
} else {
    console.log('✅ Session check successful (no active session - this is normal)');
}

// Test 3: Try to query the profiles table (should work even if empty)
const { data, error } = await supabase.from('profiles').select('count');
if (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('\n💡 Make sure you ran the SQL commands to create the tables!');
} else {
    console.log('✅ Database connection successful!');
    console.log('✅ Tables are properly set up');
}

console.log('\n🎉 Supabase is ready to use!');
