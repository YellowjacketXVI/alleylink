import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, type Profile, type Product } from '../lib/supabase'
import { useProducts } from '../hooks/useProducts'
import { ExternalLink, ArrowLeft, User, MapPin, Calendar, Tag, ChevronDown, Filter, Star } from 'lucide-react'
import Navbar from '../components/Navbar'

// Comprehensive font mapping that supports all possible fonts
const fontMap: Record<string, string> = {
  // Modern Sans-Serif
  'inter': 'Inter, sans-serif',
  'poppins': 'Poppins, sans-serif',
  'montserrat': 'Montserrat, sans-serif',
  'roboto': 'Roboto, sans-serif',
  'opensans': 'Open Sans, sans-serif',
  'lato': 'Lato, sans-serif',
  'nunito': 'Nunito, sans-serif',
  'sourcesans': 'Source Sans Pro, sans-serif',
  'worksans': 'Work Sans, sans-serif',
  'firasans': 'Fira Sans, sans-serif',
  'dmsans': 'DM Sans, sans-serif',
  'rubik': 'Rubik, sans-serif',

  // Classic Serif
  'merriweather': 'Merriweather, serif',
  'playfair': 'Playfair Display, serif',
  'crimson': 'Crimson Text, serif',
  'lora': 'Lora, serif',
  'cormorant': 'Cormorant Garamond, serif',
  'ebgaramond': 'EB Garamond, serif',
  'librebaskerville': 'Libre Baskerville, serif',
  'oldstandard': 'Old Standard TT, serif',
  'spectral': 'Spectral, serif',
  'vollkorn': 'Vollkorn, serif',

  // Display & Stylized
  'orbitron': 'Orbitron, sans-serif',
  'raleway': 'Raleway, sans-serif',
  'oswald': 'Oswald, sans-serif',
  'bebas': 'Bebas Neue, sans-serif',
  'anton': 'Anton, sans-serif',
  'bangers': 'Bangers, cursive',
  'fredoka': 'Fredoka One, cursive',
  'righteous': 'Righteous, cursive',
  'comfortaa': 'Comfortaa, cursive',
  'quicksand': 'Quicksand, sans-serif',
  'archivo': 'Archivo Black, sans-serif',
  'bungee': 'Bungee, cursive',
  'creepster': 'Creepster, cursive',
  'monoton': 'Monoton, cursive',
  'pressstart': 'Press Start 2P, cursive',

  // Script & Cursive
  'dancing': 'Dancing Script, cursive',
  'pacifico': 'Pacifico, cursive',
  'caveat': 'Caveat, cursive',
  'greatvibes': 'Great Vibes, cursive',
  'sacramento': 'Sacramento, cursive',
  'allura': 'Allura, cursive',
  'satisfy': 'Satisfy, cursive',
  'kaushan': 'Kaushan Script, cursive',
  'amatic': 'Amatic SC, cursive',
  'shadows': 'Shadows Into Light, cursive',
  'indie': 'Indie Flower, cursive',
  'permanent': 'Permanent Marker, cursive',
  'cookie': 'Cookie, cursive',
  'tangerine': 'Tangerine, cursive',
  'lobster': 'Lobster, cursive',
  'courgette': 'Courgette, cursive',

  // Monospace & Tech
  'firacode': 'Fira Code, monospace',
  'sourcecodepro': 'Source Code Pro, monospace',
  'robotomono': 'Roboto Mono, monospace',
  'spacemono': 'Space Mono, monospace',
  'jetbrains': 'JetBrains Mono, monospace',
  'ubuntumono': 'Ubuntu Mono, monospace',

  // Unique & Artistic
  'nosifer': 'Nosifer, cursive',
  'eater': 'Eater, cursive',
  'chela': 'Chela One, cursive',
  'fascinate': 'Fascinate, cursive',
  'griffy': 'Griffy, cursive',
  'henny': 'Henny Penny, cursive',
  'jolly': 'Jolly Lodger, cursive',
  'kalam': 'Kalam, cursive',
  'lacquer': 'Lacquer, cursive',
  'luckiest': 'Luckiest Guy, cursive',
  'mystery': 'Mystery Quest, cursive',
  'pirata': 'Pirata One, cursive',
  'rye': 'Rye, cursive',
  'smokum': 'Smokum, cursive',
  'special': 'Special Elite, cursive',
  'trade': 'Trade Winds, cursive',
  'vampiro': 'Vampiro One, cursive',
  'papyrus': 'Papyrus, fantasy',

  // Elegant & Luxury
  'cinzel': 'Cinzel, serif',
  'cinzeldecorative': 'Cinzel Decorative, cursive',
  'forum': 'Forum, cursive',
  'marcellus': 'Marcellus, serif',
  'trajan': 'Trajan Pro, serif',
  'yeseva': 'Yeseva One, cursive',
  'abril': 'Abril Fatface, cursive',
  'cardo': 'Cardo, serif',
  'sorts': 'Sorts Mill Goudy, serif',
  'unna': 'Unna, serif',

  // System Fonts
  'sansserif': 'sans-serif'
}

