import React, { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, type Profile, type Product } from '../lib/supabase'
import { useProducts } from '../hooks/useProducts'
import { ExternalLink, ArrowLeft, User, MapPin, Calendar, Tag, ChevronDown, Filter, Star } from 'lucide-react'
import Navbar from '../components/Navbar'

// Helper function to get display name style
const getDisplayNameStyle = (profile: Profile) => {
  const fontOptions = [
    { id: 'merriweather', family: 'Merriweather, serif' },
    { id: 'poppins', family: 'Poppins, sans-serif' },
    { id: 'orbitron', family: 'Orbitron, sans-serif' },
    { id: 'montserrat', family: 'Montserrat, sans-serif' },
    { id: 'inter', family: 'Inter, sans-serif' },
    { id: 'papyrus', family: 'Papyrus, fantasy' },
    { id: 'sansserif', family: 'sans-serif' }
  ]

  const font = fontOptions.find(f => f.id === profile.display_name_font) || fontOptions[4]
  return {
    fontFamily: font.family,
    color: profile.display_name_color || '#FFFFFF',
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

  // Track profile view
  useEffect(() => {
    const trackProfileView = async () => {
      if (!profile?.user_id) return

      try {
        await supabase.functions.invoke('track-profile-view', {
          body: { profileUserId: profile.user_id }
        })
      } catch (err) {
        console.log('Profile view tracking failed (non-critical):', err)
      }
    }

    trackProfileView()
  }, [profile?.user_id])

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

  // Background styles based on profile settings
  const backgroundImage = profile.background_image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop'
  const backgroundType = profile.background_type || 'image'
  const backgroundGradientDirection = profile.background_gradient_direction || 'white'

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
      const targetColor = backgroundGradientDirection === 'white' ? '#FFFFFF' : '#000000'
      return {
        backgroundImage: `linear-gradient(to right, ${primaryColor}, ${targetColor})`,
        backgroundAttachment: 'fixed' // Make background static
      }
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
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }

        .product-text {
          color: ${textColor};
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

          {/* Simplified Header Section */}
          <header className="p-4 md:p-8 text-white text-center">
            <div className="max-w-4xl mx-auto p-6 md:p-8 glass-panel rounded-xl">
              <div className="flex flex-col items-center space-y-4">
                <div>
                  <h1
                    className="text-3xl md:text-4xl font-bold mb-2"
                    style={getDisplayNameStyle(profile)}
                  >
                    {profile.display_name}
                  </h1>
                  {profile.bio && (
                    <p className="text-base md:text-lg product-text opacity-80 mt-2 max-w-2xl">
                      {profile.bio}
                    </p>
                  )}
                </div>
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
                        className="w-full p-4 rounded-lg bg-white shadow-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between hover:shadow-xl transition-all border border-gray-200"
                      >
                        <div className="flex items-center space-x-3">
                          <currentFilter.icon className="w-5 h-5 text-gray-600" />
                          <span className="font-medium">{currentFilter.label}</span>
                          <span className="text-sm text-gray-500">({currentFilter.count})</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${
                          isDropdownOpen ? 'rotate-180' : ''
                        }`} />
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
                      onClick={() => trackClick(product.id, product.affiliate_url)}
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