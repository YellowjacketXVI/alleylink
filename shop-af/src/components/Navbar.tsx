import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, User, Settings, LogOut, ShoppingBag } from 'lucide-react'

interface NavbarProps {
  transparent?: boolean
}

export default function Navbar({ transparent = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
    navigate('/')
  }

  const navbarClasses = transparent
    ? 'bg-transparent backdrop-blur-sm border-white/20'
    : 'bg-white shadow-lg border-gray-200'

  const textClasses = transparent
    ? 'text-white'
    : 'text-gray-900'

  return (
    <nav className={`sticky top-0 z-50 border-b ${navbarClasses}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            {!imageError ? (
              <img
                src="/sitetitle.png"
                alt="AlleyLink"
                className={`h-8 w-auto ${transparent ? 'brightness-0 invert' : ''}`}
                onError={() => setImageError(true)}
              />
            ) : (
              <>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent`}>
                  AlleyLink
                </span>
              </>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/pricing" className={`${isActive('/pricing') ? 'text-purple-600 font-semibold' : textClasses} hover:text-purple-600 transition-colors`}>
              Pricing
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className={`${isActive('/dashboard') ? 'text-purple-600 font-semibold' : textClasses} hover:text-purple-600 transition-colors`}>
                  Dashboard
                </Link>
                {profile?.is_admin && (
                  <Link to="/admin" className={`${isActive('/admin') ? 'text-purple-600 font-semibold' : textClasses} hover:text-purple-600 transition-colors`}>
                    Admin
                  </Link>
                )}
                <div className="relative group">
                  <button className={`flex items-center space-x-2 ${textClasses} hover:text-purple-600 transition-colors`}>
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.display_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      {/* Pro status indicator */}
                      {profile?.plan_type && profile.plan_type !== 'free' && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <span className="font-medium">{profile?.display_name || 'User'}</span>
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      {profile?.username && (
                        <Link
                          to={`/u/${profile.username}`}
                          className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>View Profile</span>
                        </Link>
                      )}
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`${textClasses} hover:text-purple-600 transition-colors`}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${textClasses} hover:bg-white/10 transition-colors`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/pricing"
                onClick={() => setIsMenuOpen(false)}
                className={`${isActive('/pricing') ? 'text-purple-600 font-semibold' : textClasses} hover:text-purple-600 transition-colors`}
              >
                Pricing
              </Link>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className={`${isActive('/dashboard') ? 'text-purple-600 font-semibold' : textClasses} hover:text-purple-600 transition-colors`}
                  >
                    Dashboard
                  </Link>
                  {profile?.username && (
                    <Link
                      to={`/u/${profile.username}`}
                      onClick={() => setIsMenuOpen(false)}
                      className={`${textClasses} hover:text-purple-600 transition-colors`}
                    >
                      View Profile
                    </Link>
                  )}
                  {profile?.is_admin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className={`${textClasses} hover:text-purple-600 transition-colors`}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className={`${textClasses} hover:text-red-600 transition-colors text-left`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className={`${textClasses} hover:text-purple-600 transition-colors`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-900 transition-all text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}