-- Homepage Configuration Tables
-- Run this in Supabase SQL Editor to add homepage configurability

-- ============================================
-- 1. Homepage Sections Table (专题区块)
-- ============================================
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key VARCHAR(50) UNIQUE NOT NULL,  -- 'halloween_shop', 'legwear', etc.
  title VARCHAR(255),
  title_zh VARCHAR(255),
  subtitle TEXT,
  subtitle_zh TEXT,
  content TEXT,                              -- Main content/poem
  content_zh TEXT,
  button_text VARCHAR(100),
  button_text_zh VARCHAR(100),
  button_link VARCHAR(255),
  image_url VARCHAR(500),
  bg_color VARCHAR(20) DEFAULT '#FFFFFF',
  text_color VARCHAR(20) DEFAULT '#000000',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for sorting
CREATE INDEX IF NOT EXISTS idx_homepage_sections_sort ON homepage_sections(sort_order);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_active ON homepage_sections(is_active);

-- Add update trigger
CREATE TRIGGER update_homepage_sections_updated_at
  BEFORE UPDATE ON homepage_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public can view active homepage sections" ON homepage_sections
  FOR SELECT USING (is_active = true);

-- Admin full access policy
CREATE POLICY "Admins can manage homepage sections" ON homepage_sections
  FOR ALL USING (true);

-- ============================================
-- 2. Page Visuals Table (if not exists, add columns)
-- ============================================
CREATE TABLE IF NOT EXISTS page_visuals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_name VARCHAR(50) NOT NULL,            -- 'homepage', 'about', etc.
  section VARCHAR(50) NOT NULL,              -- 'main_banner', 'secondary_banner', etc.
  image_url VARCHAR(500),
  image_url_mobile VARCHAR(500),
  alt_text VARCHAR(255),
  alt_text_zh VARCHAR(255),
  link_url VARCHAR(255),
  button1_text VARCHAR(100),
  button1_text_zh VARCHAR(100),
  button1_link VARCHAR(255),
  button2_text VARCHAR(100),
  button2_text_zh VARCHAR(100),
  button2_link VARCHAR(255),
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_name, section)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_page_visuals_page ON page_visuals(page_name);
CREATE INDEX IF NOT EXISTS idx_page_visuals_active ON page_visuals(is_active);

-- Add update trigger
DROP TRIGGER IF EXISTS update_page_visuals_updated_at ON page_visuals;
CREATE TRIGGER update_page_visuals_updated_at
  BEFORE UPDATE ON page_visuals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE page_visuals ENABLE ROW LEVEL SECURITY;

-- Public read policy
DROP POLICY IF EXISTS "Public can view active page visuals" ON page_visuals;
CREATE POLICY "Public can view active page visuals" ON page_visuals
  FOR SELECT USING (is_active = true);

-- Admin full access policy
DROP POLICY IF EXISTS "Admins can manage page visuals" ON page_visuals;
CREATE POLICY "Admins can manage page visuals" ON page_visuals
  FOR ALL USING (true);

-- ============================================
-- 3. Insert Initial Site Settings
-- ============================================
-- Announcement bar settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, group_name, description)
VALUES
  ('announcement_text', 'KLARNA AND AFTERPAY AVAILABLE', 'text', 'announcement', 'Announcement bar text (English)'),
  ('announcement_text_zh', 'KLARNA 和 AFTERPAY 可用', 'text', 'announcement', 'Announcement bar text (Chinese)'),
  ('announcement_bg_color', '#FCE7F3', 'text', 'announcement', 'Announcement bar background color (pink-100)'),
  ('announcement_enabled', 'true', 'boolean', 'announcement', 'Show/hide announcement bar'),

  -- Contact information
  ('contact_email', 'help@openme.com', 'text', 'contact', 'Contact email address'),
  ('contact_response_time', '24', 'number', 'contact', 'Response time in hours'),

  -- Social media links
  ('instagram_url', 'https://www.instagram.com/openme/', 'text', 'social', 'Instagram profile URL'),
  ('tiktok_url', 'https://www.tiktok.com/@openme', 'text', 'social', 'TikTok profile URL'),

  -- Footer
  ('footer_copyright', 'Copyright © 2025 OpenME Inc.', 'text', 'footer', 'Footer copyright text')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = NOW();

