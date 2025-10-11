// Script to inspect the actual Supabase database schema
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
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
  console.log('🔍 Inspecting Supabase Database Schema\n');
  console.log('📍 Database URL:', supabaseUrl);
  console.log('=' .repeat(80));

  try {
    // 1. Check products table schema
    console.log('\n📦 PRODUCTS TABLE');
    console.log('-'.repeat(80));
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (productsError) {
      console.error('❌ Error accessing products:', productsError.message);
    } else {
      if (products && products.length > 0) {
        console.log('✅ Products table exists');
        console.log('Sample product structure:', JSON.stringify(products[0], null, 2));
        console.log('\nColumns detected:', Object.keys(products[0]).join(', '));
      } else {
        console.log('⚠️  Products table is empty');
      }
    }

    // Get products count
    const { count: productsCount, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    if (!countError) {
      console.log(`📊 Total products: ${productsCount || 0}`);
    }

    // 2. Check product_variants table schema
    console.log('\n\n🎨 PRODUCT_VARIANTS TABLE');
    console.log('-'.repeat(80));
    const { data: variants, error: variantsError } = await supabase
      .from('product_variants')
      .select('*')
      .limit(1);

    if (variantsError) {
      console.error('❌ Error accessing product_variants:', variantsError.message);
    } else {
      if (variants && variants.length > 0) {
        console.log('✅ Product_variants table exists');
        console.log('Sample variant structure:', JSON.stringify(variants[0], null, 2));
        console.log('\nColumns detected:', Object.keys(variants[0]).join(', '));
      } else {
        console.log('⚠️  Product_variants table is empty');
      }
    }

    const { count: variantsCount } = await supabase
      .from('product_variants')
      .select('*', { count: 'exact', head: true });

    console.log(`📊 Total variants: ${variantsCount || 0}`);

    // 3. Check product_images table schema
    console.log('\n\n🖼️  PRODUCT_IMAGES TABLE');
    console.log('-'.repeat(80));
    const { data: images, error: imagesError } = await supabase
      .from('product_images')
      .select('*')
      .limit(1);

    if (imagesError) {
      console.error('❌ Error accessing product_images:', imagesError.message);
    } else {
      if (images && images.length > 0) {
        console.log('✅ Product_images table exists');
        console.log('Sample image structure:', JSON.stringify(images[0], null, 2));
        console.log('\nColumns detected:', Object.keys(images[0]).join(', '));
      } else {
        console.log('⚠️  Product_images table is empty');
      }
    }

    const { count: imagesCount } = await supabase
      .from('product_images')
      .select('*', { count: 'exact', head: true });

    console.log(`📊 Total images: ${imagesCount || 0}`);

    // 4. Check categories table schema
    console.log('\n\n📂 CATEGORIES TABLE');
    console.log('-'.repeat(80));
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (categoriesError) {
      console.error('❌ Error accessing categories:', categoriesError.message);
    } else {
      if (categories && categories.length > 0) {
        console.log('✅ Categories table exists');
        console.log('Sample category structure:', JSON.stringify(categories[0], null, 2));
        console.log('\nColumns detected:', Object.keys(categories[0]).join(', '));
      } else {
        console.log('⚠️  Categories table is empty');
      }
    }

    const { count: categoriesCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    console.log(`📊 Total categories: ${categoriesCount || 0}`);

    // 5. Check cart_items table schema
    console.log('\n\n🛒 CART_ITEMS TABLE');
    console.log('-'.repeat(80));
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*')
      .limit(1);

    if (cartError) {
      console.error('❌ Error accessing cart_items:', cartError.message);
    } else {
      if (cartItems && cartItems.length > 0) {
        console.log('✅ Cart_items table exists');
        console.log('Sample cart item structure:', JSON.stringify(cartItems[0], null, 2));
        console.log('\nColumns detected:', Object.keys(cartItems[0]).join(', '));
      } else {
        console.log('⚠️  Cart_items table is empty (normal for new database)');
      }
    }

    const { count: cartCount } = await supabase
      .from('cart_items')
      .select('*', { count: 'exact', head: true });

    console.log(`📊 Total cart items: ${cartCount || 0}`);

    // 6. Test complex query with joins
    console.log('\n\n🔗 TESTING JOINS (products with images and category)');
    console.log('-'.repeat(80));
    const { data: productsWithRelations, error: joinError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        price,
        category:categories(id, name, slug),
        images:product_images(id, image_url, is_primary, sort_order)
      `)
      .limit(2);

    if (joinError) {
      console.error('❌ Error testing joins:', joinError.message);
    } else {
      console.log('✅ Joins working correctly');
      console.log('Sample joined data:', JSON.stringify(productsWithRelations, null, 2));
    }

    // 7. Check products_with_images view
    console.log('\n\n👁️  PRODUCTS_WITH_IMAGES VIEW');
    console.log('-'.repeat(80));
    const { data: viewData, error: viewError } = await supabase
      .from('products_with_images')
      .select('*')
      .limit(1);

    if (viewError) {
      console.error('❌ Error accessing products_with_images view:', viewError.message);
    } else {
      if (viewData && viewData.length > 0) {
        console.log('✅ products_with_images view exists');
        console.log('Sample view data:', JSON.stringify(viewData[0], null, 2));
      } else {
        console.log('⚠️  products_with_images view is empty');
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Schema inspection complete!');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('\n❌ Unexpected error:', error);
  }
}

inspectSchema();