// Helper function to get display name style - uses database values directly
const getDisplayNameStyle = (profile: Profile) => {
  // Get font and color directly from database (no localStorage needed now)
  const fontToUse = profile.display_name_font || 'inter'
  const colorToUse = profile.display_name_color || '#FFFFFF'

  // Get font family from map, fallback to Inter if not found
  const fontFamily = fontMap[fontToUse] || 'Inter, sans-serif'

  console.log('ProfilePage - Font styling:', {
    database_font: profile.display_name_font,
    final_font: fontToUse,
    final_fontFamily: fontFamily,
    final_color: colorToUse
  })

  return {
    fontFamily,
    color: colorToUse,
    fontWeight: '700',
    letterSpacing: '0.015em',
    lineHeight: '1.06'
  }
}

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [loadingTimeout, setLoadingTimeout] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Only fetch products after profile is loaded
  const { products, loading: productsLoading, trackClick } = useProducts(profile?.user_id)

  // Load Google Fonts dynamically when profile loads
  useEffect(() => {
    if (!profile) return

    const loadGoogleFonts = () => {
      // List of all Google Fonts used in the app
      const googleFonts = [
        'Inter:wght@400;700',
        'Poppins:wght@400;700',
        'Montserrat:wght@400;700',
        'Roboto:wght@400;700',
        'Open+Sans:wght@400;700',
        'Lato:wght@400;700',
        'Nunito:wght@400;700',
        'Source+Sans+Pro:wght@400;700',
        'Work+Sans:wght@400;700',
        'Fira+Sans:wght@400;700',
        'DM+Sans:wght@400;700',
        'Rubik:wght@400;700',
        'Merriweather:wght@400;700',
        'Playfair+Display:wght@400;700',
        'Crimson+Text:wght@400;700',
        'Lora:wght@400;700',
        'Cormorant+Garamond:wght@400;700',
        'EB+Garamond:wght@400;700',
        'Libre+Baskerville:wght@400;700',
        'Old+Standard+TT:wght@400;700',
        'Spectral:wght@400;700',
        'Vollkorn:wght@400;700',
        'Orbitron:wght@400;700',
        'Raleway:wght@400;700',
        'Oswald:wght@400;700',
        'Bebas+Neue:wght@400',
        'Anton:wght@400',
        'Bangers:wght@400',
        'Fredoka+One:wght@400',
        'Righteous:wght@400',
        'Comfortaa:wght@400;700',
        'Quicksand:wght@400;700',
        'Archivo+Black:wght@400',
        'Bungee:wght@400',
        'Creepster:wght@400',
        'Monoton:wght@400',
        'Press+Start+2P:wght@400',
        'Dancing+Script:wght@400;700',
        'Pacifico:wght@400',
        'Caveat:wght@400;700',
        'Great+Vibes:wght@400',
        'Sacramento:wght@400',
        'Allura:wght@400',
        'Satisfy:wght@400',
        'Kaushan+Script:wght@400',
        'Amatic+SC:wght@400;700',
        'Shadows+Into+Light:wght@400',
        'Indie+Flower:wght@400',
        'Permanent+Marker:wght@400',
        'Cookie:wght@400',
        'Tangerine:wght@400;700',
        'Lobster:wght@400',
        'Courgette:wght@400',
        'Fira+Code:wght@400;700',
        'Source+Code+Pro:wght@400;700',
        'Roboto+Mono:wght@400;700',
        'Space+Mono:wght@400;700',
        'JetBrains+Mono:wght@400;700',
        'Ubuntu+Mono:wght@400;700',
        'Nosifer:wght@400',
        'Eater:wght@400',
        'Chela+One:wght@400',
        'Fascinate:wght@400',
        'Griffy:wght@400',
        'Henny+Penny:wght@400',
        'Jolly+Lodger:wght@400',
        'Kalam:wght@400;700',
        'Lacquer:wght@400',
        'Luckiest+Guy:wght@400',
        'Mystery+Quest:wght@400',
        'Pirata+One:wght@400',
        'Rye:wght@400',
        'Smokum:wght@400',
        'Special+Elite:wght@400',
        'Trade+Winds:wght@400',
        'Vampiro+One:wght@400',
        'Cinzel:wght@400;700',
        'Cinzel+Decorative:wght@400;700',
        'Forum:wght@400',
        'Marcellus:wght@400',
        'Yeseva+One:wght@400',
        'Abril+Fatface:wght@400',
        'Cardo:wght@400;700',
        'Sorts+Mill+Goudy:wght@400',
        'Unna:wght@400;700'
      ]

      if (!document.querySelector('#profile-google-fonts')) {
        const link = document.createElement('link')
        link.id = 'profile-google-fonts'
        link.href = `https://fonts.googleapis.com/css2?${googleFonts.join('&family=')}&display=swap`
        link.rel = 'stylesheet'
        document.head.appendChild(link)
      }
    }

    loadGoogleFonts()
  }, [profile])

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

