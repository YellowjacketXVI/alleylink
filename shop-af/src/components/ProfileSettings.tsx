import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useImageUpload } from '../hooks/useImageUpload'
import { User, Upload, X, CheckCircle, XCircle, Edit3 } from 'lucide-react'
import { validateUsername } from '../lib/utils'
import { supabase } from '../lib/supabase'

export default function ProfileSettings() {
  const { profile, updateProfile } = useAuth()
  const { uploadImage, uploading, error: uploadError } = useImageUpload()

  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    username: profile?.username || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingUsername, setEditingUsername] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
  const [usernameError, setUsernameError] = useState('')
  const [checkTimeout, setCheckTimeout] = useState<NodeJS.Timeout | null>(null)

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        username: profile.username || ''
      })
    }
  }, [profile])

  // Check username availability with debouncing
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3 || username === profile?.username) {
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
    if (!editingUsername) return

    if (checkTimeout) {
      clearTimeout(checkTimeout)
    }

    if (formData.username && formData.username !== profile?.username) {
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
  }, [formData.username, editingUsername, profile?.username])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (checkTimeout) {
        clearTimeout(checkTimeout)
      }
    }
  }, [])

  const handleAvatarUpload = async (file: File) => {
    const url = await uploadImage(file, 'avatars')
    if (url && profile) {
      const updated = await updateProfile({ avatar_url: url })
      if (updated) {
        setSuccess('Avatar updated successfully!')
        setTimeout(() => setSuccess(''), 3000)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation
    if (!formData.display_name.trim()) {
      setError('Display name is required')
      setLoading(false)
      return
    }

    // If username is being changed, validate it
    if (editingUsername && formData.username !== profile?.username) {
      const validation = validateUsername(formData.username)
      if (!validation.isValid) {
        setError(validation.error || 'Invalid username')
        setLoading(false)
        return
      }

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
    }

    try {
      const updates: any = {
        display_name: formData.display_name.trim(),
        bio: formData.bio.trim()
      }

      // Include username if it's being changed
      if (editingUsername && formData.username !== profile?.username) {
        updates.username = formData.username.toLowerCase()
      }

      const updated = await updateProfile(updates)

      if (updated) {
        setSuccess('Profile updated successfully!')
        setEditingUsername(false)
        setUsernameStatus('idle')
        setUsernameError('')
        setTimeout(() => setSuccess(''), 3000)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }



  if (!profile) return null

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-4">
        {/* Avatar Section */}
        <div className="mb-4">
          <h3 className="text-fluid-lg font-semibold text-gray-900 mb-3">Profile Picture</h3>

          <div className="flex items-center space-x-3">
            <div className="relative">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-gray-300 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}

              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleAvatarUpload(file)
                }}
                className="hidden"
                id="avatar-upload"
                disabled={uploading}
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Change Avatar'}</span>
              </label>

              {profile.avatar_url && (
                <button
                  onClick={async () => {
                    const updated = await updateProfile({ avatar_url: null })
                    if (updated) {
                      setSuccess('Avatar removed successfully!')
                      setTimeout(() => setSuccess(''), 3000)
                    }
                  }}
                  className="ml-2 text-red-600 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}

              {uploadError && (
                <p className="text-red-600 text-sm mt-1">{uploadError}</p>
              )}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display Name */}
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-gray-700 mb-2">
              Display Name *
            </label>
            <input
              id="display_name"
              type="text"
              value={formData.display_name}
              onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Your display name"
              required
            />
          </div>

          {/* Your Link (editable) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Link
            </label>
            {!editingUsername ? (
              <div className="flex items-center space-x-2">
                <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600">
                  @{profile.username}
                </div>
                <button
                  type="button"
                  onClick={() => setEditingUsername(true)}
                  className="px-3 py-2 text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase() }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:border-transparent transition-all pr-20 ${
                      usernameStatus === 'available' ? 'border-green-300 focus:ring-green-500' :
                      usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'border-red-300 focus:ring-red-500' :
                      'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Enter new username"
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
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUsername(false)
                      setFormData(prev => ({ ...prev, username: profile.username }))
                      setUsernameStatus('idle')
                      setUsernameError('')
                    }}
                    className="px-3 py-1 text-gray-600 hover:text-gray-700 border border-gray-300 hover:border-gray-400 rounded text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                {usernameError && (
                  <p className="text-xs text-red-600">{usernameError}</p>
                )}
                {usernameStatus === 'available' && (
                  <p className="text-xs text-green-600">✓ Username is available!</p>
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Your profile URL: alleylink.com/u/{editingUsername ? formData.username || 'username' : profile.username}
            </p>
            {editingUsername && (
              <div className="mt-2 text-xs text-gray-500">
                <p><strong>Username rules:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>3-30 characters long</li>
                  <li>Letters, numbers, hyphens, and underscores only</li>
                  <li>Cannot start or end with hyphens or underscores</li>
                  <li>No consecutive special characters</li>
                </ul>
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Tell people about yourself and what you recommend..."
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.bio.length}/500 characters
            </p>
          </div>



          {/* Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}