#!/usr/bin/env python3
"""
ChillFit Rave Product Scraper (Python + Selenium)

Alternative to the Node.js/Puppeteer scraper.
Uses Selenium WebDriver to handle JavaScript-rendered content.

REQUIREMENTS:
    pip install selenium webdriver-manager

USAGE:
    python scrape-chillfitrave.py
"""

import json
import time
import re
from datetime import datetime
from pathlib import Path

try:
    from selenium import webdriver
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from webdriver_manager.chrome import ChromeDriverManager
except ImportError:
    print("❌ Missing required packages. Please install:")
    print("   pip install selenium webdriver-manager")
    exit(1)

# Collections to scrape
COLLECTIONS = [
    'all',
    'the-7-signature',
    'new-arrivals',
    'tops',
    'bottoms',
    'sets',
    'accessories',
]

BASE_URL = 'https://chillfitrave.com'


def setup_driver():
    """Setup Chrome WebDriver with headless options"""
    print("🔧 Setting up Chrome WebDriver...")

    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver


def extract_price(price_text):
    """Extract numeric price from text like '$89.99' or '89.99'"""
    if not price_text:
        return None
    match = re.search(r'[\d,]+\.?\d*', price_text.replace(',', ''))
    return float(match.group()) if match else None


def scrape_collection(driver, collection_slug):
    """Scrape all products from a single collection"""
    url = f"{BASE_URL}/collections/{collection_slug}"
    print(f"\n📄 Scraping: {url}")

    try:
        driver.get(url)
        time.sleep(3)  # Wait for JavaScript to load

        # Try multiple possible selectors for Shopify themes
        product_selectors = [
            '.product-item',
            '.product-card',
            '.grid-product',
            '.product',
            '[data-product-id]',
            '.product-grid-item',
            '.collection-product',
        ]

        products = []
        for selector in product_selectors:
            try:
                elements = driver.find_elements(By.CSS_SELECTOR, selector)
                if elements:
                    print(f"  ✅ Found {len(elements)} products using selector: {selector}")
                    break
            except:
                continue
        else:
            print(f"  ⚠️  Could not find products on this page")
            return []

        # Extract data from each product element
        for idx, element in enumerate(elements):
            try:
                # Try to find product name
                name = None
                name_selectors = ['.product-title', '.product__title', 'h3', 'h2', '.product-name', '.title']
                for sel in name_selectors:
                    try:
                        name_elem = element.find_element(By.CSS_SELECTOR, sel)
                        name = name_elem.text.strip()
                        if name:
                            break
                    except:
                        continue

                # Try to find price
                price_text = None
                price_selectors = ['.price', '.product-price', '.money', '.product__price', '.price-item']
                for sel in price_selectors:
                    try:
                        price_elem = element.find_element(By.CSS_SELECTOR, sel)
                        price_text = price_elem.text.strip()
                        if price_text:
                            break
                    except:
                        continue

                # Try to find image
                image_url = None
                try:
                    img = element.find_element(By.TAG_NAME, 'img')
                    image_url = img.get_attribute('src') or img.get_attribute('data-src')
                    # Convert to high quality if it's a Shopify CDN URL
                    if image_url and 'cdn.shopify.com' in image_url:
                        image_url = re.sub(r'_\d+x\d+', '_800x800', image_url)
                except:
                    pass

                # Try to find product link
                link = None
                try:
                    link_elem = element.find_element(By.TAG_NAME, 'a')
                    link = link_elem.get_attribute('href')
                except:
                    pass

                if name:
                    product = {
                        'name': name,
                        'price': extract_price(price_text),
                        'price_text': price_text,
                        'image': image_url,
                        'link': link,
                        'category': collection_slug
                    }
                    products.append(product)
                    print(f"    {idx + 1}. {name} - {price_text or 'No price'}")

            except Exception as e:
                print(f"    ⚠️  Error extracting product {idx + 1}: {e}")
                continue

        return products

    except Exception as e:
        print(f"  ❌ Error scraping collection: {e}")
        return []


def scrape_product_detail(driver, product_url):
    """Scrape detailed information from individual product page"""
    try:
        driver.get(product_url)
        time.sleep(2)

        detail = {}

        # Description
        try:
            desc_elem = driver.find_element(By.CSS_SELECTOR, '.product-description, .product__description, [data-product-description]')
            detail['description'] = desc_elem.text.strip()
        except:
            pass

        # Additional images
        try:
            images = driver.find_elements(By.CSS_SELECTOR, '.product-image img, .product__media img')
            detail['images'] = [img.get_attribute('src') for img in images[:5]]
        except:
            pass

        # Variants (size/color options)
        variants = []
        try:
            # Size options
            size_selects = driver.find_elements(By.CSS_SELECTOR, 'select[name*="Size"], select[name*="size"]')
            if size_selects:
                options = size_selects[0].find_elements(By.TAG_NAME, 'option')
                sizes = [opt.text.strip() for opt in options if opt.text.strip()]
                variants.append({'type': 'size', 'options': sizes})

            # Color options
            color_selects = driver.find_elements(By.CSS_SELECTOR, 'select[name*="Color"], select[name*="color"]')
            if color_selects:
                options = color_selects[0].find_elements(By.TAG_NAME, 'option')
                colors = [opt.text.strip() for opt in options if opt.text.strip()]
                variants.append({'type': 'color', 'options': colors})
        except:
            pass

        detail['variants'] = variants
        return detail

    except Exception as e:
        print(f"    ⚠️  Could not get product details: {e}")
        return {}


