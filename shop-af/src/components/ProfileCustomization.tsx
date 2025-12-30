import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useImageUpload } from '../hooks/useImageUpload'
import { supabase } from '../lib/supabase'
import { Palette, Image, Layers, Save, Upload, Type, Sparkles, ChevronDown, Store, X, ExternalLink, Eye, EyeOff, Maximize2, Minimize2, GripVertical } from 'lucide-react'

export default function ProfileCustomization() {
  const { profile, refreshProfile } = useAuth()
  const { uploadImage, uploading, error: uploadError } = useImageUpload()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<'material' | 'title' | 'background'>('material')
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false)
  const [miniPreviewVisible, setMiniPreviewVisible] = useState(true)
  const [miniPreviewPosition, setMiniPreviewPosition] = useState({ x: 16, y: typeof window !== 'undefined' ? window.innerHeight - 170 : 400 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const miniPreviewRef = useRef<HTMLDivElement>(null)

  // Initial settings from profile - all values loaded directly from database
  const getInitialSettings = () => {
    return {
      background_type: profile?.background_type || 'image',
      background_image: profile?.background_image || '',
      background_gradient_direction: profile?.background_gradient_direction || 'white',
      background_gradient_type: (profile?.background_gradient_type as 'linear' | 'radial' | 'diamond' | 'vignette') || 'linear',
      primary_color: profile?.primary_color || '#3B82F6',
      display_name_color: profile?.display_name_color || '#FFFFFF',
      display_name_font: profile?.display_name_font || 'inter',
      card_style: profile?.card_style || 'light',
      card_color: profile?.card_color || '#FFFFFF',
      card_text_color: profile?.card_text_color || '#000000',
      glass_mode: (profile?.glass_mode as 'matte' | 'gloss') || 'matte',
      glass_tint: profile?.glass_tint || '#FFFFFF'
    }
  }

  const [settings, setSettings] = useState(getInitialSettings())

  // Update settings when profile changes
  useEffect(() => {
    setSettings(getInitialSettings())
  }, [profile])

  // Get initial settings for comparison
  const initialSettings = getInitialSettings()

  // Check if there are pending changes
  const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings)

  // Handle cancel changes
  const handleCancel = () => {
    setSettings(initialSettings)
    setMessage('')
  }

  // Adaptive text scaling based on text length (inspired by glassmorphism generator)
  const calculateTitleScale = (textLength: number): number => {
    if (textLength < 10) return 1
    if (textLength < 20) return 0.85
    if (textLength < 30) return 0.7
    if (textLength < 50) return 0.55
    return 0.45
  }

  // Load Google Fonts dynamically
  useEffect(() => {
    const loadGoogleFonts = () => {
      const fontFamilies = fontOptions
        .filter(font => !['sansserif'].includes(font.id))
        .map(font => font.name.replace(/ /g, '+'))
        .join('|')

      if (!document.querySelector('#google-fonts')) {
        const link = document.createElement('link')
        link.id = 'google-fonts'
        link.href = `https://fonts.googleapis.com/css2?${fontFamilies.split('|').map(font => `family=${font}:wght@400;700`).join('&')}&display=swap`
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      }
    }

    loadGoogleFonts()
  }, [])

  const fontOptions = [

    // Modern Sans-Serif
    { id: 'inter', name: 'Inter', family: 'Inter, sans-serif', category: 'Modern' },
    { id: 'poppins', name: 'Poppins', family: 'Poppins, sans-serif', category: 'Modern' },
    { id: 'montserrat', name: 'Montserrat', family: 'Montserrat, sans-serif', category: 'Modern' },
    { id: 'roboto', name: 'Roboto', family: 'Roboto, sans-serif', category: 'Modern' },
    { id: 'opensans', name: 'Open Sans', family: 'Open Sans, sans-serif', category: 'Modern' },
    { id: 'lato', name: 'Lato', family: 'Lato, sans-serif', category: 'Modern' },
    { id: 'nunito', name: 'Nunito', family: 'Nunito, sans-serif', category: 'Modern' },
    { id: 'sourcesans', name: 'Source Sans Pro', family: 'Source Sans Pro, sans-serif', category: 'Modern' },
    { id: 'worksans', name: 'Work Sans', family: 'Work Sans, sans-serif', category: 'Modern' },
    { id: 'firasans', name: 'Fira Sans', family: 'Fira Sans, sans-serif', category: 'Modern' },
    { id: 'dmsans', name: 'DM Sans', family: 'DM Sans, sans-serif', category: 'Modern' },
    { id: 'rubik', name: 'Rubik', family: 'Rubik, sans-serif', category: 'Modern' },

    // Classic Serif
    { id: 'merriweather', name: 'Merriweather', family: 'Merriweather, serif', category: 'Serif' },
    { id: 'playfair', name: 'Playfair Display', family: 'Playfair Display, serif', category: 'Serif' },
    { id: 'crimson', name: 'Crimson Text', family: 'Crimson Text, serif', category: 'Serif' },
    { id: 'lora', name: 'Lora', family: 'Lora, serif', category: 'Serif' },
    { id: 'cormorant', name: 'Cormorant Garamond', family: 'Cormorant Garamond, serif', category: 'Serif' },
    { id: 'ebgaramond', name: 'EB Garamond', family: 'EB Garamond, serif', category: 'Serif' },
    { id: 'librebaskerville', name: 'Libre Baskerville', family: 'Libre Baskerville, serif', category: 'Serif' },
    { id: 'oldstandard', name: 'Old Standard TT', family: 'Old Standard TT, serif', category: 'Serif' },
    { id: 'spectral', name: 'Spectral', family: 'Spectral, serif', category: 'Serif' },
    { id: 'vollkorn', name: 'Vollkorn', family: 'Vollkorn, serif', category: 'Serif' },

    // Display & Stylized
    { id: 'orbitron', name: 'Orbitron', family: 'Orbitron, sans-serif', category: 'Display' },
    { id: 'raleway', name: 'Raleway', family: 'Raleway, sans-serif', category: 'Display' },
    { id: 'oswald', name: 'Oswald', family: 'Oswald, sans-serif', category: 'Display' },
    { id: 'bebas', name: 'Bebas Neue', family: 'Bebas Neue, sans-serif', category: 'Display' },
    { id: 'anton', name: 'Anton', family: 'Anton, sans-serif', category: 'Display' },
    { id: 'bangers', name: 'Bangers', family: 'Bangers, cursive', category: 'Display' },
    { id: 'fredoka', name: 'Fredoka One', family: 'Fredoka One, cursive', category: 'Display' },
    { id: 'righteous', name: 'Righteous', family: 'Righteous, cursive', category: 'Display' },
    { id: 'comfortaa', name: 'Comfortaa', family: 'Comfortaa, cursive', category: 'Display' },
    { id: 'quicksand', name: 'Quicksand', family: 'Quicksand, sans-serif', category: 'Display' },
    { id: 'archivo', name: 'Archivo Black', family: 'Archivo Black, sans-serif', category: 'Display' },
    { id: 'bungee', name: 'Bungee', family: 'Bungee, cursive', category: 'Display' },
    { id: 'creepster', name: 'Creepster', family: 'Creepster, cursive', category: 'Display' },
    { id: 'monoton', name: 'Monoton', family: 'Monoton, cursive', category: 'Display' },
    { id: 'pressstart', name: 'Press Start 2P', family: 'Press Start 2P, cursive', category: 'Display' },

    // Script & Cursive
    { id: 'dancing', name: 'Dancing Script', family: 'Dancing Script, cursive', category: 'Script' },
    { id: 'pacifico', name: 'Pacifico', family: 'Pacifico, cursive', category: 'Script' },
    { id: 'caveat', name: 'Caveat', family: 'Caveat, cursive', category: 'Script' },
    { id: 'greatvibes', name: 'Great Vibes', family: 'Great Vibes, cursive', category: 'Script' },
    { id: 'sacramento', name: 'Sacramento', family: 'Sacramento, cursive', category: 'Script' },
    { id: 'allura', name: 'Allura', family: 'Allura, cursive', category: 'Script' },
    { id: 'satisfy', name: 'Satisfy', family: 'Satisfy, cursive', category: 'Script' },
    { id: 'kaushan', name: 'Kaushan Script', family: 'Kaushan Script, cursive', category: 'Script' },
    { id: 'amatic', name: 'Amatic SC', family: 'Amatic SC, cursive', category: 'Script' },
    { id: 'shadows', name: 'Shadows Into Light', family: 'Shadows Into Light, cursive', category: 'Script' },
    { id: 'indie', name: 'Indie Flower', family: 'Indie Flower, cursive', category: 'Script' },
    { id: 'permanent', name: 'Permanent Marker', family: 'Permanent Marker, cursive', category: 'Script' },
    { id: 'cookie', name: 'Cookie', family: 'Cookie, cursive', category: 'Script' },
    { id: 'tangerine', name: 'Tangerine', family: 'Tangerine, cursive', category: 'Script' },
    { id: 'lobster', name: 'Lobster', family: 'Lobster, cursive', category: 'Script' },
    { id: 'courgette', name: 'Courgette', family: 'Courgette, cursive', category: 'Script' },

    // Monospace & Tech
    { id: 'firacode', name: 'Fira Code', family: 'Fira Code, monospace', category: 'Monospace' },
    { id: 'sourcecodepro', name: 'Source Code Pro', family: 'Source Code Pro, monospace', category: 'Monospace' },
    { id: 'robotomono', name: 'Roboto Mono', family: 'Roboto Mono, monospace', category: 'Monospace' },
    { id: 'spacemono', name: 'Space Mono', family: 'Space Mono, monospace', category: 'Monospace' },
    { id: 'jetbrains', name: 'JetBrains Mono', family: 'JetBrains Mono, monospace', category: 'Monospace' },
    { id: 'ubuntumono', name: 'Ubuntu Mono', family: 'Ubuntu Mono, monospace', category: 'Monospace' },

    // Unique & Artistic
    { id: 'nosifer', name: 'Nosifer', family: 'Nosifer, cursive', category: 'Artistic' },
    { id: 'eater', name: 'Eater', family: 'Eater, cursive', category: 'Artistic' },
    { id: 'chela', name: 'Chela One', family: 'Chela One, cursive', category: 'Artistic' },
    { id: 'fascinate', name: 'Fascinate', family: 'Fascinate, cursive', category: 'Artistic' },
    { id: 'griffy', name: 'Griffy', family: 'Griffy, cursive', category: 'Artistic' },
    { id: 'henny', name: 'Henny Penny', family: 'Henny Penny, cursive', category: 'Artistic' },
    { id: 'jolly', name: 'Jolly Lodger', family: 'Jolly Lodger, cursive', category: 'Artistic' },
    { id: 'kalam', name: 'Kalam', family: 'Kalam, cursive', category: 'Artistic' },
    { id: 'lacquer', name: 'Lacquer', family: 'Lacquer, cursive', category: 'Artistic' },
    { id: 'luckiest', name: 'Luckiest Guy', family: 'Luckiest Guy, cursive', category: 'Artistic' },
    { id: 'mystery', name: 'Mystery Quest', family: 'Mystery Quest, cursive', category: 'Artistic' },
    { id: 'pirata', name: 'Pirata One', family: 'Pirata One, cursive', category: 'Artistic' },
    { id: 'rye', name: 'Rye', family: 'Rye, cursive', category: 'Artistic' },
    { id: 'smokum', name: 'Smokum', family: 'Smokum, cursive', category: 'Artistic' },
    { id: 'special', name: 'Special Elite', family: 'Special Elite, cursive', category: 'Artistic' },
    { id: 'trade', name: 'Trade Winds', family: 'Trade Winds, cursive', category: 'Artistic' },
    { id: 'vampiro', name: 'Vampiro One', family: 'Vampiro One, cursive', category: 'Artistic' },
    { id: 'papyrus', name: 'Papyrus', family: 'Papyrus, fantasy', category: 'Artistic' },

    // Elegant & Luxury
    { id: 'cinzel', name: 'Cinzel', family: 'Cinzel, serif', category: 'Luxury' },
    { id: 'cinzeldecorative', name: 'Cinzel Decorative', family: 'Cinzel Decorative, cursive', category: 'Luxury' },
    { id: 'forum', name: 'Forum', family: 'Forum, cursive', category: 'Luxury' },
    { id: 'marcellus', name: 'Marcellus', family: 'Marcellus, serif', category: 'Luxury' },
    { id: 'trajan', name: 'Trajan Pro', family: 'Trajan Pro, serif', category: 'Luxury' },
    { id: 'yeseva', name: 'Yeseva One', family: 'Yeseva One, cursive', category: 'Luxury' },
    { id: 'abril', name: 'Abril Fatface', family: 'Abril Fatface, cursive', category: 'Luxury' },
    { id: 'cardo', name: 'Cardo', family: 'Cardo, serif', category: 'Luxury' },
    { id: 'sorts', name: 'Sorts Mill Goudy', family: 'Sorts Mill Goudy, serif', category: 'Luxury' },
    { id: 'unna', name: 'Unna', family: 'Unna, serif', category: 'Luxury' },

    // System Fonts
    { id: 'sansserif', name: 'Sans Serif', family: 'sans-serif', category: 'System' }
  ]



  const handleBackgroundImageUpload = async (file: File) => {
    const url = await uploadImage(file, 'avatars') // Using avatars bucket for background images
    if (url) {
      setSettings({ ...settings, background_image: url })
    }
  }

  const handleSave = async () => {
    if (!profile) return

    setLoading(true)
    setMessage('')

    try {
      // Include all customization fields in the database update
      // Font is now saved directly without mapping (database constraint removed)
      const updateData = {
        background_type: settings.background_type,
        background_image: settings.background_image,
        background_gradient_direction: settings.background_gradient_direction,
        background_gradient_type: settings.background_gradient_type, // Now saved to database
        primary_color: settings.primary_color,
        display_name_color: settings.display_name_color,
        display_name_font: settings.display_name_font, // Save font directly (no mapping needed)
        // Card styling fields
        card_style: settings.card_style,
        card_color: settings.card_color,
        card_text_color: settings.card_text_color,
        glass_mode: settings.glass_mode,
        glass_tint: settings.glass_tint,
        updated_at: new Date().toISOString()
      }

      console.log('Saving profile customization:', updateData)

      const { data: updatedData, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', profile.user_id)
        .select('*')
        .single()

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      console.log('Profile updated successfully, returned data:', updatedData)

      // Refresh the profile to get updated data
      await refreshProfile()

      setMessage('Profile customization saved successfully!')

      setTimeout(() => setMessage(''), 5000)
    } catch (error: any) {
      console.error('Error saving customization:', error)
      setMessage(`Failed to save customization: ${error.message || 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  // Generate gradient based on type and direction
  const getGradientStyle = () => {
    const targetColor = settings.background_gradient_direction === 'white' ? '#FFFFFF' : '#000000'
    const primaryColor = settings.primary_color

    switch (settings.background_gradient_type) {
      case 'radial':
        return {
          background: `radial-gradient(circle at center, ${primaryColor} 0%, ${targetColor} 100%)`
        }
      case 'diamond':
        // Diamond effect using conic gradient
        return {
          background: `conic-gradient(from 45deg at 50% 50%, ${primaryColor} 0deg, ${targetColor} 90deg, ${primaryColor} 180deg, ${targetColor} 270deg, ${primaryColor} 360deg)`
        }
      case 'vignette':
        // Vignette effect - dark/light edges with primary color in center
        return {
          background: `radial-gradient(ellipse at center, ${primaryColor} 0%, ${primaryColor} 40%, ${targetColor} 100%)`
        }
      case 'linear':
      default:
        return {
          background: `linear-gradient(to right, ${primaryColor}, ${targetColor})`
        }
    }
  }

  const previewStyle = () => {
    const backgroundImage = settings.background_image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop'

    if (settings.background_type === 'image') {
      return {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    } else if (settings.background_type === 'gradient') {
      return getGradientStyle()
    } else {
      return {
        backgroundColor: settings.primary_color
      }
    }
  }

  const getDisplayNameStyle = () => {
    const font = fontOptions.find(f => f.id === settings.display_name_font)
    return {
      fontFamily: font?.family || 'Inter, sans-serif',
      color: settings.display_name_color,
      fontWeight: '700',
      letterSpacing: '0.015em',
      lineHeight: '1.06'
    }
  }

  // Utility function to calculate luminance for text color (matching ProfilePage)
  const getLuminance = (hex: string) => {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
  }

  const isDarkBackground = getLuminance(settings.primary_color) < 128
  const textColor = isDarkBackground ? '#FFFFFF' : '#000000'

  // Get card styling based on settings
  const getCardStyle = () => {
    return {
      backgroundColor: settings.card_color,
      color: settings.card_text_color
    }
  }

  // Convert hex to rgba for glass effect
  const hexToRgba = (hex: string, alpha: number) => {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Convert hex to RGB string for CSS variables
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    return `${r}, ${g}, ${b}`
  }

  // Get glass card style based on mode
  const getGlassCardStyle = () => {
    const glassColorRgb = hexToRgb(settings.glass_tint)

    if (settings.glass_mode === 'gloss') {
      return {
        background: `linear-gradient(135deg, rgba(${glassColorRgb}, 0.4) 0%, rgba(${glassColorRgb}, 0.05) 50%, rgba(${glassColorRgb}, 0) 100%)`,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '8px 8px 20px 0 rgba(0, 0, 0, 0.3), inset 1px 1px 0 rgba(255, 255, 255, 0.6), inset -1px -1px 0 rgba(0, 0, 0, 0.1)'
      }
    }

    return {
      background: `rgba(${glassColorRgb}, 0.15)`,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: `1px solid rgba(${glassColorRgb}, 0.3)`,
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
    }
  }

  // Truncate bio to 100 characters
  const truncatedBio = (profile?.bio || 'Your shop description will appear here').length > 100
    ? (profile?.bio || 'Your shop description will appear here').substring(0, 100) + '...'
    : (profile?.bio || 'Your shop description will appear here')

  // Get bio text color - adapts to card_text_color for consistency with card styling
  const getBioTextColor = () => {
    return settings.card_text_color
  }

  const selectedFont = fontOptions.find(f => f.id === settings.display_name_font)
  const fontCategories = [...new Set(fontOptions.map(f => f.category))]
  const displayName = profile?.display_name || 'Your Shop Name'
  const titleScale = calculateTitleScale(displayName.length)

  // Drag handlers for mini preview
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragOffset({
      x: clientX - miniPreviewPosition.x,
      y: clientY - miniPreviewPosition.y
    })
  }

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

    // Calculate new position with bounds checking
    const newX = Math.max(0, Math.min(window.innerWidth - 140, clientX - dragOffset.x))
    const newY = Math.max(0, Math.min(window.innerHeight - 180, clientY - dragOffset.y))

    setMiniPreviewPosition({ x: newX, y: newY })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  // Render the iPhone mockup preview (reusable for both desktop and modal)
  const renderPreviewMockup = () => (
    <div className="relative" style={{ width: '280px', height: '605px' }}>
      {/* iPhone Frame */}
            <div className="absolute inset-0 bg-black rounded-[2.5rem] shadow-2xl">
              {/* Screen */}
              <div className="absolute inset-[6px] bg-white rounded-[2.2rem] overflow-hidden">
                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-10 bg-black z-20 flex items-center justify-between px-5 pt-1.5 rounded-t-[2.2rem]">
                  {/* Left side - Time */}
                  <div className="text-white text-xs font-semibold">9:41</div>

                  {/* Right side - Signal, WiFi, Battery */}
                  <div className="flex items-center space-x-1">
                    {/* Signal bars */}
                    <div className="flex items-end space-x-0.5">
                      <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                      <div className="w-0.5 h-1 bg-white rounded-full"></div>
                      <div className="w-0.5 h-1.5 bg-white rounded-full"></div>
                      <div className="w-0.5 h-2 bg-white rounded-full"></div>
                    </div>

                    {/* WiFi icon */}
                    <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                    </svg>

                    {/* Battery */}
                    <div className="flex items-center ml-0.5">
                      <div className="w-5 h-2.5 border border-white rounded-sm relative">
                        <div className="absolute inset-0.5 bg-white rounded-sm" style={{ width: '80%' }}></div>
                      </div>
                      <div className="w-0.5 h-1 bg-white rounded-r-sm ml-0.5"></div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Island */}
                <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-black rounded-full z-30"></div>

                {/* Profile Page Content - Starts below status bar */}
                <div
                  className="absolute top-10 left-0 right-0 bottom-0 transition-all duration-500 ease-in-out overflow-hidden rounded-b-[2.2rem]"
                  style={previewStyle()}
                >
                  <div className="bg-black bg-opacity-10 min-h-full">
                    {/* Header Section with Glass Title Card */}
                    <header className="p-2 text-white text-center">
                      {/* NEW Glass Title Card */}
                      <div
                        className="relative mx-auto p-3 rounded-xl transition-all duration-300"
                        style={{
                          ...getGlassCardStyle(),
                          borderRadius: '12px'
                        }}
                      >
                        {/* Gloss overlay for gloss mode */}
                        {settings.glass_mode === 'gloss' && (
                          <div
                            className="absolute inset-0 rounded-xl pointer-events-none z-0"
                            style={{
                              background: 'linear-gradient(125deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 100%)',
                              borderRadius: '12px'
                            }}
                          />
                        )}

                        <div className="relative z-10">
                          <h1
                            className="font-bold mb-1 transition-all duration-300"
                            style={{
                              ...getDisplayNameStyle(),
                              fontSize: `calc(1.25rem * ${titleScale})`,
                              textShadow: '0 1px 4px rgba(0,0,0,0.15)'
                            }}
                          >
                            {displayName}
                          </h1>
                          <p
                            className="text-[10px] opacity-80 leading-tight"
                            style={{ color: getBioTextColor() }}
                          >
                            {truncatedBio.length > 60 ? truncatedBio.substring(0, 60) + '...' : truncatedBio}
                          </p>
                        </div>
                      </div>
                    </header>

                    {/* Main Content */}
                    <main className="max-w-full mx-auto px-2 py-2">
                      {/* Category Dropdown */}
                      <div className="mb-3">
                        <div className="relative">
                          <button
                            className="w-full p-1.5 rounded-lg shadow-lg flex items-center justify-between border transition-all"
                            style={{
                              backgroundColor: settings.card_color,
                              color: settings.card_text_color,
                              borderColor: settings.card_color === '#FFFFFF' ? '#E5E7EB' : 'transparent'
                            }}
                          >
                            <div className="flex items-center space-x-1.5">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: settings.card_text_color }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                              </svg>
                              <span className="font-medium text-[10px]">All categories</span>
                              <span className="text-[10px] opacity-70">(6)</span>
                            </div>
                            <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: settings.card_text_color }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Product Grid */}
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { name: 'Premium Headphones', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
                          { name: 'Smart Watch', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                          { name: 'Wireless Speaker', icon: 'M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z' },
                          { name: 'Gaming Monitor', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                          { name: 'Smartphone', icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' },
                          { name: 'Wireless Earbuds', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z' }
                        ].map((product, i) => (
                          <div
                            key={i}
                            className="product-card rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                            style={{
                              background: hexToRgba(settings.card_color, 0.2),
                              backdropFilter: 'blur(10px)',
                              border: `1px solid ${hexToRgba(settings.card_color, 0.3)}`
                            }}
                          >
                            <div className="w-full h-12 bg-white/20 flex items-center justify-center">
                              <svg className="w-3 h-3" fill="none" stroke={settings.card_text_color} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={product.icon} />
                              </svg>
                            </div>
                            <div className="p-1.5">
                              <h3
                                className="font-semibold text-[9px] mb-1 truncate"
                                style={{ color: settings.card_text_color }}
                              >
                                {product.name}
                              </h3>
                              <button
                                className="w-full py-0.5 rounded text-white text-[8px] font-medium transition-all duration-200 hover:opacity-90"
                                style={{ backgroundColor: settings.primary_color }}
                              >
                                Open Product
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </main>
                  </div>
                </div>
              </div>
            </div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-200px)]">
      {/* Mobile Preview Modal (Full Screen) */}
      {mobilePreviewOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          {/* Modal Content */}
          <div className="absolute inset-4 flex flex-col items-center justify-center">
            <div
              className="relative p-4 rounded-2xl"
              style={{
                background: 'radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.6), transparent 50%), radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.5), transparent 50%), radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.6), transparent 50%)'
              }}
            >
              {renderPreviewMockup()}
              {/* View Live Profile Link */}
              <a
                href={`/u/${profile?.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-6 right-6 text-white/70 hover:text-white text-xs font-medium flex items-center space-x-1 hover:underline transition-colors bg-black/30 px-2 py-1 rounded-full"
              >
                <span>View Live</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Preview Control Buttons - Mobile Only */}
      <div className="fixed bottom-6 right-4 z-[60] lg:hidden flex items-center space-x-2">
        {/* Toggle Preview Visibility (only show when not in full screen) */}
        {!mobilePreviewOpen && (
          <button
            onClick={() => setMiniPreviewVisible(!miniPreviewVisible)}
            className={`p-3 rounded-full shadow-lg transition-all ${
              miniPreviewVisible
                ? 'bg-slate-700 text-white hover:bg-slate-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {miniPreviewVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}

        {/* Expand/Minimize Toggle */}
        <button
          onClick={() => setMobilePreviewOpen(!mobilePreviewOpen)}
          className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          {mobilePreviewOpen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Draggable Mini Preview - Mobile Only (when visible and not in full screen) */}
      {miniPreviewVisible && !mobilePreviewOpen && (
        <div
          ref={miniPreviewRef}
          className="fixed z-40 lg:hidden touch-none"
          style={{
            left: `${miniPreviewPosition.x}px`,
            top: `${miniPreviewPosition.y}px`,
            width: '70px',
            height: '151px',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {/* Drag Handle - positioned above the phone */}
          <div
            className="absolute -top-6 left-0 right-0 h-6 flex items-center justify-center cursor-grab active:cursor-grabbing z-10"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div className="bg-black/60 rounded-full px-2 py-1">
              <GripVertical className="w-4 h-4 text-white/80" />
            </div>
          </div>

          {/* Mini iPhone Frame - scaled down version */}
          <div
            className="relative w-full h-full overflow-hidden pointer-events-none"
            style={{
              transform: 'scale(0.25)',
              transformOrigin: 'top left',
              width: '280px',
              height: '605px'
            }}
          >
            {renderPreviewMockup()}
          </div>
        </div>
      )}

      {/* Main Side-by-Side Layout Container */}
      <div className="flex flex-col lg:flex-row h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl overflow-hidden shadow-2xl">

        {/* ===== PREVIEW AREA (Left Side) - Hidden on Mobile ===== */}
        <div
          ref={previewContainerRef}
          className="hidden lg:flex flex-1 justify-center items-center p-8 relative"
          style={{
            background: 'radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.6), transparent 50%), radial-gradient(circle at 85% 30%, rgba(236, 72, 153, 0.5), transparent 50%), radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.6), transparent 50%)'
          }}
        >
          {renderPreviewMockup()}
          {/* View Live Profile Link */}
          <a
            href={`/u/${profile?.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 text-white/70 hover:text-white text-xs font-medium flex items-center space-x-1 hover:underline transition-colors bg-black/30 px-2 py-1 rounded-full"
          >
            <span>View Live</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* ===== CONTROLS AREA (Right Side) ===== */}
        <div className="w-full lg:w-[380px] bg-slate-800 border-t lg:border-t-0 lg:border-l border-white/10 p-6 lg:overflow-y-auto lg:max-h-none">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <Store className="w-5 h-5 mr-2 text-blue-400" />
              Shop Customization
            </h3>
            {hasChanges && (
              <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
                Unsaved
              </span>
            )}
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.includes('success')
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {message}
            </div>
          )}

          {/* Section Tabs */}
          <div className="flex space-x-1 mb-6 bg-slate-700/50 rounded-lg p-1">
            <button
              onClick={() => setActiveSection('material')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                activeSection === 'material'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
              }`}
            >
              <Layers className="w-3 h-3 inline mr-1" />
              Material
            </button>
            <button
              onClick={() => setActiveSection('title')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                activeSection === 'title'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
              }`}
            >
              <Type className="w-3 h-3 inline mr-1" />
              Title
            </button>
            <button
              onClick={() => setActiveSection('background')}
              className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all ${
                activeSection === 'background'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
              }`}
            >
              <Image className="w-3 h-3 inline mr-1" />
              Background
            </button>
          </div>

          {/* ===== MATERIAL SECTION ===== */}
          {activeSection === 'material' && (
            <div className="space-y-6">
              {/* Glass Mode Toggle */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-white/10">
                  Glass Material
                </h4>
                <div
                  className="relative bg-slate-700 rounded-lg p-1 cursor-pointer"
                  onClick={() => setSettings({
                    ...settings,
                    glass_mode: settings.glass_mode === 'matte' ? 'gloss' : 'matte'
                  })}
                >
                  <div
                    className="absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] bg-blue-600 rounded-md transition-transform duration-300 ease-out"
                    style={{
                      transform: settings.glass_mode === 'gloss' ? 'translateX(100%)' : 'translateX(0)'
                    }}
                  />
                  <div className="relative flex">
                    <div className={`flex-1 text-center py-2 text-sm z-10 transition-colors ${
                      settings.glass_mode === 'matte' ? 'text-white' : 'text-slate-400'
                    }`}>
                      Frosted (Matte)
                    </div>
                    <div className={`flex-1 text-center py-2 text-sm z-10 transition-colors ${
                      settings.glass_mode === 'gloss' ? 'text-white' : 'text-slate-400'
                    }`}>
                      Crystal (Gloss)
                    </div>
                  </div>
                </div>
              </div>

              {/* Glass Tint */}
              <div>
                <label className="text-xs text-slate-300 mb-2 block">Glass Tint</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.glass_tint}
                    onChange={(e) => setSettings({ ...settings, glass_tint: e.target.value })}
                    className="w-10 h-10 rounded-full border-2 border-slate-600 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings.glass_tint}
                    onChange={(e) => setSettings({ ...settings, glass_tint: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Button Color */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-white/10">
                  Button Color
                </h4>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="w-12 h-12 rounded-lg border-2 border-slate-600 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  />
                </div>
                {/* Button Preview */}
                <div className="mt-3 p-3 bg-slate-700/50 rounded-lg">
                  <button
                    className="w-full py-2 rounded-lg text-white text-sm font-medium transition-all hover:opacity-90"
                    style={{ backgroundColor: settings.primary_color }}
                  >
                    Sample Button
                  </button>
                </div>
              </div>

              {/* Card Style Section */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-white/10">
                  Card Style
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSettings({
                      ...settings,
                      card_style: 'light',
                      card_color: '#FFFFFF',
                      card_text_color: '#000000'
                    })}
                    className={`p-2 rounded-lg border transition-all text-center ${
                      settings.card_style === 'light'
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                    }`}
                  >
                    <div className="w-full h-5 bg-white rounded mb-1.5"></div>
                    <span className="text-xs text-slate-300">Light</span>
                  </button>
                  <button
                    onClick={() => setSettings({
                      ...settings,
                      card_style: 'dark',
                      card_color: '#000000',
                      card_text_color: '#f2f2f2'
                    })}
                    className={`p-2 rounded-lg border transition-all text-center ${
                      settings.card_style === 'dark'
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                    }`}
                  >
                    <div className="w-full h-5 bg-black rounded mb-1.5"></div>
                    <span className="text-xs text-slate-300">Dark</span>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, card_style: 'custom' })}
                    className={`p-2 rounded-lg border transition-all text-center ${
                      settings.card_style === 'custom'
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                    }`}
                  >
                    <div className="w-full h-5 rounded mb-1.5" style={{ backgroundColor: settings.card_color }}></div>
                    <span className="text-xs text-slate-300">Custom</span>
                  </button>
                </div>
              </div>

              {/* Custom Card Colors */}
              {settings.card_style === 'custom' && (
                <div className="space-y-3 p-3 bg-slate-700/30 rounded-lg">
                  <div>
                    <label className="text-xs text-slate-300 mb-2 block">Card Background</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={settings.card_color}
                        onChange={(e) => setSettings({ ...settings, card_color: e.target.value })}
                        className="w-8 h-8 rounded-lg border border-slate-600 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.card_color}
                        onChange={(e) => setSettings({ ...settings, card_color: e.target.value })}
                        className="flex-1 px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-300 mb-2 block">Card Text</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={settings.card_text_color}
                        onChange={(e) => setSettings({ ...settings, card_text_color: e.target.value })}
                        className="w-8 h-8 rounded-lg border border-slate-600 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.card_text_color}
                        onChange={(e) => setSettings({ ...settings, card_text_color: e.target.value })}
                        className="flex-1 px-2 py-1.5 bg-slate-700 border border-slate-600 rounded text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== TITLE SECTION ===== */}
          {activeSection === 'title' && (
            <div className="space-y-6">
              {/* Font Selection */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-white/10">
                  Title Font
                </h4>
                <div className="relative">
                  <button
                    onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
                    className="w-full px-3 py-3 bg-slate-700 border border-slate-600 rounded-lg text-left flex items-center justify-between hover:bg-slate-600/50 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className="text-white font-medium"
                        style={{ fontFamily: selectedFont?.family }}
                      >
                        {selectedFont?.name}
                      </span>
                      <span className="text-xs text-slate-400 bg-slate-600 px-1.5 py-0.5 rounded">
                        {selectedFont?.category}
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${fontDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {fontDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-slate-700 rounded-lg shadow-xl border border-slate-600 z-50 max-h-64 overflow-y-auto">
                      {fontCategories.map(category => (
                        <div key={category} className="p-1">
                          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-2 py-1.5">
                            {category}
                          </div>
                          {fontOptions.filter(f => f.category === category).map((font) => (
                            <button
                              key={font.id}
                              onClick={() => {
                                setSettings({ ...settings, display_name_font: font.id as any })
                                setFontDropdownOpen(false)
                              }}
                              className={`w-full px-2 py-2 text-left hover:bg-slate-600 rounded transition-colors flex items-center justify-between ${
                                settings.display_name_font === font.id ? 'bg-blue-600/30 border-l-2 border-blue-500' : ''
                              }`}
                            >
                              <span
                                className="text-white text-sm"
                                style={{ fontFamily: font.family }}
                              >
                                {font.name}
                              </span>
                              {settings.display_name_font === font.id && (
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              )}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Title Color */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-white/10">
                  Title Color
                </h4>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.display_name_color}
                    onChange={(e) => setSettings({ ...settings, display_name_color: e.target.value })}
                    className="w-10 h-10 rounded-full border-2 border-slate-600 cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={settings.display_name_color}
                    onChange={(e) => setSettings({ ...settings, display_name_color: e.target.value })}
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Title Preview */}
              <div
                className="p-4 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: getLuminance(settings.display_name_color) > 128 ? '#1e293b' : '#f1f5f9'
                }}
              >
                <h3
                  className="text-xl font-bold text-center transition-all duration-300"
                  style={getDisplayNameStyle()}
                >
                  {displayName}
                </h3>
              </div>
            </div>
          )}

          {/* ===== BACKGROUND SECTION ===== */}
          {activeSection === 'background' && (
            <div className="space-y-6">
              {/* Background Type */}
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-white/10">
                  Background Type
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, background_type: 'image' })}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      settings.background_type === 'image'
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                    }`}
                  >
                    <Image className="w-5 h-5 mx-auto mb-1 text-slate-300" />
                    <span className="text-xs text-slate-300">Image</span>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, background_type: 'gradient' })}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      settings.background_type === 'gradient'
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                    }`}
                  >
                    <Layers className="w-5 h-5 mx-auto mb-1 text-slate-300" />
                    <span className="text-xs text-slate-300">Gradient</span>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, background_type: 'solid' })}
                    className={`p-3 rounded-lg border transition-all text-center ${
                      settings.background_type === 'solid'
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                    }`}
                  >
                    <Palette className="w-5 h-5 mx-auto mb-1 text-slate-300" />
                    <span className="text-xs text-slate-300">Solid</span>
                  </button>
                </div>
              </div>

              {/* Background Image Upload */}
              {settings.background_type === 'image' && (
                <div>
                  <div className="border-2 border-dashed border-slate-600 rounded-xl p-4 text-center hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleBackgroundImageUpload(file)
                      }}
                      className="hidden"
                      id="background-upload"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="background-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      {uploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      ) : (
                        <Upload className="w-8 h-8 text-slate-400" />
                      )}
                      <span className="text-sm text-slate-300">
                        {uploading ? 'Uploading...' : 'Upload Background'}
                      </span>
                      <span className="text-xs text-slate-500">PNG, JPG up to 10MB</span>
                    </label>
                  </div>

                  {uploadError && (
                    <div className="mt-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-xs text-red-400">{uploadError}</p>
                    </div>
                  )}

                  {settings.background_image && (
                    <div className="mt-2 p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <p className="text-xs text-green-400 flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Background uploaded
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Gradient Options */}
              {settings.background_type === 'gradient' && (
                <div className="space-y-4">
                  {/* Gradient Type */}
                  <div>
                    <label className="text-xs text-slate-300 mb-2 block">Gradient Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSettings({ ...settings, background_gradient_type: 'linear' })}
                        className={`p-2 rounded-lg border transition-all ${
                          settings.background_gradient_type === 'linear'
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="w-full h-5 rounded mb-1" style={{
                          background: `linear-gradient(to right, ${settings.primary_color}, ${settings.background_gradient_direction === 'white' ? '#FFFFFF' : '#000000'})`
                        }}></div>
                        <span className="text-[10px] text-slate-300">Linear</span>
                      </button>
                      <button
                        onClick={() => setSettings({ ...settings, background_gradient_type: 'radial' })}
                        className={`p-2 rounded-lg border transition-all ${
                          settings.background_gradient_type === 'radial'
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="w-full h-5 rounded mb-1" style={{
                          background: `radial-gradient(circle at center, ${settings.primary_color} 0%, ${settings.background_gradient_direction === 'white' ? '#FFFFFF' : '#000000'} 100%)`
                        }}></div>
                        <span className="text-[10px] text-slate-300">Radial</span>
                      </button>
                      <button
                        onClick={() => setSettings({ ...settings, background_gradient_type: 'diamond' })}
                        className={`p-2 rounded-lg border transition-all ${
                          settings.background_gradient_type === 'diamond'
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="w-full h-5 rounded mb-1" style={{
                          background: `conic-gradient(from 45deg at 50% 50%, ${settings.primary_color} 0deg, ${settings.background_gradient_direction === 'white' ? '#FFFFFF' : '#000000'} 90deg, ${settings.primary_color} 180deg, ${settings.background_gradient_direction === 'white' ? '#FFFFFF' : '#000000'} 270deg, ${settings.primary_color} 360deg)`
                        }}></div>
                        <span className="text-[10px] text-slate-300">Diamond</span>
                      </button>
                      <button
                        onClick={() => setSettings({ ...settings, background_gradient_type: 'vignette' })}
                        className={`p-2 rounded-lg border transition-all ${
                          settings.background_gradient_type === 'vignette'
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="w-full h-5 rounded mb-1" style={{
                          background: `radial-gradient(ellipse at center, ${settings.primary_color} 0%, ${settings.primary_color} 40%, ${settings.background_gradient_direction === 'white' ? '#FFFFFF' : '#000000'} 100%)`
                        }}></div>
                        <span className="text-[10px] text-slate-300">Vignette</span>
                      </button>
                    </div>
                  </div>

                  {/* Gradient Direction */}
                  <div>
                    <label className="text-xs text-slate-300 mb-2 block">Fade Direction</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSettings({ ...settings, background_gradient_direction: 'white' })}
                        className={`p-2 rounded-lg border transition-all ${
                          settings.background_gradient_direction === 'white'
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="w-full h-5 rounded mb-1 flex items-center justify-center bg-white">
                          <span className="text-[10px] text-slate-800 font-medium">White</span>
                        </div>
                        <span className="text-[10px] text-slate-300">To White</span>
                      </button>
                      <button
                        onClick={() => setSettings({ ...settings, background_gradient_direction: 'black' })}
                        className={`p-2 rounded-lg border transition-all ${
                          settings.background_gradient_direction === 'black'
                            ? 'border-blue-500 bg-blue-500/20'
                            : 'border-slate-600 hover:border-slate-500'
                        }`}
                      >
                        <div className="w-full h-5 rounded mb-1 flex items-center justify-center bg-black border border-slate-600">
                          <span className="text-[10px] text-white font-medium">Black</span>
                        </div>
                        <span className="text-[10px] text-slate-300">To Black</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 pt-4 border-t border-white/10">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{loading ? 'Saving...' : 'Save Customization'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 lg:hidden">
          <div className="bg-slate-800 rounded-full shadow-2xl border border-slate-700 p-2 flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-all duration-200"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Cancel</span>
            </button>
            <div className="w-px h-6 bg-slate-600"></div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{loading ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