-- ============================================
-- 4. Insert Initial Page Visuals (Banners)
-- ============================================
INSERT INTO page_visuals (page_name, section, image_url, image_url_mobile, alt_text, alt_text_zh, link_url, button1_text, button1_text_zh, button1_link, button2_text, button2_text_zh, button2_link, position, is_active)
VALUES
  -- Main Banner (Halloween)
  (
    'homepage',
    'main_banner',
    '/images/halloween-banner.webp',
    '/images/halloween-banner.webp',
    'Boo-tiful looks, killer vibes',
    '惊艳造型，致命魅力',
    NULL,
    'COSTUMES',
    '服装',
    '/collections/costumes',
    'ACCESSORIES',
    '配饰',
    '/collections/accessories',
    1,
    true
  ),

  -- Secondary Banner (Main Character)
  (
    'homepage',
    'secondary_banner',
    '/images/main-character-banner.png',
    '/images/main-character-mobile.png',
    'For main characters only',
    '只为主角准备',
    '/collections/sets',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    2,
    true
  ),

  -- Shipping Banner
  (
    'homepage',
    'shipping_banner',
    '/images/we-ship-global.png',
    '/images/we-ship-global-mobile.png',
    'We ship global',
    '全球配送',
    '/collections/sets',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    3,
    true
  )
ON CONFLICT (page_name, section) DO UPDATE SET
  image_url = EXCLUDED.image_url,
  image_url_mobile = EXCLUDED.image_url_mobile,
  alt_text = EXCLUDED.alt_text,
  alt_text_zh = EXCLUDED.alt_text_zh,
  link_url = EXCLUDED.link_url,
  button1_text = EXCLUDED.button1_text,
  button1_text_zh = EXCLUDED.button1_text_zh,
  button1_link = EXCLUDED.button1_link,
  button2_text = EXCLUDED.button2_text,
  button2_text_zh = EXCLUDED.button2_text_zh,
  button2_link = EXCLUDED.button2_link,
  updated_at = NOW();

-- ============================================
-- 5. Insert Initial Homepage Sections
-- ============================================
INSERT INTO homepage_sections (section_key, title, title_zh, content, content_zh, button_text, button_text_zh, button_link, image_url, bg_color, sort_order, is_active)
VALUES
  (
    'halloween_shop',
    'Halloween Shop Coming Soon...',
    '万圣节商店即将上线...',
    E'Under neon skies we shine,\nSequins, sparkles, one-of-a-kind.\nOpenME calls — bold and bright,\nFestival queens rule the night.\n\nHalloween whispers, daring, wild,\nDark with glitter, wicked-styled.\nCostumes glow, the bass beats rave,\nBorn to stand out — OpenME.',
    E'霓虹天空下我们闪耀，\n亮片璀璨，独一无二。\nOpenME召唤——大胆明亮，\n节日女王主宰夜晚。\n\n万圣节低语，大胆狂野，\n暗黑闪光，邪恶风格。\n服装发光，贝斯节拍狂欢，\n生来就要脱颖而出——OpenME。',
    'STAY TUNED!',
    '敬请期待！',
    '/collections/halloween',
    '/images/halloween-girl.webp',
    '#FFFFFF',
    1,
    true
  ),
  (
    'legwear',
    'Pick a Leg Wear to Match!',
    '挑选配套的腿部饰品！',
    NULL,
    NULL,
    'See full list',
    '查看完整列表',
    '/legwear',
    NULL,
    '#F9FAFB',
    2,
    true
  )
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  title_zh = EXCLUDED.title_zh,
  content = EXCLUDED.content,
  content_zh = EXCLUDED.content_zh,
  button_text = EXCLUDED.button_text,
  button_text_zh = EXCLUDED.button_text_zh,
  button_link = EXCLUDED.button_link,
  image_url = EXCLUDED.image_url,
  bg_color = EXCLUDED.bg_color,
  updated_at = NOW();
