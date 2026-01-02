const { createClient } = require('./frontend/node_modules/@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually load .env.local
const envPath = path.join(__dirname, 'frontend', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length) {
    process.env[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSchemaUpdate() {
  console.log('🚀 Updating database schema...');

  // 1. Add product_type column
  // Note: DDL commands via JS client usually require RPC or direct SQL access.
  // Since we might not have 'exec_sql' RPC, we'll try to use a workaround 
  // or rely on the fact that standard `update` won't add columns.
  //
  // WAIT: In a real Supabase project without direct SQL access, 
  // users MUST use the Dashboard SQL Editor to run ALTER TABLE.
  //
  // However, I will check if the columns exist first by inserting dummy data.
  // If they don't, I will output the SQL for the user to run.
  
  // Let's try to detect if columns exist by selecting them
  const { data, error } = await supabase
    .from('products')
    .select('product_type, colors, cost_price, weight')
    .limit(1);

  if (error) {
    console.log('⚠️  It seems some columns are missing. Please run the following SQL in your Supabase Dashboard:');
    console.log('\n' + '='.repeat(50));
    console.log(fs.readFileSync(path.join(__dirname, 'update_product_schema.sql'), 'utf-8'));
    console.log('='.repeat(50) + '\n');
  } else {
    console.log('✅ Columns seems to be accessible (or at least queryable).');
    console.log('Detected structure:', data);
  }
}

runSchemaUpdate();
