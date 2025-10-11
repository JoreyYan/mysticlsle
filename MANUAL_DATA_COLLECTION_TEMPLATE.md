# Manual Data Collection Template for ChillFit Rave Products

## 📋 Overview

If automated scraping doesn't work, use this template to manually collect product information from https://chillfitrave.com and create SQL insert scripts.

---

## 🎯 What Information to Collect

For each product on ChillFit Rave, you need to gather:

### Basic Product Info
- [ ] **Product Name** (e.g., "Neon Dreams Festival Top")
- [ ] **Price** (e.g., $89.99)
- [ ] **Sale Price** (if discounted, e.g., $79.99)
- [ ] **Description** (full product description from product page)
- [ ] **Category** (Tops, Bottoms, Sets, The 7 Signature, etc.)

### Images
- [ ] **Primary Image URL** (main product photo)
- [ ] **Additional Images** (2-5 additional product photos)

### Variants (if applicable)
- [ ] **Colors available** (e.g., Red, Blue, Black, White)
- [ ] **Sizes available** (e.g., XS, S, M, L, XL)
- [ ] **Any variant-specific pricing**

---

## 📝 Product Data Collection Form

Copy this template for each product:

```markdown
---
## Product #1

**Name:**
**Price:** $
**Sale Price:** $  (leave blank if not on sale)
**Category:**

**Description:**


**Short Description (1 sentence):**


**Images:**
1. (Primary)
2.
3.
4.

**Available Colors:**
- [ ] Red
- [ ] Blue
- [ ] Black
- [ ] White
- [ ] Pink
- [ ] Purple
- [ ] Other: _______

**Available Sizes:**
- [ ] XS
- [ ] S
- [ ] M
- [ ] L
- [ ] XL
- [ ] XXL
- [ ] One Size

---
```

---

## 🔍 How to Collect This Data

### Method 1: Browse ChillFit Rave Website

1. **Go to:** https://chillfitrave.com
2. **Navigate to collections:**
   - The 7 Signature: https://chillfitrave.com/collections/the-7-signature
   - New Arrivals: https://chillfitrave.com/collections/new-arrivals
   - Tops: https://chillfitrave.com/collections/tops
   - Bottoms: https://chillfitrave.com/collections/bottoms
   - Sets: https://chillfitrave.com/collections/sets

3. **For each product:**
   - Click on the product
   - Copy the product name
   - Copy the price
   - Copy the description
   - Right-click on images → "Copy image address"
   - Note all color/size options

### Method 2: Use Browser Developer Tools

1. **Open product page** on ChillFit Rave
2. **Press F12** to open DevTools
3. **Go to Network tab**
4. **Refresh the page**
5. **Look for:** `products.json` or GraphQL requests
6. **Find the response** with product data
7. **Copy the JSON** - it will have all info in structured format

Example JSON structure you might find:
```json
{
  "product": {
    "id": 123456789,
    "title": "Product Name",
    "handle": "product-slug",
    "description": "Full description...",
    "price": "89.99",
    "compare_at_price": "99.99",
    "images": [
      "https://cdn.shopify.com/s/files/1/0xxx/xxxx/products/image1.jpg",
      "https://cdn.shopify.com/s/files/1/0xxx/xxxx/products/image2.jpg"
    ],
    "variants": [
      {
        "title": "Red / Small",
        "price": "89.99",
        "option1": "Red",
        "option2": "Small",
        "inventory_quantity": 10
      }
    ]
  }
}
```

### Method 3: Instagram/Social Media

ChillFit Rave has a strong Instagram presence (@chillfitrave):
- Product photos
- Product names
- Pricing info (often in captions)
- Customer photos showing products

---

## 🛠️ Converting Collected Data to SQL

Once you have product data, use this SQL template:

### Template: Insert Single Product with Variants

