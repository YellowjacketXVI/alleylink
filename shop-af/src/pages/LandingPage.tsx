import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Users, TrendingUp, Star, Check, Zap, Link as LinkIcon, Plus, Share2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'

export default function LandingPage() {
  const { user } = useAuth()
  const { createSubscription, isPro, loading: subscriptionLoading } = useSubscription()
  const [footerImageError, setFooterImageError] = useState(false)

  const handleUpgrade = async () => {
    if (!user) {
      // Redirect to signup if not logged in
      window.location.href = '/signup'
      return
    }

    const checkoutUrl = await createSubscription('pro')
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>

        <Navbar transparent />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
              <span className="text-white font-medium">✨ Affiliate Marketing Made Simple</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Get Your Link.
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Add Products.
              </span>
              <br />
              Start Earning.
            </h1>

            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Create your personalized storefront in minutes. No coding, no complexity - 
              just a simple way to share products and earn affiliate commissions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center space-x-2"
              >
                <span>{user ? "Go to Dashboard" : "Get Your Free Link"}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="text-blue-100 text-sm">
                Free forever • No credit card required
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-blue-100">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>1,000+ creators earning</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Growing fast</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-1">Loved by users</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start earning in 3 simple steps. No technical skills required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <LinkIcon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Your Link</h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up for free and get your personalized AlleyLink URL instantly. 
                No setup fees, no waiting.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Plus className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Add Products</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload product images, add descriptions, and paste your affiliate links. 
                Our simple interface makes it effortless.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Share2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Share & Earn</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your beautiful storefront on social media, with friends, or anywhere online. 
                Start earning commissions immediately.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Succeed
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Beautiful Storefronts
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create stunning, mobile-optimized profile pages with custom fonts, colors, 
                and backgrounds that reflect your brand.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Drag & Drop Simple
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Add products in seconds with our intuitive interface. Upload images, 
                organize with categories, and manage everything effortlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Track Your Success
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor clicks, track performance, and see which products are earning you 
                the most with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you're ready to scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Trial */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Trial</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">$0<span className="text-lg text-gray-600">/month</span></div>
                <p className="text-gray-600">Try AlleyLink with limited features</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Up to 3 products</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Personal storefront</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Basic customization</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Community support</span>
                </li>
              </ul>

              <Link
                to="/signup"
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-800 transition-all text-center block"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 shadow-xl border-2 border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Pro Plan</h3>
                <div className="text-4xl font-bold text-white mb-4">$4.99<span className="text-lg text-blue-200">/month</span></div>
                <p className="text-blue-100">For serious affiliate marketers</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">Unlimited products</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">Advanced analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">Custom branding</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-green-400" />
                  <span className="text-white">Priority support</span>
                </li>
              </ul>

              <button
                onClick={handleUpgrade}
                disabled={subscriptionLoading}
                className="w-full bg-white text-blue-600 py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {subscriptionLoading ? 'Loading...' : (isPro ? 'Current Plan' : 'Upgrade to Pro')}
              </button>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/pricing"
              className="text-blue-600 hover:text-blue-700 font-medium text-lg flex items-center justify-center space-x-2"
            >
              <span>View detailed pricing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Affiliate Empire?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators who are already earning with AlleyLink.
          </p>

          <Link
            to={user ? "/dashboard" : "/signup"}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl inline-flex items-center space-x-2"
          >
            <span>{user ? "Go to Dashboard" : "Get Started Now"}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                {!footerImageError ? (
                  <img
                    src="/sitetitle.png"
                    alt="AlleyLink"
                    className="h-8 w-auto filter brightness-0 invert"
                    onError={() => setFooterImageError(true)}
                  />
                ) : (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      AlleyLink
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                The ultimate platform for affiliate marketers to create stunning
                storefronts and grow their business.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Shop AF. All rights reserved. Built for creators by creators.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}