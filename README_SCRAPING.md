# ChillFit Rave Database & Scraping Guide

## 📋 Quick Summary

This project contains tools to inspect, scrape, and populate the Supabase database for the ChillFit Rave e-commerce site.

**Database Status:** ✅ Connected and verified
**Database URL:** `https://vlrhvkislotdojapkbnz.supabase.co`
**Current Data:** 8 sample products, 6 categories, 16 images, 18 variants

---

## 📁 File Guide

| File | Purpose |
|------|---------|
| **DATABASE_SCHEMA_GUIDE.md** | Complete database schema documentation |
| **MANUAL_DATA_COLLECTION_TEMPLATE.md** | Step-by-step guide for manual data entry |
| **inspect-schema.js** | Script to inspect current database state |
| **scrape-chillfitrave.js** | Node.js + Puppeteer scraper (recommended) |
| **scrape-chillfitrave.py** | Python + Selenium scraper (alternative) |
| **scraped-products.json** | Output: Raw scraped product data (generated) |
| **insert-scraped-data.sql** | Output: SQL insert script (generated) |

---

## 🚀 Quick Start

### Option 1: Inspect Current Database

```bash
cd D:\code\missale
node inspect-schema.js
```

**Output:**
- Shows all tables and their structure
- Displays current record counts
- Tests joins and relationships
- Verifies database connectivity

---

### Option 2: Automated Scraping (Node.js)

**Requirements:**
```bash
npm install puppeteer
```

**Run:**
```bash
node scrape-chillfitrave.js
```

**What it does:**
1. Launches headless Chrome browser
2. Navigates to ChillFit Rave collections
3. Waits for JavaScript to render products
4. Extracts product data (name, price, image, link)
5. Saves to `scraped-products.json`
6. Generates SQL script: `insert-scraped-data.sql`

**Collections scraped:**
- /collections/all
- /collections/the-7-signature
- /collections/new-arrivals
- /collections/tops
- /collections/bottoms
- /collections/sets

---

### Option 3: Automated Scraping (Python)

**Requirements:**
```bash
pip install selenium webdriver-manager
```

**Run:**
```bash
python scrape-chillfitrave.py
```

**Same output as Node.js version** - use whichever language you're more comfortable with.

---

### Option 4: Manual Data Collection

If scraping doesn't work (website blocks bots, structure changed, etc.):

1. **Read:** `MANUAL_DATA_COLLECTION_TEMPLATE.md`
2. **Browse:** https://chillfitrave.com
3. **Collect:** Product names, prices, images, descriptions
4. **Use templates** in the guide to generate SQL
5. **Run SQL** in Supabase dashboard

---

## 📊 Database Schema Overview

### Tables

```
categories (6 records)
├── id (BIGSERIAL)
├── name, slug
├── description, image_url
└── sort_order, is_active

products (8 records)
├── id (UUID)
├── name, slug, sku
├── price, sale_price, cost_price
├── description, short_description
├── stock_quantity, manage_stock
├── category_id → categories
└── is_active, is_featured

product_images (16 records)
├── id (BIGSERIAL)
├── product_id → products
├── image_url, alt_text
├── is_primary, sort_order
└── width, height, file_size

product_variants (18 records)
├── id (BIGSERIAL)
├── product_id → products
├── name, sku
├── price, sale_price, stock_quantity
└── attributes (JSONB) → {"color": "red", "size": "M"}

cart_items (0 records)
├── id (BIGSERIAL)
├── user_id → auth.users
├── product_id → products
├── variant_id → product_variants
└── quantity

products_with_images (VIEW)
└── Joins products + images + categories
```

---

## 🔄 Workflow: Scraping → Database

### Step 1: Run Scraper

```bash
node scrape-chillfitrave.js
# OR
python scrape-chillfitrave.py
```

### Step 2: Review Scraped Data

Open `scraped-products.json` and verify:
- [ ] Product names are correct
- [ ] Prices are extracted properly
- [ ] Image URLs are valid
- [ ] Categories are assigned
- [ ] No duplicates

### Step 3: Review SQL Script

Open `insert-scraped-data.sql` and check:
- [ ] All slugs are unique
- [ ] All SKUs are unique
- [ ] Prices are in decimal format
- [ ] Category slugs match database
- [ ] Image URLs are absolute

### Step 4: Run SQL in Supabase

1. Go to https://app.supabase.com/project/vlrhvkislotdojapkbnz
2. Click "SQL Editor" in left sidebar
3. Create new query
4. Copy contents of `insert-scraped-data.sql`
5. Click "Run" (or Ctrl+Enter)
6. Check for errors in output

### Step 5: Verify Import

```bash
node inspect-schema.js
```

Should show increased counts:
- Products: 8 → 20+ (or however many you scraped)
- Images: 16 → 40+
- etc.

---

## 🐛 Troubleshooting

### Problem: Scraper finds 0 products

**Causes:**
- Website structure changed
- JavaScript not loading in time
- Bot detection blocking requests

**Solutions:**
1. Increase wait times in scraper
2. Check if website is accessible in regular browser
3. Try the Python version if Node.js fails (or vice versa)
4. Fall back to manual data collection

### Problem: SQL script fails with "duplicate key"

**Cause:** Product with same slug/SKU already exists

**Solution:**
```sql
-- Option 1: Delete existing products
DELETE FROM products WHERE sku LIKE 'CFR-%';

-- Option 2: Use ON CONFLICT in SQL (already included in scripts)
INSERT INTO products (...)
VALUES (...)
ON CONFLICT (slug) DO NOTHING;
```