```sql
DO $$
DECLARE
  product_uuid UUID;
  cat_id BIGINT;
BEGIN
  -- Get category ID (change slug as needed)
  SELECT id INTO cat_id FROM categories WHERE slug = 'festival-tops';

  -- If category doesn't exist, use default
  IF cat_id IS NULL THEN
    SELECT id INTO cat_id FROM categories LIMIT 1;
  END IF;

  -- Insert product
  INSERT INTO products (
    name,
    slug,
    description,
    short_description,
    sku,
    price,
    sale_price,
    category_id,
    is_active,
    is_featured,
    stock_quantity
  ) VALUES (
    'PRODUCT_NAME_HERE',                    -- Change this
    'product-slug-here',                     -- Change this (lowercase, dashes)
    'Full product description here...',      -- Change this
    'Short one-line description',            -- Change this
    'CFR-001',                               -- Change this (unique SKU)
    89.99,                                   -- Change this (price)
    79.99,                                   -- Change this (sale price, or NULL)
    cat_id,
    true,                                    -- is_active
    true,                                    -- is_featured (true for first 6 products)
    20                                       -- stock_quantity
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO product_uuid;

  -- Only continue if product was inserted
  IF product_uuid IS NOT NULL THEN

    -- Insert primary image
    INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
    VALUES (
      product_uuid,
      'https://image-url-here.jpg',          -- Change this (primary image)
      'PRODUCT_NAME_HERE - Main Image',      -- Change this
      true,
      0
    );

    -- Insert additional images
    INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
    VALUES
      (product_uuid, 'https://image-2.jpg', 'PRODUCT_NAME - Image 2', false, 1),
      (product_uuid, 'https://image-3.jpg', 'PRODUCT_NAME - Image 3', false, 2);

    -- Insert variants (if product has sizes/colors)
    INSERT INTO product_variants (product_id, name, sku, price, sale_price, stock_quantity, attributes)
    VALUES
      (product_uuid, 'PRODUCT_NAME - Red Small',   'CFR-001-R-S', 89.99, 79.99, 5, '{"color": "Red", "size": "S"}'),
      (product_uuid, 'PRODUCT_NAME - Red Medium',  'CFR-001-R-M', 89.99, 79.99, 8, '{"color": "Red", "size": "M"}'),
      (product_uuid, 'PRODUCT_NAME - Red Large',   'CFR-001-R-L', 89.99, 79.99, 6, '{"color": "Red", "size": "L"}'),
      (product_uuid, 'PRODUCT_NAME - Blue Small',  'CFR-001-B-S', 89.99, 79.99, 4, '{"color": "Blue", "size": "S"}'),
      (product_uuid, 'PRODUCT_NAME - Blue Medium', 'CFR-001-B-M', 89.99, 79.99, 7, '{"color": "Blue", "size": "M"}'),
      (product_uuid, 'PRODUCT_NAME - Blue Large',  'CFR-001-B-L', 89.99, 79.99, 5, '{"color": "Blue", "size": "L"}');

  END IF;
END $$;
```

### Quick Reference: Common Category Slugs

```sql
-- Available categories:
'the-7-signature'    -- The 7 Signature collection
'festival-tops'      -- Festival Tops
'party-bottoms'      -- Party Bottoms
'accessories'        -- Accessories
'led-tech-wear'      -- LED & Tech Wear
'holographic-collection'  -- Holographic Collection
```

---

## 📊 Example: Complete Product Entry

Here's a real example of data collection and SQL:

### Collected Data:

```
Name: Neon Butterfly Crop Top
Price: $79.99
Sale Price: $69.99
Category: Festival Tops
Description: Stand out at any festival with this stunning neon butterfly crop top. Features UV-reactive prints that glow under blacklight, adjustable straps, and a comfortable fit perfect for dancing all night.
Short: UV-reactive butterfly crop top for festivals and raves

Images:
1. https://cdn.shopify.com/files/butterfly-front.jpg
2. https://cdn.shopify.com/files/butterfly-back.jpg
3. https://cdn.shopify.com/files/butterfly-detail.jpg

Colors: Pink, Blue, Green
Sizes: S, M, L, XL
```

### Generated SQL:

