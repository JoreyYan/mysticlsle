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

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testInsert() {
  console.log('🧪 Testing Insert to product_variants...');

  // 1. Get a valid product ID first
  const { data: products } = await supabase.from('products').select('id, name').limit(1);
  if (!products || products.length === 0) {
    console.error('❌ No products found. Cannot test foreign key.');
    return;
  }
  const productId = products[0].id;
  console.log(`📌 Using Product ID: ${productId} (${products[0].name})`);

  // 2. Prepare dummy variant
  const variant = {
    product_id: productId,
    title: 'Test Variant Title', // ADDED THIS
    sku: `TEST-SKU-${Date.now()}`,
    price: 100,
    inventory_quantity: 10,
    option1_name: 'Color',
    option1_value: 'TestBlack',
    option2_name: 'Size',
    option2_value: 'TestSize',
    part: 'top',
    sort_order: 999
  };

  console.log('📤 Inserting:', variant);

  // 3. Perform Insert
  const { data, error } = await supabase.from('product_variants').insert(variant).select();

  if (error) {
    console.error('❌ Insert FAILED:', error);
    console.error('Message:', error.message);
    console.error('Details:', error.details);
    console.error('Hint:', error.hint);
  } else {
    console.log('✅ Insert SUCCESS:', data);
    
    // Cleanup
    console.log('🧹 Cleaning up test data...');
    await supabase.from('product_variants').delete().eq('sku', variant.sku);
  }
}

testInsert();
