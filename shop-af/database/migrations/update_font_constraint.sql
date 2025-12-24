-- Migration to update display_name_font constraint to support all fonts
-- Run this in your Supabase SQL editor

-- Drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_display_name_font_check;

-- Add new constraint with all supported fonts
ALTER TABLE profiles
ADD CONSTRAINT profiles_display_name_font_check 
CHECK (display_name_font IN (
  -- Modern Sans-Serif
  'inter', 'poppins', 'montserrat', 'roboto', 'opensans', 'lato', 'nunito', 
  'sourcesans', 'worksans', 'firasans', 'dmsans', 'rubik',
  
  -- Classic Serif
  'merriweather', 'playfair', 'crimson', 'lora', 'cormorant', 'ebgaramond', 
  'librebaskerville', 'oldstandard', 'spectral', 'vollkorn',
  
  -- Display & Stylized
  'orbitron', 'raleway', 'oswald', 'bebas', 'anton', 'bangers', 'fredoka', 
  'righteous', 'comfortaa', 'quicksand', 'archivo', 'bungee', 'creepster', 
  'monoton', 'pressstart',
  
  -- Script & Cursive
  'dancing', 'pacifico', 'caveat', 'greatvibes', 'sacramento', 'allura', 
  'satisfy', 'kaushan', 'amatic', 'shadows', 'indie', 'permanent', 'cookie', 
  'tangerine', 'lobster', 'courgette',
  
  -- Monospace & Tech
  'firacode', 'sourcecodepro', 'robotomono', 'spacemono', 'jetbrains', 'ubuntumono',
  
  -- Unique & Artistic
  'nosifer', 'eater', 'chela', 'fascinate', 'griffy', 'henny', 'jolly', 'kalam', 
  'lacquer', 'luckiest', 'mystery', 'pirata', 'rye', 'smokum', 'special', 'trade', 
  'vampiro', 'papyrus',
  
  -- Elegant & Luxury
  'cinzel', 'cinzeldecorative', 'forum', 'marcellus', 'trajan', 'yeseva', 'abril', 
  'cardo', 'sorts', 'unna',
  
  -- System Fonts
  'sansserif'
));

-- Update the comment
COMMENT ON COLUMN profiles.display_name_font IS 'Font family for display name - supports 80+ Google Fonts and system fonts';