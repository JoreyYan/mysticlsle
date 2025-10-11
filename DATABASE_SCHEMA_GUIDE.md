# ChillFit Rave Database Schema Guide

## 📊 Database Overview

**Database Platform:** Supabase (PostgreSQL)
**Connection URL:** `https://vlrhvkislotdojapkbnz.supabase.co`
**Status:** ✅ Connected and Verified

---

## 🗄️ Complete Database Schema

### 1. **categories** Table

Stores product categories for organizing the catalog.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing category ID |
| `name` | VARCHAR(100) | NOT NULL | Category display name |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly identifier |
| `description` | TEXT | - | Category description |
| `image_url` | TEXT | - | Category banner/thumbnail image |
| `parent_id` | BIGINT | FK → categories(id) | For subcategories (hierarchical) |
| `sort_order` | INTEGER | DEFAULT 0 | Display order |
| `is_active` | BOOLEAN | DEFAULT TRUE | Whether category is visible |
| `meta_title` | VARCHAR(150) | - | SEO meta title |
| `meta_description` | TEXT | - | SEO meta description |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Current Data:** 6 categories including "The 7 Signature", "Festival Tops", "Party Bottoms", etc.

---

### 2. **products** Table

Main product catalog table with pricing and inventory.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique product identifier |
| `name` | VARCHAR(255) | NOT NULL | Product name |
| `slug` | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| `description` | TEXT | - | Full product description |
| `short_description` | TEXT | - | Brief description for listings |
| `sku` | VARCHAR(100) | UNIQUE, NOT NULL | Stock Keeping Unit code |
| `price` | DECIMAL(10,2) | NOT NULL | Regular price |
| `sale_price` | DECIMAL(10,2) | - | Discounted price (if on sale) |
| `cost_price` | DECIMAL(10,2) | - | Cost/wholesale price |
| `manage_stock` | BOOLEAN | DEFAULT TRUE | Whether to track inventory |
| `stock_quantity` | INTEGER | DEFAULT 0 | Current stock level |
| `low_stock_threshold` | INTEGER | DEFAULT 5 | Alert threshold |
| `category_id` | BIGINT | FK → categories(id) | Associated category |
| `is_active` | BOOLEAN | DEFAULT TRUE | Product visibility |
| `is_featured` | BOOLEAN | DEFAULT FALSE | Featured product flag |
| `is_digital` | BOOLEAN | DEFAULT FALSE | Digital product flag |
| `weight` | DECIMAL(8,2) | - | Shipping weight |
| `dimensions` | JSONB | - | Physical dimensions object |
| `meta_title` | VARCHAR(150) | - | SEO meta title |
| `meta_description` | TEXT | - | SEO meta description |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Current Data:** 8 sample products including "Neon Dreams Festival Top", "LED Light Up Pants", etc.

---

### 3. **product_images** Table

Stores multiple images per product with ordering.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing image ID |
| `product_id` | UUID | FK → products(id) ON DELETE CASCADE | Associated product |
| `image_url` | TEXT | NOT NULL | Full image URL |
| `alt_text` | VARCHAR(255) | - | Image alt text for accessibility |
| `sort_order` | INTEGER | DEFAULT 0 | Display order |
| `is_primary` | BOOLEAN | DEFAULT FALSE | Main product image flag |
| `file_size` | INTEGER | - | File size in bytes |
| `width` | INTEGER | - | Image width in pixels |
| `height` | INTEGER | - | Image height in pixels |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Upload timestamp |

**Current Data:** 16 images (2 per product)
**Note:** Currently using Unsplash placeholder images

---

### 4. **product_variants** Table

Stores product variations (size, color, etc.) with individual pricing and inventory.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing variant ID |
| `product_id` | UUID | FK → products(id) ON DELETE CASCADE | Parent product |
| `name` | VARCHAR(100) | NOT NULL | Variant display name (e.g., "Red - Large") |
| `sku` | VARCHAR(100) | UNIQUE, NOT NULL | Variant-specific SKU |
| `price` | DECIMAL(10,2) | - | Override price (if different from product) |
| `sale_price` | DECIMAL(10,2) | - | Variant sale price |
| `stock_quantity` | INTEGER | DEFAULT 0 | Variant-specific inventory |
| `attributes` | JSONB | NOT NULL | Variant attributes as JSON object |
| `is_active` | BOOLEAN | DEFAULT TRUE | Variant availability |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Attributes JSON Structure:**
```json
{
  "color": "red",
  "size": "M"
}
```

**Current Data:** 18 variants across 3 products (Red/Blue × S/M/L)

