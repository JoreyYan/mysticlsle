const { createClient } = require('./frontend/node_modules/@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(__dirname, 'frontend', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    process.env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function inspectUserTables() {
  console.log('🔍 Inspecting User & Cart Tables...');

  // 1. Check cart_items
  const { data: cartData, error: cartError } = await supabase.from('cart_items').select('*').limit(1);
  if (cartError) console.log('❌ cart_items table error:', cartError.message);
  else {
    console.log('✅ cart_items table exists.');
    if (cartData.length > 0) console.log('Sample:', cartData[0]);
    else console.log('   (Table is empty, need to check columns via error message or assumption)');
  }

  // 2. Check wishlists (or favorites)
  const { data: wishData, error: wishError } = await supabase.from('wishlists').select('*').limit(1);
  if (wishError) console.log('❌ wishlists table error (probably missing):', wishError.message);
  else console.log('✅ wishlists table exists.');

  // 3. Check profiles (for user data)
  const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').limit(1);
  if (profileError) console.log('❌ profiles table error (probably missing):', profileError.message);
  else console.log('✅ profiles table exists.');
  
  // Try to insert a dummy to see columns if empty
  if (!cartError) {
      const { error: insertError } = await supabase.from('cart_items').insert({}).select();
      if (insertError) console.log('ℹ️ Columns hint from insert error:', insertError.message, insertError.details);
  }
}

inspectUserTables();
