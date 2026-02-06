-- Add bg_color column to products table
-- Allows users to set a custom background color for product image containers
ALTER TABLE products ADD COLUMN IF NOT EXISTS bg_color TEXT DEFAULT NULL;

-- Add a comment for documentation
COMMENT ON COLUMN products.bg_color IS 'Optional hex color for the product image background (e.g. #FF5733). Used when displaying product images in 1:1 aspect-ratio containers.';