---

### 5. **cart_items** Table

Stores shopping cart items for authenticated users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing cart item ID |
| `user_id` | UUID | FK → auth.users(id) ON DELETE CASCADE | Cart owner |
| `product_id` | UUID | FK → products(id) ON DELETE CASCADE | Product in cart |
| `variant_id` | BIGINT | FK → product_variants(id) ON DELETE CASCADE | Selected variant |
| `quantity` | INTEGER | NOT NULL, CHECK > 0 | Item quantity |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Added to cart timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last modified timestamp |

**Constraints:**
- UNIQUE(user_id, product_id, variant_id) - prevents duplicate cart entries

**Current Data:** Empty (no test users yet)

---

### 6. **products_with_images** View

Convenience view that joins products with their images and category info.

**Query:**
```sql
SELECT
  p.*,
  c.name as category_name,
  c.slug as category_slug,
  array_agg(
    json_build_object(
      'id', pi.id,
      'image_url', pi.image_url,
      'alt_text', pi.alt_text,
      'is_primary', pi.is_primary,
      'sort_order', pi.sort_order
    ) ORDER BY pi.sort_order
  ) as images
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_images pi ON p.id = pi.product_id
GROUP BY p.id, c.name, c.slug;
```

---

## 🔐 Row Level Security (RLS) Policies

| Table | Policy | Description |
|-------|--------|-------------|
| products | `Products are publicly readable` | Anyone can view products |
| categories | `Categories are publicly readable` | Anyone can view categories |
| product_images | `Product images are publicly readable` | Anyone can view images |
| product_variants | `Product variants are publicly readable` | Anyone can view variants |
| cart_items | `Users can manage own cart items` | Users can only access their own cart |

---

## 📈 Database Indexes

Performance optimization indexes created:

```sql
-- Products table
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Product images table
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(is_primary) WHERE is_primary = TRUE;

-- Categories table
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = TRUE;

-- Full-text search
CREATE INDEX idx_products_search ON products
USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

---

## 🛠️ Database Functions

### `search_products()` - Full-Text Search Function

Advanced product search with filtering capabilities.

**Signature:**
```sql
search_products(
  search_term TEXT DEFAULT '',
  cat_slug TEXT DEFAULT NULL,
  min_price DECIMAL DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
```

**Returns:** Table with product details, category info, and relevance rank

**Example Usage:**
```sql
-- Search for "neon" products
SELECT * FROM search_products('neon', NULL, NULL, NULL, 10, 0);

-- Get products in "tops" category under $80
SELECT * FROM search_products('', 'festival-tops', NULL, 80, 20, 0);
```

---

## 🌐 Scraping ChillFit Rave Website

### Prerequisites

The ChillFit Rave website (https://chillfitrave.com) is a JavaScript-heavy Single Page Application (SPA), likely built on Shopify. Standard HTTP scraping won't work because content is dynamically rendered.

### Install Puppeteer

```bash
npm install puppeteer --save-dev
```

### Run the Scraper

```bash
node scrape-chillfitrave.js
```

This will:
1. Launch a headless Chrome browser
2. Navigate to multiple collection pages
3. Wait for JavaScript to render products
4. Extract product data (name, price, image, link)
5. Save to `scraped-products.json`
6. Generate SQL insert script: `insert-scraped-data.sql`

### Collections to Scrape

- `/collections/all` - All products
- `/collections/the-7-signature` - Signature collection
- `/collections/new-arrivals` - New products
- `/collections/tops` - Festival tops
- `/collections/bottoms` - Party bottoms
- `/collections/sets` - Complete outfit sets

### Manual Data Extraction (Alternative)

If scraping fails or you need more control:

#### 1. Use Browser DevTools

1. Open https://chillfitrave.com in Chrome
2. Open DevTools (F12)
3. Go to Network tab
4. Navigate through product pages
5. Look for API calls to Shopify endpoints (usually `/products.json` or GraphQL)
6. Copy the JSON responses

#### 2. Extract Product Information Needed

For each product, collect:

```json
{
  "name": "Product Name",
  "price": 99.99,
  "sale_price": 79.99,
  "description": "Full description...",
  "short_description": "Brief description",
  "images": [
    "https://cdn.shopify.com/s/files/1/...",
    "https://cdn.shopify.com/s/files/1/..."
  ],
  "category": "the-7-signature",
  "variants": [
    {
      "name": "Red - Small",
      "sku": "CFR-001-R-S",
      "price": 99.99,
      "attributes": {
        "color": "Red",
        "size": "S"
      }
    }
  ]
}
```

#### 3. Create SQL Insert Script

Use the template in `insert-scraped-data.sql` or manually create:

```sql
-- Insert product
DO $$
DECLARE
  product_uuid UUID;
  cat_id BIGINT;
BEGIN
  -- Get category ID
  SELECT id INTO cat_id FROM categories WHERE slug = 'the-7-signature';

  -- Insert product
  INSERT INTO products (
    name, slug, description, short_description, sku,
    price, sale_price, category_id, is_active, is_featured, stock_quantity
  ) VALUES (
    'Product Name',
    'product-name',
    'Full product description...',
    'Short description',
    'CFR-001',
    99.99,
    79.99,
    cat_id,
    true,
    true,
    20
  )
  RETURNING id INTO product_uuid;

  -- Insert images
  INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
  VALUES
    (product_uuid, 'https://image-url-1.jpg', 'Product Main Image', true, 0),
    (product_uuid, 'https://image-url-2.jpg', 'Product Alt Image', false, 1);

  -- Insert variants
  INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes)
  VALUES
    (product_uuid, 'Red - Small', 'CFR-001-R-S', 99.99, 5, '{"color": "Red", "size": "S"}'),
    (product_uuid, 'Red - Medium', 'CFR-001-R-M', 99.99, 8, '{"color": "Red", "size": "M"}');
