import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useImageUpload } from '../hooks/useImageUpload'
import { supabase } from '../lib/supabase'
import { Palette, Image, Layers, Save, Upload, Type, Sparkles, ChevronDown, Store, X, Eye, EyeOff } from 'lucide-react'

export default function ProfileCustomization() {
  const { profile, refreshProfile } = useAuth()
  const { uploadImage, uploading, error: uploadError } = useImageUpload()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false)
  const [showFloatingPreview, setShowFloatingPreview] = useState(false)
  const [previewHidden, setPreviewHidden] = useState(false)
  const livePreviewRef = useRef<HTMLDivElement>(null)

  // Initial settings from profile - check localStorage for original font selection
  const getInitialSettings = () => {
    let initialFont = profile?.display_name_font || 'inter'
    let initialColor = profile?.display_name_color || '#FFFFFF'
    let initialCardStyle = profile?.card_style || 'light'
    let initialCardColor = profile?.card_color || '#FFFFFF'
    let initialCardTextColor = profile?.card_text_color || '#000000'

    // Check localStorage for original font selection
    try {
      const storedFontStyling = localStorage.getItem(`fontStyling_${profile?.user_id}`)
      if (storedFontStyling) {
        const parsed = JSON.parse(storedFontStyling)
        console.log('ProfileCustomization - Found font styling in localStorage:', parsed)
        initialFont = parsed.original_font || initialFont
        initialColor = parsed.display_name_color || initialColor
      }

      const storedCardStyling = localStorage.getItem(`cardStyling_${profile?.user_id}`)
      if (storedCardStyling) {
        const parsed = JSON.parse(storedCardStyling)
        console.log('ProfileCustomization - Found card styling in localStorage:', parsed)
        initialCardStyle = parsed.card_style || initialCardStyle
        initialCardColor = parsed.card_color || initialCardColor
        initialCardTextColor = parsed.card_text_color || initialCardTextColor
      }
    } catch (error) {
      console.error('Error reading styling from localStorage:', error)
    }

    return {
      background_type: profile?.background_type || 'image',
      background_image: profile?.background_image || '',
      background_gradient_direction: profile?.background_gradient_direction || 'white',
      primary_color: profile?.primary_color || '#3B82F6',
      display_name_color: initialColor,
      display_name_font: initialFont,
      card_style: initialCardStyle,
      card_color: initialCardColor,
      card_text_color: initialCardTextColor
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

  // Scroll detection for floating preview
  useEffect(() => {
    const handleScroll = () => {
      if (livePreviewRef.current) {
        const rect = livePreviewRef.current.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0
        setShowFloatingPreview(hasChanges && !isVisible)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasChanges])

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
      // Map new fonts to allowed database values
      const allowedFonts = ['merriweather', 'poppins', 'orbitron', 'montserrat', 'inter', 'papyrus', 'sansserif']
      let fontToSave = settings.display_name_font

      // If the selected font is not in the allowed list, map it to a similar allowed font
      if (!allowedFonts.includes(settings.display_name_font)) {
        const fontMappings: Record<string, string> = {
          // Modern fonts -> inter or poppins
          'roboto': 'inter',
          'opensans': 'inter',
          'lato': 'inter',
          'nunito': 'poppins',
          'sourcesans': 'inter',
          'worksans': 'inter',
          'firasans': 'inter',
          'dmsans': 'inter',
          'rubik': 'poppins',
          
          // Serif fonts -> merriweather
          'playfair': 'merriweather',
          'crimson': 'merriweather',
          'lora': 'merriweather',
          'cormorant': 'merriweather',
          'ebgaramond': 'merriweather',
          'librebaskerville': 'merriweather',
          'oldstandard': 'merriweather',
          'spectral': 'merriweather',
          'vollkorn': 'merriweather',
          
          // Display fonts -> orbitron
          'raleway': 'orbitron',
          'oswald': 'orbitron',
          'bebas': 'orbitron',
          'anton': 'orbitron',
          'bangers': 'orbitron',
          'fredoka': 'orbitron',
          'righteous': 'orbitron',
          'comfortaa': 'orbitron',
          'quicksand': 'orbitron',
          'archivo': 'orbitron',
          'bungee': 'orbitron',
          'creepster': 'orbitron',
          'monoton': 'orbitron',
          'pressstart': 'orbitron',
          
          // Script fonts -> papyrus
          'dancing': 'papyrus',
          'pacifico': 'papyrus',
          'caveat': 'papyrus',
          'greatvibes': 'papyrus',
          'sacramento': 'papyrus',
          'allura': 'papyrus',
          'satisfy': 'papyrus',
          'kaushan': 'papyrus',
          'amatic': 'papyrus',
          'shadows': 'papyrus',
          'indie': 'papyrus',
          'permanent': 'papyrus',
          'cookie': 'papyrus',
          'tangerine': 'papyrus',
          'lobster': 'papyrus',
          'courgette': 'papyrus',
          
          // Monospace fonts -> sansserif
          'firacode': 'sansserif',
          'sourcecodepro': 'sansserif',
          'robotomono': 'sansserif',
          'spacemono': 'sansserif',
          'jetbrains': 'sansserif',
          'ubuntumono': 'sansserif',
          
          // Artistic fonts -> papyrus
          'nosifer': 'papyrus',
          'eater': 'papyrus',
          'chela': 'papyrus',
          'fascinate': 'papyrus',
          'griffy': 'papyrus',
          'henny': 'papyrus',
          'jolly': 'papyrus',
          'kalam': 'papyrus',
          'lacquer': 'papyrus',
          'luckiest': 'papyrus',
          'mystery': 'papyrus',
          'pirata': 'papyrus',
          'rye': 'papyrus',
          'smokum': 'papyrus',
          'special': 'papyrus',
          'trade': 'papyrus',
          'vampiro': 'papyrus',
          
          // Luxury fonts -> merriweather
          'cinzel': 'merriweather',
          'cinzeldecorative': 'merriweather',
          'forum': 'merriweather',
          'marcellus': 'merriweather',
          'trajan': 'merriweather',
          'yeseva': 'merriweather',
          'abril': 'merriweather',
          'cardo': 'merriweather',
          'sorts': 'merriweather',
          'unna': 'merriweather'
        }
        
        fontToSave = fontMappings[settings.display_name_font] || 'inter'
      }

      // Only include fields that exist in the database
      const updateData = {
        background_type: settings.background_type,
        background_image: settings.background_image,
        background_gradient_direction: settings.background_gradient_direction,
        primary_color: settings.primary_color,
        display_name_color: settings.display_name_color,
        display_name_font: fontToSave, // Use mapped font
        updated_at: new Date().toISOString()
      }

      console.log('Saving profile customization:', updateData)
      console.log(`Font mapping: ${settings.display_name_font} -> ${fontToSave}`)

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', profile.user_id)

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      // Store card styling AND original font selection in localStorage temporarily until database migration
      const cardStyling = {
        card_style: settings.card_style,
        card_color: settings.card_color,
        card_text_color: settings.card_text_color,
        user_id: profile.user_id
      }
      localStorage.setItem(`cardStyling_${profile.user_id}`, JSON.stringify(cardStyling))
      console.log('Card styling saved to localStorage:', cardStyling)

      // Store original font selection for ProfilePage to use
      const fontStyling = {
        original_font: settings.display_name_font, // Store the original font selection
        mapped_font: fontToSave, // Store the database-compatible font
        display_name_color: settings.display_name_color,
        user_id: profile.user_id
      }
      localStorage.setItem(`fontStyling_${profile.user_id}`, JSON.stringify(fontStyling))
      console.log('Font styling saved to localStorage:', fontStyling)

      // Refresh the profile to get updated data
      await refreshProfile()
      
      const fontMessage = fontToSave !== settings.display_name_font 
        ? ` (Font mapped to ${fontToSave} for database compatibility)`
        : ''
      
      setMessage(`Profile customization saved successfully!${fontMessage} (Card styling temporarily stored locally until database update)`)

      setTimeout(() => setMessage(''), 5000)
    } catch (error: any) {
      console.error('Error saving customization:', error)
      setMessage(`Failed to save customization: ${error.message || 'Please try again.'}`)
    } finally {
      setLoading(false)
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
      const targetColor = settings.background_gradient_direction === 'white' ? '#FFFFFF' : '#000000'
      return {
        backgroundImage: `linear-gradient(to right, ${settings.primary_color}, ${targetColor})`
      }
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

  // Truncate bio to 100 characters
  const truncatedBio = (profile?.bio || 'Your shop description will appear here').length > 100 
    ? (profile?.bio || 'Your shop description will appear here').substring(0, 100) + '...'
    : (profile?.bio || 'Your shop description will appear here')

  const selectedFont = fontOptions.find(f => f.id === settings.display_name_font)
  const fontCategories = [...new Set(fontOptions.map(f => f.category))]

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-900">
          <Store className="w-6 h-6 mr-3 text-blue-600" />
          Shop Customization
        </h3>

        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.includes('success')
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-3 ${
                message.includes('success') ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              {message}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Button & Card Color Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                <Palette className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Button & Card Colors</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Choose your button and card styling</p>
            
            <div className="space-y-6">
              {/* Button Color Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Button Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.primary_color}
                    onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                    className="w-16 h-16 rounded-xl border-2 border-gray-300 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={settings.primary_color}
                      onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
              </div>

              {/* Card Style Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Card Style</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSettings({ 
                      ...settings, 
                      card_style: 'light',
                      card_color: '#FFFFFF',
                      card_text_color: '#000000'
                    })}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      settings.card_style === 'light'
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-full h-6 bg-white border border-gray-200 rounded mb-2 shadow-sm"></div>
                    <span className="text-xs font-medium">Light</span>
                  </button>
                  <button
                    onClick={() => setSettings({ 
                      ...settings, 
                      card_style: 'dark',
                      card_color: '#000000',
                      card_text_color: '#f2f2f2'
                    })}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      settings.card_style === 'dark'
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-full h-6 bg-black rounded mb-2 shadow-sm"></div>
                    <span className="text-xs font-medium">Dark</span>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, card_style: 'custom' })}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      settings.card_style === 'custom'
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-full h-6 rounded mb-2 shadow-sm" style={{ backgroundColor: settings.card_color }}></div>
                    <span className="text-xs font-medium">Custom</span>
                  </button>
                </div>
              </div>

              {/* Custom Card Colors */}
              {settings.card_style === 'custom' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Background Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.card_color}
                        onChange={(e) => setSettings({ ...settings, card_color: e.target.value })}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      />
                      <input
                        type="text"
                        value={settings.card_color}
                        onChange={(e) => setSettings({ ...settings, card_color: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Text Color</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.card_text_color}
                        onChange={(e) => setSettings({ ...settings, card_text_color: e.target.value })}
                        className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      />
                      <input
                        type="text"
                        value={settings.card_text_color}
                        onChange={(e) => setSettings({ ...settings, card_text_color: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Combined Preview */}
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Preview</span>
                  <button
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:shadow-md transition-all"
                    style={{ backgroundColor: settings.primary_color }}
                  >
                    Sample Button
                  </button>
                </div>
                <div 
                  className="p-3 rounded-lg shadow-sm border"
                  style={{ 
                    backgroundColor: settings.card_color,
                    color: settings.card_text_color,
                    borderColor: settings.card_style === 'light' ? '#E5E7EB' : '#4B5563'
                  }}
                >
                  <h4 className="font-semibold text-sm mb-1">Sample Product Card</h4>
                  <p className="text-xs opacity-80">This is how your product cards will look</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shop Name Style Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                <Type className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Shop Name Style</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Customize your shop name appearance</p>

            <div className="space-y-4">
              {/* Font Selection Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                <button
                  onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <span 
                      className="font-medium text-gray-900 mr-2"
                      style={{ fontFamily: selectedFont?.family }}
                    >
                      {selectedFont?.name}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {selectedFont?.category}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${fontDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {fontDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
                    {fontCategories.map(category => (
                      <div key={category} className="p-2">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
                          {category}
                        </div>
                        {fontOptions.filter(f => f.category === category).map((font) => (
                          <button
                            key={font.id}
                            onClick={() => {
                              setSettings({ ...settings, display_name_font: font.id as any })
                              setFontDropdownOpen(false)
                            }}
                            className={`w-full px-3 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between ${
                              settings.display_name_font === font.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <div className="flex-1">
                              <div 
                                className="font-medium text-lg p-2 rounded mb-1 transition-all duration-300"
                                style={{ 
                                  fontFamily: font.family,
                                  color: settings.display_name_color,
                                  backgroundColor: getLuminance(settings.display_name_color) > 128 ? '#1F2937' : '#F3F4F6'
                                }}
                              >
                                {profile?.display_name || 'Your Shop Name'}
                              </div>
                              <div className="text-xs text-gray-500">{font.name}</div>
                            </div>
                            {settings.display_name_font === font.id && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.display_name_color}
                    onChange={(e) => setSettings({ ...settings, display_name_color: e.target.value })}
                    className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  />
                  <input
                    type="text"
                    value={settings.display_name_color}
                    onChange={(e) => setSettings({ ...settings, display_name_color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>

              {/* Live Preview */}
              <div 
                className="p-4 rounded-lg border border-gray-200 transition-all duration-300"
                style={{
                  backgroundColor: getLuminance(settings.display_name_color) > 128 ? '#1F2937' : '#F3F4F6'
                }}
              >
                <div className="text-center">
                  <h3
                    className="text-xl font-bold transition-all duration-300"
                    style={getDisplayNameStyle()}
                  >
                    {profile?.display_name || 'Your Shop Name'}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Background Style Card */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                <Image className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">Background Style</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Set your profile background</p>

            <div className="space-y-4">
              {/* Background Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Background Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, background_type: 'image' })}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      settings.background_type === 'image'
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Image className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-medium">Image</span>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, background_type: 'gradient' })}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      settings.background_type === 'gradient'
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Layers className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-medium">Gradient</span>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, background_type: 'solid' })}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      settings.background_type === 'solid'
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Palette className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-xs font-medium">Solid</span>
                  </button>
                </div>
              </div>

              {/* Background Image Upload */}
              {settings.background_type === 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Upload Background</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200">
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
                      className="cursor-pointer flex flex-col items-center space-y-3"
                    >
                      {uploading ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-900 block">
                          {uploading ? 'Uploading...' : 'Upload Background Image'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1 block">
                          PNG, JPG up to 10MB
                        </span>
                      </div>
                    </label>
                  </div>

                  {uploadError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{uploadError}</p>
                    </div>
                  )}

                  {settings.background_image && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-600 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Background image uploaded successfully
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Gradient Direction */}
              {settings.background_type === 'gradient' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Gradient Style</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSettings({ ...settings, background_gradient_direction: 'white' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.background_gradient_direction === 'white'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-8 rounded-lg mb-2 shadow-sm" style={{
                        background: `linear-gradient(to right, ${settings.primary_color}, #FFFFFF)`
                      }}></div>
                      <span className="text-xs font-medium">To White</span>
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, background_gradient_direction: 'black' })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        settings.background_gradient_direction === 'black'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full h-8 rounded-lg mb-2 shadow-sm" style={{
                        background: `linear-gradient(to right, ${settings.primary_color}, #000000)`
                      }}></div>
                      <span className="text-xs font-medium">To Black</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{loading ? 'Saving Changes...' : 'Save Customization'}</span>
          </button>
        </div>

        {/* Live Preview Section */}
        <div ref={livePreviewRef} className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
              Live Preview
            </h4>
            <a
              href={`/u/${profile?.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1 hover:underline"
            >
              <span>View Live Profile</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          
          <div className="bg-gray-100 rounded-xl p-8">
            {/* iPhone 16 Mockup */}
            <div className="mx-auto relative" style={{ width: '320px', height: '692px' }}>
              {/* iPhone Frame */}
              <div className="absolute inset-0 bg-black rounded-[3rem] shadow-2xl">
                {/* Screen */}
                <div className="absolute inset-2 bg-white rounded-[2.5rem] overflow-hidden">
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-12 bg-black z-20 flex items-center justify-between px-6 pt-2 rounded-t-[2.5rem]">
                    {/* Left side - Time */}
                    <div className="text-white text-sm font-semibold">
                      9:41
                    </div>
                    
                    {/* Right side - Signal, WiFi, Battery */}
                    <div className="flex items-center space-x-1">
                      {/* Signal bars */}
                      <div className="flex items-end space-x-0.5">
                        <div className="w-1 h-1 bg-white rounded-full"></div>
                        <div className="w-1 h-1.5 bg-white rounded-full"></div>
                        <div className="w-1 h-2 bg-white rounded-full"></div>
                        <div className="w-1 h-2.5 bg-white rounded-full"></div>
                      </div>
                      
                      {/* WiFi icon */}
                      <svg className="w-4 h-4 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                      </svg>
                      
                      {/* Battery */}
                      <div className="flex items-center ml-1">
                        <div className="w-6 h-3 border border-white rounded-sm relative">
                          <div className="absolute inset-0.5 bg-white rounded-sm" style={{ width: '80%' }}></div>
                        </div>
                        <div className="w-0.5 h-1.5 bg-white rounded-r-sm ml-0.5"></div>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Island */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-10"></div>
                  
                  {/* Profile Page Content - Starts below status bar */}
                  <div
                    className="absolute top-12 left-0 right-0 bottom-0 transition-all duration-500 ease-in-out overflow-hidden rounded-b-[2.5rem]"
                    style={previewStyle()}
                  >
                    <div className="bg-black bg-opacity-10 min-h-full">
                      {/* Header Section - Matching ProfilePage.tsx exactly */}
                      <header className="p-2 md:p-4 text-white text-center">
                        <div className="max-w-full mx-auto p-3 md:p-4 glass-panel rounded-xl">
                          <div className="flex flex-col items-center space-y-2">
                            <div className="text-center">
                              <h1
                                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2"
                                style={getDisplayNameStyle()}
                              >
                                {profile?.display_name || 'Your Shop Name'}
                              </h1>
                              {truncatedBio && (
                                <p className="text-xs md:text-sm product-text opacity-80 mt-2 max-w-full mx-auto">
                                  {truncatedBio}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </header>

                      {/* Main Content */}
                      <main className="max-w-full mx-auto px-2 py-3">
                        {/* Category Dropdown - Matching ProfilePage.tsx */}
                        <div className="mb-4">
                          <div className="relative">
                            <button 
                              className="w-full p-2 rounded-lg shadow-lg focus:outline-none cursor-pointer flex items-center justify-between hover:shadow-xl transition-all border"
                              style={{
                                backgroundColor: settings.card_color,
                                color: settings.card_text_color,
                                borderColor: settings.card_color === '#FFFFFF' ? '#E5E7EB' : settings.card_color
                              }}
                            >
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: settings.card_text_color }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <span className="font-medium text-xs">All categories</span>
                                <span className="text-xs opacity-70">(6)</span>
                              </div>
                              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: settings.card_text_color }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {/* Product Grid - Matching ProfilePage.tsx grid */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* Product Card 1 */}
                          <div className="product-card rounded-lg overflow-hidden glass-panel cursor-pointer hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-16 bg-white/20 flex items-center justify-center">
                              <svg className="w-4 h-4 product-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                              </svg>
                            </div>
                            <div className="p-2">
                              <h3 className="product-text font-semibold text-xs mb-1">
                                Premium Headphones
                              </h3>
                              <button
                                className="w-full py-1 rounded-lg font-medium transition-all duration-200 hover:opacity-90 text-white text-xs"
                                style={{ backgroundColor: settings.primary_color }}
                              >
                                Open Product
                              </button>
                            </div>
                          </div>

                          {/* Product Card 2 */}
                          <div className="product-card rounded-lg overflow-hidden glass-panel cursor-pointer hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-16 bg-white/20 flex items-center justify-center">
                              <svg className="w-4 h-4 product-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div className="p-2">
                              <h3 className="product-text font-semibold text-xs mb-1">
                                Smart Watch
                              </h3>
                              <button
                                className="w-full py-1 rounded-lg font-medium transition-all duration-200 hover:opacity-90 text-white text-xs"
                                style={{ backgroundColor: settings.primary_color }}
                              >
                                Open Product
                              </button>
                            </div>
                          </div>

                          {/* Product Card 3 */}
                          <div className="product-card rounded-lg overflow-hidden glass-panel cursor-pointer hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-16 bg-white/20 flex items-center justify-center">
                              <svg className="w-4 h-4 product-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                              </svg>
                            </div>
                            <div className="p-2">
                              <h3 className="product-text font-semibold text-xs mb-1">
                                Wireless Speaker
                              </h3>
                              <button
                                className="w-full py-1 rounded-lg font-medium transition-all duration-200 hover:opacity-90 text-white text-xs"
                                style={{ backgroundColor: settings.primary_color }}
                              >
                                Open Product
                              </button>
                            </div>
                          </div>

                          {/* Product Card 4 */}
                          <div className="product-card rounded-lg overflow-hidden glass-panel cursor-pointer hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-16 bg-white/20 flex items-center justify-center">
                              <svg className="w-4 h-4 product-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="p-2">
                              <h3 className="product-text font-semibold text-xs mb-1">
                                Gaming Monitor
                              </h3>
                              <button
                                className="w-full py-1 rounded-lg font-medium transition-all duration-200 hover:opacity-90 text-white text-xs"
                                style={{ backgroundColor: settings.primary_color }}
                              >
                                Open Product
                              </button>
                            </div>
                          </div>

                          {/* Product Card 5 */}
                          <div className="product-card rounded-lg overflow-hidden glass-panel cursor-pointer hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-16 bg-white/20 flex items-center justify-center">
                              <svg className="w-4 h-4 product-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="p-2">
                              <h3 className="product-text font-semibold text-xs mb-1">
                                Smartphone
                              </h3>
                              <button
                                className="w-full py-1 rounded-lg font-medium transition-all duration-200 hover:opacity-90 text-white text-xs"
                                style={{ backgroundColor: settings.primary_color }}
                              >
                                Open Product
                              </button>
                            </div>
                          </div>

                          {/* Product Card 6 */}
                          <div className="product-card rounded-lg overflow-hidden glass-panel cursor-pointer hover:scale-105 transition-transform duration-300">
                            <div className="w-full h-16 bg-white/20 flex items-center justify-center">
                              <svg className="w-4 h-4 product-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 6v10h6V6H9z" />
                              </svg>
                            </div>
                            <div className="p-2">
                              <h3 className="product-text font-semibold text-xs mb-1">
                                Wireless Earbuds
                              </h3>
                              <button
                                className="w-full py-1 rounded-lg font-medium transition-all duration-200 hover:opacity-90 text-white text-xs"
                                style={{ backgroundColor: settings.primary_color }}
                              >
                                Open Product
                              </button>
                            </div>
                          </div>
                        </div>
                      </main>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-white rounded-full shadow-2xl border border-gray-200 p-2 flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-all duration-200"
            >
              <X className="w-4 h-4" />
              <span className="text-sm font-medium">Cancel</span>
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Mini Preview - 50% smaller with large minimize button */}
      {showFloatingPreview && !previewHidden && (
        <div className="fixed top-20 right-6 z-40 bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Live Preview</span>
            </div>
            <button
              onClick={() => setPreviewHidden(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 rounded-lg p-2 transition-all duration-200 flex items-center space-x-2 text-sm font-medium"
              title="Minimize preview"
            >
              <span>Minimize</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>
          
          {/* Mini iPhone Preview - 50% smaller */}
          <div className="relative" style={{ width: '80px', height: '173px' }}>
            {/* iPhone Frame */}
            <div className="absolute inset-0 bg-black rounded-[0.75rem] shadow-lg">
              {/* Screen */}
              <div className="absolute inset-0.5 bg-white rounded-[0.625rem] overflow-hidden">
                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-3 bg-black z-20 flex items-center justify-between px-1.5 pt-0.5 rounded-t-[0.625rem]">
                  <div className="text-white text-[6px] font-semibold">9:41</div>
                  <div className="flex items-center space-x-0.5">
                    <div className="flex items-end space-x-0.5">
                      <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                      <div className="w-0.5 h-0.5 bg-white rounded-full"></div>
                      <div className="w-0.5 h-1 bg-white rounded-full"></div>
                      <div className="w-0.5 h-1 bg-white rounded-full"></div>
                    </div>
                    <div className="flex items-center ml-0.5">
                      <div className="w-1.5 h-0.5 border border-white rounded-sm relative">
                        <div className="absolute inset-0.5 bg-white rounded-sm" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Island */}
                <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1.5 bg-black rounded-full z-10"></div>
                
                {/* Content */}
                <div
                  className="absolute top-3 left-0 right-0 bottom-0 transition-all duration-300 overflow-hidden rounded-b-[0.625rem]"
                  style={previewStyle()}
                >
                  <div className="bg-black bg-opacity-10 min-h-full">
                    <header className="p-0.5 text-white text-center">
                      <div className="max-w-full mx-auto p-0.5 glass-panel rounded-sm">
                        <h1
                          className="text-[6px] font-bold mb-0.5"
                          style={getDisplayNameStyle()}
                        >
                          {profile?.display_name || 'Shop'}
                        </h1>
                        <p className="text-[4px] product-text opacity-80 truncate">
                          {profile?.bio || 'Description'}
                        </p>
                      </div>
                    </header>

                    <main className="px-0.5 py-0.5">
                      <div className="mb-1">
                        <button 
                          className="w-full p-0.5 rounded text-[4px] flex items-center justify-between"
                          style={{
                            backgroundColor: settings.card_color,
                            color: settings.card_text_color
                          }}
                        >
                          <span>All (6)</span>
                          <svg className="h-1 w-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-0.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="glass-panel rounded p-0.5">
                            <div className="w-full h-4 bg-white/20 rounded mb-0.5"></div>
                            <div className="text-[4px] product-text font-medium mb-0.5 truncate">Product {i}</div>
                            <button
                              className="w-full py-0.5 rounded text-white text-[4px]"
                              style={{ backgroundColor: settings.primary_color }}
                            >
                              Open
                            </button>
                          </div>
                        ))}
                      </div>
                    </main>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Preview Toggle Button - Large and prominent */}
      {showFloatingPreview && previewHidden && (
        <div className="fixed top-20 right-6 z-40">
          <button
            onClick={() => setPreviewHidden(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3 shadow-2xl hover:shadow-3xl transition-all duration-200 flex items-center space-x-2 text-sm font-medium transform hover:scale-105"
            title="Show preview"
          >
            <Eye className="w-4 h-4" />
            <span>Show Preview</span>
          </button>
        </div>
      )}

      <style>{`
        .glass-panel {
          background: ${hexToRgba(settings.card_color, 0.2)};
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid ${hexToRgba(settings.card_color, 0.3)};
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }

        .product-text {
          color: ${settings.card_text_color};
          transition: color 0.5s ease-in-out;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .product-card {
          animation: slideInUp 0.5s ease-out forwards;
          opacity: 0;
        }

        .product-card:nth-child(1) { animation-delay: 0.1s; }
        .product-card:nth-child(2) { animation-delay: 0.2s; }
        .product-card:nth-child(3) { animation-delay: 0.3s; }
        .product-card:nth-child(4) { animation-delay: 0.4s; }
        .product-card:nth-child(5) { animation-delay: 0.5s; }
        .product-card:nth-child(6) { animation-delay: 0.6s; }
      `}</style>
    </div>
  )
}