```sql
DO $$
DECLARE
  product_uuid UUID;
  cat_id BIGINT;
BEGIN
  SELECT id INTO cat_id FROM categories WHERE slug = 'festival-tops';

  INSERT INTO products (
    name, slug, description, short_description, sku,
    price, sale_price, category_id, is_active, is_featured, stock_quantity
  ) VALUES (
    'Neon Butterfly Crop Top',
    'neon-butterfly-crop-top',
    'Stand out at any festival with this stunning neon butterfly crop top. Features UV-reactive prints that glow under blacklight, adjustable straps, and a comfortable fit perfect for dancing all night.',
    'UV-reactive butterfly crop top for festivals and raves',
    'CFR-NBCT-001',
    79.99,
    69.99,
    cat_id,
    true,
    true,
    50
  )
  RETURNING id INTO product_uuid;

  INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order)
  VALUES
    (product_uuid, 'https://cdn.shopify.com/files/butterfly-front.jpg', 'Neon Butterfly Crop Top - Front', true, 0),
    (product_uuid, 'https://cdn.shopify.com/files/butterfly-back.jpg', 'Neon Butterfly Crop Top - Back', false, 1),
    (product_uuid, 'https://cdn.shopify.com/files/butterfly-detail.jpg', 'Neon Butterfly Crop Top - Detail', false, 2);

  INSERT INTO product_variants (product_id, name, sku, price, sale_price, stock_quantity, attributes)
  VALUES
    -- Pink variants
    (product_uuid, 'Neon Butterfly Crop Top - Pink S',  'CFR-NBCT-001-P-S',  79.99, 69.99, 10, '{"color": "Pink", "size": "S"}'),
    (product_uuid, 'Neon Butterfly Crop Top - Pink M',  'CFR-NBCT-001-P-M',  79.99, 69.99, 15, '{"color": "Pink", "size": "M"}'),
    (product_uuid, 'Neon Butterfly Crop Top - Pink L',  'CFR-NBCT-001-P-L',  79.99, 69.99, 12, '{"color": "Pink", "size": "L"}'),
    (product_uuid, 'Neon Butterfly Crop Top - Pink XL', 'CFR-NBCT-001-P-XL', 79.99, 69.99, 8,  '{"color": "Pink", "size": "XL"}'),
    -- Blue variants
    (product_uuid, 'Neon Butterfly Crop Top - Blue S',  'CFR-NBCT-001-B-S',  79.99, 69.99, 10, '{"color": "Blue", "size": "S"}'),
    (product_uuid, 'Neon Butterfly Crop Top - Blue M',  'CFR-NBCT-001-B-M',  79.99, 69.99, 15, '{"color": "Blue", "size": "M"}'),
    (product_uuid, 'Neon Butterfly Crop Top - Blue L',  'CFR-NBCT-001-B-L',  79.99, 69.99, 12, '{"color": "Blue", "size": "L"}'),
    (product_uuid, 'Neon Butterfly Crop Top - Blue XL', 'CFR-NBCT-001-B-XL', 79.99, 69.99, 8,  '{"color": "Blue", "size": "XL"}'),
    -- Green variants
    (product_uuid, 'Neon Butterfly Crop Top - Green S',  'CFR-NBCT-001-G-S',  79.99, 69.99, 10, '{"color": "Green", "size": "S"}'),
    (product_uuid, 'Neon Butterfly Crop Top - Green M',  'CFR-NBCT-001-G-M',  79.99, 69.99, 15, '{"color": "Green", "size": "M"}'),
    (product_uuid, 'Neon Butterfly Crop Top - Green L',  'CFR-NBCT-001-G-L',  79.99, 69.99, 12, '{"color": "Green", "size": "L"}'),
    (product_uuid, 'Neon Butterfly Crop Top - Green XL', 'CFR-NBCT-001-G-XL', 79.99, 69.99, 8,  '{"color": "Green", "size": "XL"}');

END $$;
```

---

## ✅ Checklist: Before Running SQL

- [ ] All product names are unique
- [ ] All SKUs are unique (use format: CFR-XXX-### or CFR-PRODUCTCODE-COLOR-SIZE)
- [ ] All slugs are unique and URL-friendly (lowercase, hyphens only)
- [ ] Prices are in decimal format (99.99, not $99.99)
- [ ] Image URLs are direct links (not relative paths)
- [ ] Category slugs match existing categories
- [ ] Variant attributes are valid JSON
- [ ] Stock quantities are reasonable numbers

---

## 🚀 Running Your SQL Script

### In Supabase Dashboard:

1. Go to https://app.supabase.com/project/vlrhvkislotdojapkbnz
2. Click "SQL Editor" in sidebar
3. Create a new query
4. Paste your SQL
5. Click "Run" or press Ctrl+Enter

### Testing with Inspect Script:

After inserting data, verify it worked:

```bash
cd D:\code\missale
node inspect-schema.js
```

This will show you:
- Total products count
- Total images count
- Total variants count
- Sample product data

---

## 💡 Pro Tips

1. **Start small:** Insert 2-3 products first to test
2. **Use transactions:** Wrap multiple products in `BEGIN;` ... `COMMIT;`
3. **Check for errors:** Supabase will show error messages if something fails
4. **Keep source data:** Save your collected data in a spreadsheet or text file
5. **Reusable SKUs:** Use a consistent SKU format (e.g., CFR-TOP-001, CFR-BTM-001, CFR-SET-001)
6. **Image hosting:** Make sure image URLs are permanent (Shopify CDN, Cloudinary, etc.)

---

## 🆘 Need Help?

If you get stuck:

1. **Check the DATABASE_SCHEMA_GUIDE.md** for detailed schema info
2. **Run inspect-schema.js** to see current database state
3. **Look at database_setup_fixed.sql** for more example insert statements
4. **Check Supabase logs** in the dashboard for detailed error messages

---

## 📞 Questions to Ask User

If you're collecting data for the user, ask them:

1. **How many products do you want?** (5, 10, 20, all?)
2. **Which collections are most important?** (The 7 Signature, New Arrivals, etc.)
3. **Should all products have variants?** (Or just some?)
4. **What size range?** (XS-XL, S-XXL, One Size?)
5. **What colors are common?** (Red, Blue, Black, Pink, etc.)
6. **Stock levels?** (Realistic numbers, or just use 10-20 for testing?)
7. **Featured products?** (Which 6 should be featured on homepage?)

---

Generated on: 2025-10-09
Database: vlrhvkislotdojapkbnz.supabase.co
