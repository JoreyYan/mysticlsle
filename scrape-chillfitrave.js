/**
 * ChillFit Rave Product Scraper
 *
 * This script uses Puppeteer to scrape product data from chillfitrave.com
 * because the site is a JavaScript-heavy SPA that requires browser rendering.
 *
 * REQUIREMENTS:
 * npm install puppeteer --save-dev
 *
 * USAGE:
 * node scrape-chillfitrave.js
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URLS_TO_SCRAPE = [
  'https://chillfitrave.com/collections/all',
  'https://chillfitrave.com/collections/the-7-signature',
  'https://chillfitrave.com/collections/new-arrivals',
  'https://chillfitrave.com/collections/tops',
  'https://chillfitrave.com/collections/bottoms',
  'https://chillfitrave.com/collections/sets',
];

async function scrapeChillFitRave() {
  console.log('🚀 Starting ChillFit Rave Product Scraper...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const allProducts = [];
  const categories = new Set();

  try {
    for (const url of URLS_TO_SCRAPE) {
      console.log(`📄 Scraping: ${url}`);

      const page = await browser.newPage();

      // Set a reasonable viewport
      await page.setViewport({ width: 1920, height: 1080 });

      // Navigate to the page
      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for products to load (adjust selector based on actual site)
      try {
        await page.waitForSelector('.product-item, .product-card, [data-product]', {
          timeout: 10000
        });
      } catch (e) {
        console.log(`  ⚠️  No products found on this page, trying alternative selectors...`);
      }

      // Extract product data
      const products = await page.evaluate(() => {
        const productElements = document.querySelectorAll(
          '.product-item, .product-card, .grid-product, [data-product], .product'
        );

        return Array.from(productElements).map(element => {
          // Try multiple selectors for different Shopify themes
          const getName = () => {
            const selectors = [
              '.product-title',
              '.product-item__title',
              '.product__title',
              'h3',
              'h2',
              '[data-product-title]'
            ];
            for (const selector of selectors) {
              const el = element.querySelector(selector);
              if (el) return el.textContent.trim();
            }
            return 'Unknown Product';
          };

          const getPrice = () => {
            const selectors = [
              '.price',
              '.product-price',
              '.product-item__price',
              '.money',
              '[data-product-price]'
            ];
            for (const selector of selectors) {
              const el = element.querySelector(selector);
              if (el) return el.textContent.trim();
            }
            return null;
          };

          const getImage = () => {
            const img = element.querySelector('img');
            if (img) {
              return img.src || img.dataset.src || img.dataset.original;
            }
            return null;
          };

          const getLink = () => {
            const link = element.querySelector('a');
            return link ? link.href : null;
          };

          return {
            name: getName(),
            price: getPrice(),
            image: getImage(),
            link: getLink()
          };
        });
      });

      console.log(`  ✅ Found ${products.length} products`);

      // Extract category from URL
      const categoryMatch = url.match(/collections\/([^/?]+)/);
      const category = categoryMatch ? categoryMatch[1] : 'all';
      categories.add(category);

      products.forEach(product => {
        product.category = category;
        allProducts.push(product);
      });

      await page.close();

      // Be respectful - wait between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Save raw data
    const outputPath = path.join(__dirname, 'scraped-products.json');
    fs.writeFileSync(outputPath, JSON.stringify({
      scrapedAt: new Date().toISOString(),
      categories: Array.from(categories),
      productCount: allProducts.length,
      products: allProducts
    }, null, 2));

    console.log(`\n✅ Scraping complete!`);
    console.log(`📊 Total products: ${allProducts.length}`);
    console.log(`📂 Categories: ${Array.from(categories).join(', ')}`);
    console.log(`💾 Data saved to: ${outputPath}`);

    // Generate SQL insert script
    await generateSQLInserts(allProducts, categories);

  } catch (error) {
    console.error('❌ Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

async function generateSQLInserts(products, categories) {
  console.log('\n🔧 Generating SQL insert script...');

  const sqlPath = path.join(__dirname, 'insert-scraped-data.sql');
  let sql = `-- ChillFit Rave Scraped Product Data
-- Generated on ${new Date().toISOString()}
-- Total products: ${products.length}

-- Start transaction
BEGIN;

`;

  // Generate category inserts
  sql += `-- Insert categories\n`;
  const categoryMap = {
    'all': { name: 'All Products', description: 'Browse all ChillFit Rave products' },
    'the-7-signature': { name: 'The 7 Signature', description: 'Our signature collection of premium handcrafted festival wear' },
    'new-arrivals': { name: 'New Arrivals', description: 'Latest additions to our collection' },
    'tops': { name: 'Festival Tops', description: 'Unique tops perfect for any music festival' },
    'bottoms': { name: 'Party Bottoms', description: 'Bottoms that make you stand out' },
    'sets': { name: 'Complete Sets', description: 'Complete outfit sets for the perfect rave look' },
  };

  categories.forEach((slug, index) => {
    if (slug !== 'all') {
      const catInfo = categoryMap[slug] || {
        name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: `${slug} collection`
      };

      sql += `INSERT INTO public.categories (name, slug, description, sort_order, is_active)
VALUES ('${catInfo.name}', '${slug}', '${catInfo.description}', ${index}, true)
ON CONFLICT (slug) DO NOTHING;\n\n`;
    }
  });

  // Generate product inserts
  sql += `\n-- Insert products\n`;

  const uniqueProducts = {};
  products.forEach(product => {
    if (product.name && product.name !== 'Unknown Product') {
      uniqueProducts[product.name] = product;
    }
  });

  Object.values(uniqueProducts).forEach((product, index) => {
    const slug = product.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const sku = 'CFR' + String(index + 1).padStart(4, '0');

    // Parse price
    let price = 99.99;
    if (product.price) {
      const priceMatch = product.price.match(/[\d.]+/);
      if (priceMatch) {
        price = parseFloat(priceMatch[0]);
      }
    }

    const description = `${product.name} from ChillFit Rave. Perfect for music festivals, raves, and EDM events.`;

    sql += `DO $$
DECLARE
  product_uuid UUID;
  cat_id BIGINT;
BEGIN
  -- Get category ID
  SELECT id INTO cat_id FROM public.categories WHERE slug = '${product.category}' LIMIT 1;
  IF cat_id IS NULL THEN
    SELECT id INTO cat_id FROM public.categories LIMIT 1;
  END IF;

  -- Insert product
  INSERT INTO public.products (
    name, slug, description, short_description, sku,
    price, category_id, is_active, is_featured, stock_quantity
  ) VALUES (
    '${product.name.replace(/'/g, "''")}',
    '${slug}',
    '${description.replace(/'/g, "''")}',
    '${product.name.replace(/'/g, "''")} - Premium rave and festival wear',
    '${sku}',
    ${price},
    cat_id,
    true,
    ${index < 6 ? 'true' : 'false'},
    ${Math.floor(Math.random() * 20) + 5}
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO product_uuid;

  -- Insert product image if we have one
  IF product_uuid IS NOT NULL AND '${product.image || ''}' != '' THEN
    INSERT INTO public.product_images (
      product_id, image_url, alt_text, is_primary, sort_order
    ) VALUES (
      product_uuid,
      '${product.image || ''}',
      '${product.name.replace(/'/g, "''")} - Main Image',
      true,
      0
    );
  END IF;
END $$;

`;
  });

  sql += `\n-- Commit transaction
COMMIT;

-- Display results
SELECT
  'Import complete!' as message,
  (SELECT COUNT(*) FROM public.categories) as total_categories,
  (SELECT COUNT(*) FROM public.products) as total_products,
  (SELECT COUNT(*) FROM public.product_images) as total_images;
`;

  fs.writeFileSync(sqlPath, sql);
  console.log(`✅ SQL script saved to: ${sqlPath}`);
}

// Run the scraper
if (require.main === module) {
  scrapeChillFitRave().catch(console.error);
}

module.exports = { scrapeChillFitRave };
