import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProducts } from '../hooks/useProducts'
import { useAnalytics } from '../hooks/useAnalytics'
import { useSubscription } from '../hooks/useSubscription'
import { useImageUpload } from '../hooks/useImageUpload'
import Navbar from '../components/Navbar'
import ProductGrid from '../components/ProductGrid'
import ProductForm from '../components/ProductForm'
import ProfileSettings from '../components/ProfileSettings'
import ProfileCustomization from '../components/ProfileCustomization'
import SubscriptionManager from '../components/SubscriptionManager'
import {
  Plus,
  Package,
  Palette,
  TrendingUp,
  Link as LinkIcon,
  AlertCircle,
  ExternalLink,
  Filter,
  Star,
  Tag,
  ChevronDown,
  User,
  CreditCard
} from 'lucide-react'
import { PLAN_LIMITS, type Product } from '../lib/supabase'

// Mobile detection hook (matches deployed version)
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < breakpoint)
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < breakpoint)
    return () => mql.removeEventListener('change', onChange)
  }, [breakpoint])

  return !!isMobile
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'products' | 'analytics' | 'customization' | 'profile' | 'subscription'>('products')
  const [showProductForm, setShowProductForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false)
  const [customizationUnsaved, setCustomizationUnsaved] = useState(false)
  const isMobile = useIsMobile()
  const { user, profile } = useAuth()

  const { products, loading, addProduct, updateProduct, deleteProduct, trackClick } = useProducts()
  const { analytics, loading: analyticsLoading } = useAnalytics()
  const { createSubscription, isSubscribed, isPro, loading: subscriptionLoading } = useSubscription()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const tabDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (tabDropdownRef.current && !tabDropdownRef.current.contains(event.target as Node)) {
        setIsTabDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Reset to 'all' if current selection is no longer valid
  useEffect(() => {
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show dashboard even if profile is still loading
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  const canAddProducts = products.length < (PLAN_LIMITS[profile.plan_type as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free).products
  const profileUrl = `${window.location.origin}/u/${profile.username}`

  const handleUpgrade = async (planType: 'basic' | 'pro' = 'pro') => {
    const checkoutUrl = await createSubscription(planType)
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }

  const copyProfileUrl = () => {
    navigator.clipboard.writeText(profileUrl)
  }

  // Safely switch tabs — warn if leaving customization with unsaved changes
  const safeSetActiveTab = (tabId: typeof activeTab) => {
    if (activeTab === 'customization' && customizationUnsaved && tabId !== 'customization') {
      if (!window.confirm('You have unsaved customization changes. Leave without saving?')) {
        return
      }
    }
    setActiveTab(tabId)
  }

  const tabs = [
    { id: 'products' as const, name: 'Products', icon: Package },
    { id: 'analytics' as const, name: 'Analytics', icon: TrendingUp },
    { id: 'customization' as const, name: 'Customization', icon: Palette },
    { id: 'profile' as const, name: 'Profile', icon: User },
    { id: 'subscription' as const, name: 'Subscription', icon: CreditCard }
  ]

  // Get all unique categories from products
  const categories = Array.from(new Set(products.flatMap(product => product.category_tags)))

  // Create filter options combining categories and special filters
  const filterOptions = [
    { id: 'all', label: 'All Products', count: products.length, icon: Filter },
    { id: 'featured', label: 'Featured', count: products.filter(p => p.is_featured).length, icon: Star },
    ...categories.map(category => ({
      id: category,
      label: category,
      count: products.filter(p => p.category_tags.includes(category)).length,
      icon: Tag
    }))
  ].filter(option => option.count > 0) // Only show options with products

  // Get current filter label
  const currentFilter = filterOptions.find(option => option.id === selectedCategory) || filterOptions[0]

  // Filter products based on selected category
  let filteredProducts = products

  if (selectedCategory === 'featured') {
    filteredProducts = products.filter(product => product.is_featured)
  } else if (selectedCategory !== 'all') {
    filteredProducts = products.filter(product => product.category_tags.includes(selectedCategory))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 lg:pt-3">

        {/* Plan limit warning (only when at limit) */}
        {!canAddProducts && profile.plan_type === 'free' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0" />
              <p className="text-xs text-yellow-700">
                Free plan limit reached.{' '}
                <button onClick={() => handleUpgrade('basic')} className="font-medium underline">Upgrade to Basic</button>
                {' or '}
                <button onClick={() => handleUpgrade('pro')} className="font-medium underline">Pro</button>
              </p>
            </div>
          </div>
        )}

        {/* Row 2: Tabs (left) + Clipboard (right) — single row */}
        <div className="border-b border-gray-200 mb-3 flex items-end justify-between gap-4">
          {/* Left: Tabs */}
          {isMobile ? (
            <div className="relative py-2 flex-1" ref={tabDropdownRef}>
              <button
                onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  {(() => {
                    const currentTab = tabs.find(t => t.id === activeTab)
                    const CurrentIcon = currentTab?.icon || Package
                    return (
                      <>
                        <CurrentIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">{currentTab?.name || 'Products'}</span>
                      </>
                    )
                  })()}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isTabDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isTabDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          safeSetActiveTab(tab.id)
                          setIsTabDropdownOpen(false)
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2.5 text-left transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
                            : 'text-gray-700 hover:bg-gray-50 border-l-4 border-transparent'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className="text-sm font-medium">{tab.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Desktop: Horizontal tab bar */
            <nav className="flex space-x-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => safeSetActiveTab(tab.id)}
                    className={`flex items-center space-x-1.5 py-2.5 px-1 border-b-2 font-medium text-sm transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          )}

          {/* Right: Clipboard link (inline with tabs) */}
          <div className="hidden sm:flex items-center bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 mb-1.5 flex-shrink-0">
            <LinkIcon className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
            <span className="text-xs text-gray-500 mr-1.5">alleylink.com/u/{profile.username}</span>
            <button
              onClick={copyProfileUrl}
              className="text-blue-600 hover:text-blue-700 text-xs font-medium"
            >
              Copy
            </button>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1.5 text-gray-400 hover:text-gray-600"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <div>
            {/* Single-row header: Title | Filter | Add Button */}
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-fluid-lg font-semibold text-gray-900 whitespace-nowrap">Your Products</h2>

              <div className="flex items-center gap-3 flex-1 justify-end">
                {/* Compact Category Filter */}
                {filterOptions.length > 1 && (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setIsDropdownOpen(false)
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center space-x-2 hover:bg-gray-50 transition-all text-sm"
                    >
                      <currentFilter.icon className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{currentFilter.label}</span>
                      <span className="text-xs text-gray-400">({currentFilter.count})</span>
                      <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full right-0 mt-1.5 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto min-w-[280px]">
                        <div className="p-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {filterOptions.map((option) => {
                              const IconComponent = option.icon
                              return (
                                <button
                                  key={option.id}
                                  onClick={() => {
                                    setSelectedCategory(option.id)
                                    setIsDropdownOpen(false)
                                  }}
                                  className={`p-2.5 rounded-lg text-left transition-all duration-200 flex items-center space-x-2.5 ${
                                    selectedCategory === option.id
                                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                      : 'hover:bg-gray-100 text-gray-700 border border-transparent'
                                  }`}
                                >
                                  <IconComponent className="w-3.5 h-3.5 flex-shrink-0" />
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
                )}

                <button
                  onClick={() => setShowProductForm(true)}
                  disabled={!canAddProducts}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            <ProductGrid
              products={filteredProducts}
              loading={loading}
              onEdit={(product) => {
                setEditingProduct(product)
                setShowProductForm(true)
              }}
              onDelete={deleteProduct}
              trackClick={trackClick}
              editable
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-fluid-lg font-semibold text-gray-900">Analytics Dashboard</h2>
              {(PLAN_LIMITS[profile.plan_type as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free).analytics && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Real-time tracking active</span>
                </div>
              )}
            </div>

            {!(PLAN_LIMITS[profile.plan_type as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free).analytics ? (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-center">
                <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-fluid-lg font-semibold text-gray-900 mb-1">
                  Unlock Powerful Analytics
                </h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  Get detailed insights about your product performance, click tracking, conversion rates, and visitor analytics to grow your affiliate business.
                </p>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Click tracking & analytics</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Profile view insights</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Product performance data</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Conversion optimization</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {profile.plan_type === 'free' && (
                      <button
                        onClick={() => handleUpgrade('basic')}
                        className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all font-medium"
                      >
                        Upgrade to Basic - $2.99/mo
                      </button>
                    )}
                    <button
                      onClick={() => handleUpgrade('pro')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                    >
                      Upgrade to Pro - $4.99/mo
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Clicks</h3>
                        <p className="text-xl font-bold text-blue-600">
                          {analyticsLoading ? (
                            <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                          ) : (
                            analytics.totalClicks.toLocaleString()
                          )}
                        </p>
                      </div>
                      <div className="p-2.5 bg-blue-100 rounded-full">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Successful link redirects</p>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Active Products</h3>
                        <p className="text-xl font-bold text-green-600">{products.length}</p>
                      </div>
                      <div className="p-2.5 bg-green-100 rounded-full">
                        <Package className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Currently published</p>
                  </div>
                </div>

                {/* Product Performance */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-fluid-lg font-semibold text-gray-900">Product Performance</h3>
                    {analyticsLoading && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Loading...</span>
                      </div>
                    )}
                  </div>

                  {analyticsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded w-12"></div>
                        </div>
                      ))}
                    </div>
                  ) : analytics.productClicks.length > 0 ? (
                    <div className="space-y-3">
                      {analytics.productClicks.slice(0, 10).map((product, index) => (
                        <div key={product.product_id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{product.product_title}</p>
                              <p className="text-sm text-gray-500">Product ID: {product.product_id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">{product.click_count}</p>
                            <p className="text-xs text-gray-500">clicks</p>
                          </div>
                        </div>
                      ))}
                      {analytics.productClicks.length > 10 && (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">
                            Showing top 10 products • {analytics.productClicks.length - 10} more products have clicks
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-fluid-lg font-medium text-gray-900 mb-2">No clicks yet</h4>
                      <p className="text-gray-500 mb-4">
                        Share your profile link to start getting clicks on your products!
                      </p>
                      <button
                        onClick={copyProfileUrl}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Copy Profile Link
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2.5">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                    <button
                      onClick={copyProfileUrl}
                      className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200"
                    >
                      <LinkIcon className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Share Profile</p>
                        <p className="text-sm text-gray-500">Copy your profile link</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => safeSetActiveTab('products')}
                      className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200"
                    >
                      <Plus className="w-5 h-5 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Add Products</p>
                        <p className="text-sm text-gray-500">Grow your catalog</p>
                      </div>
                    </button>

                    <button
                      onClick={() => safeSetActiveTab('customization')}
                      className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200"
                    >
                      <Palette className="w-5 h-5 text-purple-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Customize</p>
                        <p className="text-sm text-gray-500">Update your profile</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'customization' && (
          <ProfileCustomization onUnsavedChange={setCustomizationUnsaved} />
        )}

        {activeTab === 'profile' && (
          <div>
            <h2 className="text-fluid-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
            <ProfileSettings />
          </div>
        )}

        {activeTab === 'subscription' && (
          <SubscriptionManager />
        )}
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          initialData={editingProduct ? {
            title: editingProduct.title,
            description: editingProduct.description || '',
            affiliate_url: editingProduct.affiliate_url,
            image_url: editingProduct.image_url || '',
            bg_color: editingProduct.bg_color || '',
            category_tags: editingProduct.category_tags || [],
            is_featured: editingProduct.is_featured || false,
            is_active: editingProduct.is_active ?? true
          } : undefined}
          onClose={() => {
            setShowProductForm(false)
            setEditingProduct(null)
          }}
          onSubmit={async (productData) => {
            let success = false
            if (editingProduct) {
              // Update existing product
              success = await updateProduct(editingProduct.id, productData)
            } else {
              // Add new product
              success = await addProduct(productData)
            }
            if (success) {
              setShowProductForm(false)
              setEditingProduct(null)
            }
          }}
        />
      )}
    </div>
  )
}