END $$;
```

---

## 📝 Example Queries

### Get All Active Products with Images

```sql
SELECT * FROM products_with_images
WHERE is_active = true
ORDER BY created_at DESC;
```

### Get Featured Products

```sql
SELECT
  p.*,
  c.name as category_name,
  array_agg(pi.image_url) as images
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.is_featured = true AND p.is_active = true
GROUP BY p.id, c.name
LIMIT 6;
```

### Get Product with Variants

```sql
SELECT
  p.name,
  p.price,
  pv.name as variant_name,
  pv.attributes,
  pv.stock_quantity
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
WHERE p.slug = 'neon-dreams-festival-top';
```

### Get Products by Category

```sql
SELECT
  p.*,
  c.name as category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'festival-tops'
  AND p.is_active = true
ORDER BY p.created_at DESC;
```

---

## 🔄 Updating the Database

### Run SQL Script in Supabase

1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Paste your SQL script
4. Click "Run" or press Ctrl+Enter

### Using Supabase Client (JavaScript)

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vlrhvkislotdojapkbnz.supabase.co',
  'YOUR_ANON_KEY'
);

// Insert a product
const { data, error } = await supabase
  .from('products')
  .insert({
    name: 'New Product',
    slug: 'new-product',
    sku: 'NEW-001',
    price: 89.99,
    description: 'Product description',
    short_description: 'Short description',
    category_id: 2,
    is_active: true,
    stock_quantity: 20
  });
```

---

## 🐛 Troubleshooting

### Issue: Cannot connect to Supabase

**Solution:** Verify your `.env.local` file has correct credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://vlrhvkislotdojapkbnz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Issue: RLS policy blocking inserts

**Solution:** Use the service role key (not anon key) for admin operations, or temporarily disable RLS:
```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

### Issue: Foreign key constraint errors

**Solution:** Ensure referenced records exist first:
```sql
-- Check if category exists
SELECT * FROM categories WHERE id = 2;

-- Insert category if needed
INSERT INTO categories (name, slug, sort_order)
VALUES ('Category Name', 'category-slug', 1);
```

### Issue: Duplicate key errors

**Solution:** Use `ON CONFLICT` clause:
```sql
INSERT INTO products (slug, name, sku, price, ...)
VALUES (...)
ON CONFLICT (slug) DO NOTHING;

-- Or update on conflict
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name,
    price = EXCLUDED.price;
```

---

## 📚 Additional Resources

- **Supabase Dashboard:** https://app.supabase.com/project/vlrhvkislotdojapkbnz
- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL JSONB:** https://www.postgresql.org/docs/current/datatype-json.html
- **Puppeteer Docs:** https://pptr.dev/

---

## 🎯 Next Steps

1. ✅ Database schema is verified and working
2. ⏳ **Run the scraper** to get real ChillFit Rave product data
3. ⏳ **Review scraped data** in `scraped-products.json`
4. ⏳ **Execute SQL script** `insert-scraped-data.sql` in Supabase
5. ⏳ **Verify data** using the `inspect-schema.js` script
6. ⏳ **Test frontend** to ensure products display correctly

---

Generated on: 2025-10-09
Database: vlrhvkislotdojapkbnz.supabase.co
