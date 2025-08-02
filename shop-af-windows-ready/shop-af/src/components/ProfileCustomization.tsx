import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useImageUpload } from '../hooks/useImageUpload'
import { supabase } from '../lib/supabase'
import { Palette, Image, Layers, Save, Upload, X, Type, Sparkles } from 'lucide-react'

export default function ProfileCustomization() {
  const { profile, refreshProfile } = useAuth()
  const { uploadImage, uploading, error: uploadError } = useImageUpload()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [settings, setSettings] = useState({
    background_type: profile?.background_type || 'image',
    background_image: profile?.background_image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
    background_gradient_direction: profile?.background_gradient_direction || 'white',
    primary_color: profile?.primary_color || '#3B82F6',
    display_name_color: profile?.display_name_color || '#FFFFFF',
    display_name_font: profile?.display_name_font || 'inter'
  })

  const backgroundImages = [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=2070&auto=format&fit=crop'
  ]

  const fontOptions = [
    { id: 'merriweather', name: 'Merriweather', family: 'Merriweather, serif' },
    { id: 'poppins', name: 'Poppins', family: 'Poppins, sans-serif' },
    { id: 'orbitron', name: 'Orbitron', family: 'Orbitron, sans-serif' },
    { id: 'montserrat', name: 'Montserrat', family: 'Montserrat, sans-serif' },
    { id: 'inter', name: 'Inter', family: 'Inter, sans-serif' },
    { id: 'papyrus', name: 'Papyrus', family: 'Papyrus, fantasy' },
    { id: 'sansserif', name: 'Sans-serif', family: 'sans-serif' }
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
      // First try with all fields
      let updateData: any = {
        background_type: settings.background_type,
        background_image: settings.background_image,
        background_gradient_direction: settings.background_gradient_direction,
        primary_color: settings.primary_color,
        updated_at: new Date().toISOString()
      }

      // Add display name fields if they exist in the database
      try {
        updateData.display_name_color = settings.display_name_color
        updateData.display_name_font = settings.display_name_font
      } catch (e) {
        console.log('Display name fields not yet available in database')
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', profile.user_id)

      if (error) throw error

      await refreshProfile()
      setMessage('Profile customization saved successfully!')

      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      console.error('Error saving customization:', error)
      setMessage('Failed to save customization. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const previewStyle = () => {
    if (settings.background_type === 'image') {
      return {
        backgroundImage: `url('${settings.background_image}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
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

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Palette className="w-5 h-5 mr-2" />
          Profile Customization
        </h3>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('success')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="space-y-6">

            {/* Display Name Customization */}
            <div className="border-t pt-6">
              <h4 className="text-md font-semibold mb-4 flex items-center">
                <Type className="w-4 h-4 mr-2" />
                Display Name Style
              </h4>

              {/* Display Name Color */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={settings.display_name_color}
                    onChange={(e) => setSettings({ ...settings, display_name_color: e.target.value })}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.display_name_color}
                    onChange={(e) => setSettings({ ...settings, display_name_color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>

              {/* Font Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {fontOptions.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setSettings({ ...settings, display_name_font: font.id as any })}
                      className={`p-3 rounded-lg border-2 transition-colors text-left ${
                        settings.display_name_font === font.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ fontFamily: font.family }}
                    >
                      <div className="font-medium text-sm">{font.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Background Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSettings({ ...settings, background_type: 'image' })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    settings.background_type === 'image'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Image</span>
                </button>
                <button
                  onClick={() => setSettings({ ...settings, background_type: 'gradient' })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    settings.background_type === 'gradient'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Layers className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Gradient</span>
                </button>
                <button
                  onClick={() => setSettings({ ...settings, background_type: 'solid' })}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    settings.background_type === 'solid'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Palette className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">Solid</span>
                </button>
              </div>
            </div>

            {/* Background Image Selection */}
            {settings.background_type === 'image' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Image
                </label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {backgroundImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSettings({ ...settings, background_image: image })}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        settings.background_image === image
                          ? 'border-blue-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Background ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {settings.background_image === image && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Image Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-600">
                      {uploading ? 'Uploading...' : 'Upload custom background image'}
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG up to 10MB
                    </span>
                  </label>
                </div>

                {uploadError && (
                  <div className="mt-2 text-sm text-red-600">
                    {uploadError}
                  </div>
                )}
              </div>
            )}

            {/* Gradient Direction */}
            {settings.background_type === 'gradient' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gradient Direction
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, background_gradient_direction: 'white' })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      settings.background_gradient_direction === 'white'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-6 rounded mb-2" style={{
                      background: `linear-gradient(to right, ${settings.primary_color}, #FFFFFF)`
                    }}></div>
                    <span className="text-xs">To White</span>
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, background_gradient_direction: 'black' })}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      settings.background_gradient_direction === 'black'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-6 rounded mb-2" style={{
                      background: `linear-gradient(to right, ${settings.primary_color}, #000000)`
                    }}></div>
                    <span className="text-xs">To Black</span>
                  </button>
                </div>
              </div>
            )}

            {/* Primary Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primary_color}
                  onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Preview Panel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div
                className="h-64 relative transition-all duration-500"
                style={previewStyle()}
              >
                <div className="absolute inset-0 bg-black bg-opacity-10">
                  <div className="p-4 text-center">
                    <div className="max-w-sm mx-auto p-4 glass-panel rounded-xl">
                      <div className="flex flex-col items-center space-y-2">
                        <div>
                          <h3
                            className="text-lg font-bold"
                            style={getDisplayNameStyle()}
                          >
                            {profile?.display_name || 'Your Name'}
                          </h3>
                          {(profile?.bio || 'Your bio will appear here') && (
                            <p className="text-sm text-white opacity-80 mt-1">
                              {profile?.bio || 'Your bio will appear here'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="glass-panel rounded-lg p-3">
                      <div className="flex items-center justify-between text-white text-sm">
                        <span>Sample Product</span>
                        <button
                          className="px-3 py-1 rounded text-white text-xs font-medium"
                          style={{ backgroundColor: settings.primary_color }}
                        >
                          Open Product
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600">
              <p>This is how your profile will look to visitors.</p>
              <p className="mt-1">
                <a
                  href={`/u/${profile?.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View your live profile →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .glass-panel {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }


      `}</style>
    </div>
  )
}
