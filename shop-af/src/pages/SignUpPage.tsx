import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, ShoppingBag, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import { validateUsername } from '../lib/utils'
import { supabase } from '../lib/supabase'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    displayName: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
  const [usernameError, setUsernameError] = useState('')
  const [checkTimeout, setCheckTimeout] = useState<NodeJS.Timeout | null>(null)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  // Check username availability with debouncing
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameStatus('idle')
      return
    }

    // Validate username format first
    const validation = validateUsername(username)
    if (!validation.isValid) {
      setUsernameStatus('invalid')
      setUsernameError(validation.error || 'Invalid username')
      return
    }

    setUsernameStatus('checking')
    setUsernameError('')

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
        .maybeSingle()

      if (error) {
        console.error('Error checking username:', error)
        setUsernameStatus('idle')
        return
      }

      if (data) {
        setUsernameStatus('taken')
        setUsernameError('This username is already taken')
      } else {
        setUsernameStatus('available')
        setUsernameError('')
      }
    } catch (err) {
      console.error('Username check failed:', err)
      setUsernameStatus('idle')
    }
  }

  // Debounced username checking
  useEffect(() => {
    if (checkTimeout) {
      clearTimeout(checkTimeout)
    }

    if (formData.username) {
      const timeout = setTimeout(() => {
        checkUsernameAvailability(formData.username)
      }, 500) // 500ms delay

      setCheckTimeout(timeout)
    } else {
      setUsernameStatus('idle')
      setUsernameError('')
    }

    return () => {
      if (checkTimeout) {
        clearTimeout(checkTimeout)
      }
    }
  }, [formData.username])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (checkTimeout) {
        clearTimeout(checkTimeout)
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (!formData.email || !formData.password || !formData.username || !formData.displayName) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    // Check username validation
    const validation = validateUsername(formData.username)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid username')
      setLoading(false)
      return
    }

    // Check if username is available
    if (usernameStatus !== 'available') {
      if (usernameStatus === 'taken') {
        setError('This username is already taken. Please choose a different one.')
      } else if (usernameStatus === 'invalid') {
        setError(usernameError || 'Invalid username')
      } else {
        setError('Please wait for username availability check to complete')
      }
      setLoading(false)
      return
    }

    try {
      await signUp(formData.email, formData.password, formData.username, formData.displayName)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="py-8 px-3 sm:px-4 lg:px-6">
        <div className="max-w-md mx-auto">
          {/* Back button */}
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-fluid-xl font-bold text-gray-900 mb-2">
              Get Your Free Link
            </h1>
            <p className="text-gray-600">
              Step 1: Get your link • Step 2: Add products • Step 3: Start earning
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Claim Your Link
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase() }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all pr-20 ${
                      usernameStatus === 'available' ? 'border-green-300 focus:ring-green-500' :
                      usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'border-red-300 focus:ring-red-500' :
                      'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="yourshop"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {usernameStatus === 'checking' && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    )}
                    {usernameStatus === 'available' && (
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    )}
                    {(usernameStatus === 'taken' || usernameStatus === 'invalid') && (
                      <XCircle className="w-4 h-4 text-red-600 mr-2" />
                    )}
                  </div>
                </div>
                <div className="mt-1">
                  <p className="text-xs text-gray-500">
                    Your unique profile URL: alleylink.com/u/{formData.username || 'yourshop'}
                  </p>
                  {usernameError && (
                    <p className="text-xs text-red-600 mt-1">{usernameError}</p>
                  )}
                  {usernameStatus === 'available' && (
                    <p className="text-xs text-green-600 mt-1">✓ Username is available!</p>
                  )}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <p><strong>Username rules:</strong></p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>3-30 characters long</li>
                    <li>Letters, numbers, hyphens, and underscores only</li>
                    <li>Cannot start or end with hyphens or underscores</li>
                    <li>No consecutive special characters</li>
                  </ul>
                </div>

              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}