### Problem: Cannot connect to Supabase

**Check:**
1. `.env.local` has correct credentials
2. Internet connection is working
3. Supabase project is not paused
4. Using correct anon key (not service key)

**Test connection:**
```bash
node inspect-schema.js
```

### Problem: Images not loading on frontend

**Causes:**
- Image URLs expired (if using temporary CDN)
- Image URLs are relative paths
- CORS issues

**Solutions:**
1. Use permanent image hosting (Supabase Storage, Cloudinary)
2. Ensure all URLs are absolute (https://...)
3. Check browser console for errors

---

## 📝 Example: Adding Products Manually

### Simple Product (no variants)

```sql
DO $$
DECLARE
  product_uuid UUID;
  cat_id BIGINT;
BEGIN
  -- Get category
  SELECT id INTO cat_id FROM categories WHERE slug = 'festival-tops';

  -- Insert product
  INSERT INTO products (
    name, slug, description, short_description, sku,
    price, category_id, is_active, stock_quantity
  ) VALUES (
    'Neon Stars Crop Top',
    'neon-stars-crop-top',
    'Vibrant neon stars design perfect for night festivals. UV-reactive material.',
    'UV-reactive neon stars crop top',
    'CFR-NST-001',
    74.99,
    cat_id,
    true,
    25
  )
  RETURNING id INTO product_uuid;

  -- Add image
  INSERT INTO product_images (product_id, image_url, alt_text, is_primary)
  VALUES (
    product_uuid,
    'https://example.com/neon-stars.jpg',
    'Neon Stars Crop Top',
    true
  );
END $$;
```

### Product with Variants

```sql
DO $$
DECLARE
  product_uuid UUID;
  cat_id BIGINT;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'festival-tops';

  INSERT INTO products (
    name, slug, description, short_description, sku,
    price, category_id, is_active, stock_quantity
  ) VALUES (
    'Rainbow Mesh Top',
    'rainbow-mesh-top',
    'Breathable mesh top with gradient rainbow colors. Perfect for summer festivals.',
    'Rainbow gradient mesh festival top',
    'CFR-RMT-001',
    59.99,
    cat_id,
    true,
    50
  )
  RETURNING id INTO product_uuid;

  -- Add variants
  INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes)
  VALUES
    (product_uuid, 'Rainbow Mesh Top - Small',  'CFR-RMT-001-S',  59.99, 12, '{"size": "S"}'),
    (product_uuid, 'Rainbow Mesh Top - Medium', 'CFR-RMT-001-M',  59.99, 18, '{"size": "M"}'),
    (product_uuid, 'Rainbow Mesh Top - Large',  'CFR-RMT-001-L',  59.99, 15, '{"size": "L"}'),
    (product_uuid, 'Rainbow Mesh Top - XLarge', 'CFR-RMT-001-XL', 59.99, 5,  '{"size": "XL"}');

  -- Add image
  INSERT INTO product_images (product_id, image_url, alt_text, is_primary)
  VALUES (product_uuid, 'https://example.com/rainbow-mesh.jpg', 'Rainbow Mesh Top', true);
END $$;
```

---

## 🎯 Next Steps After Data Import

1. **Update Frontend TypeScript Types**
   - Update `frontend/src/lib/supabase.ts` if schema changed
   - Or generate types: `supabase gen types typescript`

2. **Test Frontend Components**
   ```bash
   cd frontend
   npm run dev
   ```
   - Visit http://localhost:5000
   - Check product listings
   - Verify images load
   - Test product detail pages

3. **Verify API Endpoints**
   - Test `getProducts()`
   - Test `getFeaturedProducts()`
   - Test `getProductBySlug()`
   - Test `getProductsByCategory()`

4. **Optional: Add More Data**
   - Product reviews
   - Related products
   - Product tags
   - Collections
   - Seasonal promotions

---

## 📚 Additional Resources

- **Supabase Dashboard:** https://app.supabase.com/project/vlrhvkislotdojapkbnz
- **ChillFit Rave Website:** https://chillfitrave.com
- **ChillFit Rave Instagram:** https://instagram.com/chillfitrave (224K followers)
- **Supabase Docs:** https://supabase.com/docs
- **Puppeteer Docs:** https://pptr.dev
- **Selenium Docs:** https://selenium-python.readthedocs.io

---

## 🤝 Support

If you need help:

1. **Check logs:** Scraper outputs detailed status messages
2. **Verify database:** Run `node inspect-schema.js`
3. **Check Supabase logs:** In dashboard under "Logs"
4. **Review error messages:** SQL errors are usually descriptive

---

## ✅ Checklist: Database Ready for Production

- [ ] All products have names, SKUs, prices
- [ ] All products have at least one image
- [ ] All images are hosted on permanent CDN
- [ ] Categories are properly assigned
- [ ] Featured products are marked (6 recommended)
- [ ] Stock quantities are set
- [ ] Variants exist for size/color options
- [ ] All slugs are URL-friendly and unique
- [ ] SEO fields (meta_title, meta_description) are filled
- [ ] RLS policies are enabled
- [ ] Database indexes are created
- [ ] Frontend successfully displays products

---

**Database Location:** D:\code\missale
**Last Updated:** 2025-10-09
**Database:** vlrhvkislotdojapkbnz.supabase.co