useEffect(() => {
  console.log('ProfilePage useEffect triggered with username:', username)
  if (username) {
    fetchProfile()

    timeoutRef.current = setTimeout(() => {
      console.log('Profile loading timeout reached')
      setLoadingTimeout(true)
      setLoading(false)
      setError('Profile loading timed out. Please try refreshing the page.')
    }, 10000)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  } else {
    console.log('No username provided to ProfilePage')
    setLoading(false)
    setError('No username provided')
  }
}, [username])

// Reset to 'all' if current selection is no longer valid
useEffect(() => {
  // This effect needs to run after products are loaded
  if (products.length > 0) {
    const categories = Array.from(new Set(products.flatMap(product => product.category_tags)))
    const filterOptions = [
      { id: 'all', label: 'All Products', count: products.length },
      { id: 'featured', label: 'Featured', count: products.filter(p => p.is_featured).length },
      ...categories.map(category => ({
        id: category,
        label: category,
        count: products.filter(p => p.category_tags.includes(category)).length
      }))
    ].filter(option => option.count > 0)

    if (!filterOptions.find(option => option.id === selectedCategory)) {
      setSelectedCategory('all')
    }
  }
}, [products, selectedCategory])

const fetchProfile = async () => {
  if (!username) {
    setError('No username provided')
    setLoading(false)
    return
  }

  try {
    console.log('Fetching profile for username:', username)
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username.toLowerCase())
      .maybeSingle()

    console.log('Profile fetch result:', { data, error })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    if (!data) {
      setError('Profile not found')
      setLoading(false)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      return
    }

    console.log('Profile loaded successfully:', data)
    setProfile(data)
  } catch (err: any) {
    console.error('Profile fetch error:', err)
    setError(err.message || 'Failed to load profile')
  } finally {
    setLoading(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current) // ✅ prevent timeout after success
  }
}


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
            <p className="text-gray-600 mb-4">
              {error === 'Profile not found'
                ? `The profile "${username}" doesn't exist. Please check the URL and try again.`
                : error || 'The profile you\'re looking for doesn\'t exist.'
              }
            </p>
            <div className="space-y-4">
              <Link
                to="/"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              <div className="text-sm text-gray-500 max-w-md mx-auto">
                <p>Looking for a different profile? Try:</p>
                <p className="font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                  alleylink.com/u/username
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Get all unique categories from products
  const categories = Array.from(new Set(products.flatMap(product => product.category_tags)))

  // Debug logging
  console.log('ProfilePage - Products:', products.length)
  console.log('ProfilePage - Categories found:', categories)
  console.log('ProfilePage - Selected category:', selectedCategory)

  // Create filter options combining categories and special filters
  const filterOptions = [
    { id: 'all', label: 'All categories', count: products.length, icon: Filter },
    ...(products.filter(p => p.is_featured).length > 0 ? [{ id: 'featured', label: 'Featured', count: products.filter(p => p.is_featured).length, icon: Star }] : []),
    ...categories.map(category => ({
      id: category,
      label: category,
      count: products.filter(p => p.category_tags.includes(category)).length,
      icon: Tag
    }))
  ] // Always show "All categories" option

  // Get current filter label
  const currentFilter = filterOptions.find(option => option.id === selectedCategory) || filterOptions[0]

  // Filter products based on selected category
  let filteredProducts = products

  if (selectedCategory === 'featured') {
    filteredProducts = products.filter(product => product.is_featured)
  } else if (selectedCategory !== 'all') {
    filteredProducts = products.filter(product => product.category_tags.includes(selectedCategory))
  }

  // Apply additional sorting based on selectedFilter if it's still being used
  if (selectedFilter === 'popular') {
    filteredProducts = filteredProducts
      .sort((a, b) => b.click_count - a.click_count)
      .slice(0, Math.ceil(filteredProducts.length * 0.5)) // Top 50%
  } else if (selectedFilter === 'recent') {
    filteredProducts = filteredProducts
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 8) // Most recent 8 products
  }

  const primaryColor = profile.primary_color || '#3B82F6'

  // Utility function to calculate luminance for text color
  const getLuminance = (hex: string) => {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b))
  }

  const isDarkBackground = getLuminance(primaryColor) < 128
  const textColor = isDarkBackground ? '#FFFFFF' : '#000000'

  // Get card styling from database (with defaults)
  const cardColor = profile.card_color || '#FFFFFF'
  const cardTextColor = profile.card_text_color || '#000000'

  // Get glass card styling from database
  const glassMode = profile.glass_mode || 'matte'
  const glassTintColor = profile.glass_tint || '#FFFFFF'
  const captionFont = 'inter' // Default caption font
  // Caption color now uses card_text_color for consistency with preview
  const captionColor = cardTextColor

  // Convert hex to RGB string for CSS variables
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    return `${r}, ${g}, ${b}`
  }

  // Adaptive text scaling based on text length
  const calculateTitleScale = (textLength: number) => {
    if (textLength < 10) return 1
    if (textLength < 20) return 0.8
    if (textLength < 30) return 0.6
    if (textLength < 50) return 0.45
    return 0.35
  }

  const calculateCaptionScale = (textLength: number) => {
    if (textLength < 50) return 1
    if (textLength < 100) return 0.9
    if (textLength < 200) return 0.8
    return 0.75
  }

  const titleScale = calculateTitleScale(profile.display_name?.length || 0)
  const captionScale = calculateCaptionScale(profile.bio?.length || 0)

  // Get caption font family
  const getCaptionFontFamily = () => {
    const fontMap: Record<string, string> = {
      'inter': 'Inter, sans-serif',
      'lato': 'Lato, sans-serif',
      'montserrat': 'Montserrat, sans-serif',
      'cormorant': 'Cormorant Garamond, serif',
      'spacemono': 'Space Mono, monospace'
    }
    return fontMap[captionFont] || 'Inter, sans-serif'
  }

  const glassColorRgb = hexToRgb(glassTintColor)
  
  // Debug logging for card styling
  console.log('ProfilePage - Card styling:', {
    database_card_color: profile.card_color,
    database_card_text_color: profile.card_text_color,
    final_cardColor: cardColor,
    final_cardTextColor: cardTextColor
  })

  // Convert hex to rgba for glass effect
  const hexToRgba = (hex: string, alpha: number) => {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16)
    const g = parseInt(cleanHex.substring(2, 4), 16)
    const b = parseInt(cleanHex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  // Background styles based on profile settings
  const backgroundImage = profile.background_image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop'
  const backgroundType = profile.background_type || 'image'
  const backgroundGradientDirection = profile.background_gradient_direction || 'white'

  // Get gradient type directly from database
  const gradientType = profile.background_gradient_type || 'linear'

  // Generate gradient based on type and direction
  const getGradientStyle = () => {
    const targetColor = backgroundGradientDirection === 'white' ? '#FFFFFF' : '#000000'

    switch (gradientType) {
      case 'radial':
        return {
          background: `radial-gradient(circle at center, ${primaryColor} 0%, ${targetColor} 100%)`,
          backgroundAttachment: 'fixed'
        }
      case 'diamond':
        return {
          background: `conic-gradient(from 45deg at 50% 50%, ${primaryColor} 0deg, ${targetColor} 90deg, ${primaryColor} 180deg, ${targetColor} 270deg, ${primaryColor} 360deg)`,
          backgroundAttachment: 'fixed'
        }
      case 'vignette':
        return {
          background: `radial-gradient(ellipse at center, ${primaryColor} 0%, ${primaryColor} 40%, ${targetColor} 100%)`,
          backgroundAttachment: 'fixed'
        }
      case 'linear':
      default:
        return {
          background: `linear-gradient(to right, ${primaryColor}, ${targetColor})`,
          backgroundAttachment: 'fixed'
        }
    }
  }

  const getBackgroundStyle = () => {
    if (backgroundType === 'image') {
      return {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed' // Make background static
      }
    } else if (backgroundType === 'gradient') {
      return getGradientStyle()
    } else {
      return {
        backgroundColor: primaryColor
      }
    }
  }

  return (
    <>
      <style>{`
        .glass-panel {
          background: ${hexToRgba(cardColor, 0.2)};
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid ${hexToRgba(cardColor, 0.3)};
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }

        /* Glass Title Card - Matte Mode (Default) */
        .glass-title-card {
          position: relative;
          border-radius: 24px;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          transition: all 0.3s ease;
          background: rgba(${glassColorRgb}, 0.15);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(${glassColorRgb}, 0.3);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
        }

        /* Glass Title Card - Gloss Mode */
        .glass-title-card.gloss-mode {
          background: linear-gradient(
            135deg,
            rgba(${glassColorRgb}, 0.4) 0%,
            rgba(${glassColorRgb}, 0.05) 50%,
            rgba(${glassColorRgb}, 0) 100%
          );
          box-shadow:
            8px 8px 20px 0 rgba(0, 0, 0, 0.3),
            inset 1px 1px 0 rgba(255, 255, 255, 0.6),
            inset -1px -1px 0 rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        .glass-title-card.gloss-mode::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 24px;
          background: linear-gradient(
            125deg,
            rgba(255,255,255,0.4) 0%,
            transparent 40%,
            transparent 100%
          );
          pointer-events: none;
          z-index: 0;
        }

        .glass-title-card .card-content {
          position: relative;
          z-index: 2;
          width: 100%;
        }

        .glass-title-card .card-title {
          font-size: calc(6rem * ${titleScale});
          line-height: 1;
          margin-bottom: 16px;
          transition: font-size 0.3s ease;
          text-shadow: 0 2px 10px rgba(0,0,0,0.1);
          word-wrap: break-word;
        }

        .glass-title-card .card-caption {
          font-family: ${getCaptionFontFamily()};
          font-size: calc(1.2rem * ${captionScale});
          color: ${captionColor};
          opacity: 0.8;
          letter-spacing: 0.02em;
          max-width: 80%;
          margin: 0 auto;
          line-height: 1.5;
          transition: font-size 0.3s ease;
        }

        @media (max-width: 768px) {
          .glass-title-card {
            padding: 40px 24px;
            border-radius: 16px;
          }
          .glass-title-card .card-title {
            font-size: calc(3.5rem * ${titleScale});
          }
          .glass-title-card .card-caption {
            font-size: calc(1rem * ${captionScale});
            max-width: 95%;
          }
        }

        .product-text {
          color: ${cardTextColor};
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
        .product-card:nth-child(7) { animation-delay: 0.7s; }
        .product-card:nth-child(8) { animation-delay: 0.8s; }
      `}</style>

      <div
        className="min-h-screen w-full transition-all duration-500 ease-in-out"
        style={getBackgroundStyle()}
      >
        <div className="bg-black bg-opacity-10 min-h-screen">
          <Navbar transparent />

          {/* Glass Title Card Header */}
          <header className="p-4 md:p-8 text-white text-center">
            <div className={`max-w-4xl mx-auto glass-title-card ${glassMode === 'gloss' ? 'gloss-mode' : ''}`}>
              <div className="card-content">
                <h1
                  className="card-title font-bold"
                  style={getDisplayNameStyle(profile)}
                >
                  {profile.display_name}
                </h1>
                {profile.bio && (
                  <p className="card-caption">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          </header>

          <main className="max-w-6xl mx-auto px-4 py-6 sm:px-6">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="glass-panel rounded-2xl p-12">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
                    <Tag className="w-12 h-12 product-text" />
                  </div>
                  <h3 className="text-2xl font-bold product-text mb-4">No Products Yet</h3>
                  <p className="product-text opacity-80 text-lg max-w-md mx-auto">
                    {profile.display_name} hasn't added any products to their storefront yet.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Category Dropdown */}
                {products.length > 0 && (
                  <div className="mb-8">
                    <div className="relative" ref={dropdownRef}>
                      {/* Dropdown Button */}
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setIsDropdownOpen(false)
                          }
                        }}
                        className="w-full p-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between hover:shadow-xl transition-all border"
                        style={{
                          backgroundColor: cardColor,
                          color: cardTextColor,
                          borderColor: cardColor === '#FFFFFF' ? '#E5E7EB' : cardColor
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <currentFilter.icon className="w-5 h-5" style={{ color: cardTextColor }} />
                          <span className="font-medium">{currentFilter.label}</span>
                          <span className="text-sm opacity-70">({currentFilter.count})</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`} style={{ color: cardTextColor }} />
                      </button>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
                          <div className="p-4">
                            {/* 3-column grid layout */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {filterOptions.map((option) => {
                                const IconComponent = option.icon
                                return (
                                  <button
                                    key={option.id}
                                    onClick={() => {
                                      setSelectedCategory(option.id)
                                      setIsDropdownOpen(false)
                                    }}
                                    className={`p-3 rounded-lg text-left transition-all duration-200 flex items-center space-x-3 ${
                                      selectedCategory === option.id
                                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                        : 'hover:bg-gray-100 text-gray-700 border border-transparent'
                                    }`}
                                  >
                                    <IconComponent className="w-4 h-4 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm truncate">{option.label}</div>
                                      <div className="text-xs text-gray-500">{option.count} items</div>
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}


                {/* Product Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="glass-panel rounded-2xl p-12">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
                        <Tag className="w-12 h-12 product-text" />
                      </div>
                      <h3 className="text-2xl font-bold product-text mb-4">No Products Found</h3>
                      <p className="product-text opacity-80 text-lg max-w-md mx-auto">
                        No products match the selected filter. Try selecting a different category.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="product-card rounded-lg overflow-hidden glass-panel cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => {
                        console.log('Product card clicked:', product.id, product.title)
                        trackClick(product.id, product.affiliate_url)
                      }}
                    >
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.title}
                          className="w-full h-40 sm:h-56 object-contain bg-gray-100"
                        />
                      ) : (
                        <div className="w-full h-40 sm:h-56 bg-white/20 flex items-center justify-center">
                          <Tag className="w-12 h-12 product-text" />
                        </div>
                      )}
                      <div className="p-3 sm:p-4">
                        <h3 className="product-text font-semibold text-sm sm:text-lg mb-1">
                          {product.title}
                        </h3>
                        {product.description && (
                          <p className="product-text opacity-80 text-sm mb-2 line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <button
                          className="w-full py-2 rounded-lg font-medium transition-all duration-200 hover:opacity-90"
                          style={{ backgroundColor: primaryColor, color: 'white' }}
                          onClick={(e) => {
                            e.stopPropagation()
                            console.log('Product button clicked:', product.id, product.title)
                            trackClick(product.id, product.affiliate_url)
                          }}
                        >
                          Open Product
                        </button>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>


    </>
  )
}