def generate_sql(products, output_file):
    """Generate SQL insert script from scraped products"""
    print("\n🔧 Generating SQL insert script...")

    # Remove duplicates based on name
    unique_products = {}
    for product in products:
        if product['name'] not in unique_products:
            unique_products[product['name']] = product

    products = list(unique_products.values())

    sql = f"""-- ChillFit Rave Scraped Product Data
-- Generated on {datetime.now().isoformat()}
-- Total products: {len(products)}

BEGIN;

"""

    # Category mapping
    category_map = {
        'all': 'all-products',
        'the-7-signature': 'the-7-signature',
        'new-arrivals': 'new-arrivals',
        'tops': 'festival-tops',
        'bottoms': 'party-bottoms',
        'sets': 'complete-sets',
        'accessories': 'accessories',
    }

    for idx, product in enumerate(products, 1):
        slug = re.sub(r'[^a-z0-9]+', '-', product['name'].lower()).strip('-')
        sku = f"CFR-{idx:04d}"
        price = product.get('price') or 99.99
        category = category_map.get(product['category'], 'festival-tops')

        description = f"{product['name']} from ChillFit Rave. Premium handcrafted festival wear perfect for raves, music festivals, and EDM events."

        sql += f"""-- Product {idx}: {product['name']}
DO $$
DECLARE
  product_uuid UUID;
  cat_id BIGINT;
BEGIN
  -- Get category
  SELECT id INTO cat_id FROM public.categories WHERE slug = '{category}' LIMIT 1;
  IF cat_id IS NULL THEN
    SELECT id INTO cat_id FROM public.categories LIMIT 1;
  END IF;

  -- Insert product
  INSERT INTO public.products (
    name, slug, description, short_description, sku,
    price, category_id, is_active, is_featured, stock_quantity
  ) VALUES (
    '{product['name'].replace("'", "''")}',
    '{slug}',
    '{description.replace("'", "''")}',
    '{product['name'].replace("'", "''")} - Premium festival wear',
    '{sku}',
    {price},
    cat_id,
    true,
    {str(idx <= 6).lower()},
    {15 + (idx * 3) % 20}
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO product_uuid;

"""

        # Add image if available
        if product.get('image'):
            sql += f"""  -- Insert image
  IF product_uuid IS NOT NULL THEN
    INSERT INTO public.product_images (
      product_id, image_url, alt_text, is_primary, sort_order
    ) VALUES (
      product_uuid,
      '{product['image']}',
      '{product['name'].replace("'", "''")} - Main Image',
      true,
      0
    );
  END IF;
"""

        sql += "END $$;\n\n"

    sql += """COMMIT;

-- Verify insertion
SELECT
  'Data import complete!' as message,
  (SELECT COUNT(*) FROM public.products) as total_products,
  (SELECT COUNT(*) FROM public.product_images) as total_images;
"""

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(sql)

    print(f"✅ SQL script saved to: {output_file}")


def main():
    print("🚀 ChillFit Rave Product Scraper")
    print("=" * 80)

    driver = setup_driver()
    all_products = []

    try:
        for collection in COLLECTIONS:
            products = scrape_collection(driver, collection)
            all_products.extend(products)
            time.sleep(2)  # Be respectful

        print("\n" + "=" * 80)
        print(f"✅ Scraping complete!")
        print(f"📊 Total products found: {len(all_products)}")

        # Save raw JSON
        json_file = Path(__file__).parent / 'scraped-products.json'
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump({
                'scraped_at': datetime.now().isoformat(),
                'product_count': len(all_products),
                'products': all_products
            }, f, indent=2, ensure_ascii=False)

        print(f"💾 Raw data saved to: {json_file}")

        # Generate SQL
        sql_file = Path(__file__).parent / 'insert-scraped-data.sql'
        generate_sql(all_products, sql_file)

        print("\n🎯 Next steps:")
        print("1. Review scraped-products.json to verify data quality")
        print("2. Edit insert-scraped-data.sql if needed")
        print("3. Run SQL script in Supabase SQL Editor")
        print("4. Verify with: node inspect-schema.js")

    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        import traceback
        traceback.print_exc()

    finally:
        driver.quit()
        print("\n✅ Done!")


if __name__ == '__main__':
    main()
