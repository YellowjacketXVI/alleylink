import React, { useState, useRef, useEffect } from 'react'
import { X, Upload, Plus, Minus, ChevronDown } from 'lucide-react'
import { useImageUpload } from '../hooks/useImageUpload'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface ProductFormData {
  title: string
  description: string
  affiliate_url: string
  image_url?: string
  bg_color?: string
  category_tags: string[]
  is_featured: boolean
  is_active: boolean
}

interface ProductFormProps {
  onClose: () => void
  onSubmit: (data: ProductFormData) => Promise<void>
  initialData?: ProductFormData
}

export default function ProductForm({ onClose, onSubmit, initialData }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    affiliate_url: initialData?.affiliate_url || '',
    image_url: initialData?.image_url || '',
    bg_color: initialData?.bg_color || '',
    category_tags: initialData?.category_tags || [],
    is_featured: initialData?.is_featured || false,
    is_active: initialData?.is_active ?? true
  })
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [existingTags, setExistingTags] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)

  const { user } = useAuth()
  const { uploadImage, uploading, error: uploadError } = useImageUpload()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Fetch existing category tags for the user
  useEffect(() => {
    const fetchExistingTags = async () => {
      if (!user?.id) return

      try {
        const { data, error } = await supabase
          .from('products')
          .select('category_tags')
          .eq('user_id', user.id)
          .eq('is_active', true)

        if (error) throw error

        // Extract all unique tags from all products
        const allTags = data?.flatMap(product => product.category_tags || []) || []
        const uniqueTags = Array.from(new Set(allTags)).sort()
        setExistingTags(uniqueTags)
      } catch (err) {
        console.error('Error fetching existing tags:', err)
      }
    }

    fetchExistingTags()
  }, [user?.id])

  // Filter suggestions based on current input
  const filteredSuggestions = existingTags.filter(tag =>
    tag.toLowerCase().includes(newTag.toLowerCase()) &&
    !formData.category_tags.includes(tag) &&
    tag.toLowerCase() !== newTag.toLowerCase()
  )

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleImageUpload = async (file: File) => {
    const url = await uploadImage(file, 'products')
    if (url) {
      setFormData(prev => ({ ...prev, image_url: url }))
    }
  }

  const addTag = (tagToAdd?: string) => {
    const tag = tagToAdd || newTag.trim()
    if (tag && !formData.category_tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        category_tags: [...prev.category_tags, tag]
      }))
      setNewTag('')
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)

      // Add to existing tags if it's a new tag
      if (!existingTags.includes(tag)) {
        setExistingTags(prev => [...prev, tag].sort())
      }
    }
  }

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewTag(value)
    setShowSuggestions(value.length > 0)
    setSelectedSuggestionIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedSuggestionIndex >= 0 && filteredSuggestions[selectedSuggestionIndex]) {
        addTag(filteredSuggestions[selectedSuggestionIndex])
      } else {
        addTag()
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  const selectSuggestion = (tag: string) => {
    addTag(tag)
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      category_tags: prev.category_tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (!formData.title.trim()) {
      setError('Product title is required')
      setLoading(false)
      return
    }

    if (!formData.affiliate_url.trim()) {
      setError('Affiliate URL is required')
      setLoading(false)
      return
    }

    // Validate URL format
    try {
      new URL(formData.affiliate_url)
    } catch {
      setError('Please enter a valid URL')
      setLoading(false)
      return
    }

    try {
      await onSubmit(formData)
    } catch (err: any) {
      setError(err.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Product Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Amazing Product Name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Tell people why they'll love this product..."
              rows={3}
            />
          </div>

          {/* Affiliate URL */}
          <div>
            <label htmlFor="affiliate_url" className="block text-sm font-medium text-gray-700 mb-2">
              Affiliate URL *
            </label>
            <input
              id="affiliate_url"
              type="url"
              value={formData.affiliate_url}
              onChange={(e) => setFormData(prev => ({ ...prev, affiliate_url: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="https://example.com/your-affiliate-link"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>

            {formData.image_url ? (
              <div className="space-y-3">
                <div
                  className="relative aspect-square max-w-[240px] mx-auto overflow-hidden rounded-xl border border-gray-200"
                  style={{ backgroundColor: formData.bg_color || '#f9fafb' }}
                >
                  <img
                    src={formData.image_url}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Background Color Picker */}
                <div className="flex items-center space-x-3">
                  <label className="text-sm text-gray-600 whitespace-nowrap">Background Color</label>
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="color"
                      value={formData.bg_color || '#f9fafb'}
                      onChange={(e) => setFormData(prev => ({ ...prev, bg_color: e.target.value }))}
                      className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                    />
                    <input
                      type="text"
                      value={formData.bg_color || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, bg_color: e.target.value }))}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#f9fafb"
                    />
                    {formData.bg_color && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, bg_color: '' }))}
                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                  className="hidden"
                  id="image-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload image'}
                  </span>
                  <span className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</span>
                </label>
              </div>
            )}

            {uploadError && (
              <p className="text-red-600 text-sm mt-2">{uploadError}</p>
            )}
          </div>

          {/* Category Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Tags
            </label>

            {/* Existing Tags */}
            {formData.category_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.category_tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-blue-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Add New Tag with Autocomplete */}
            <div className="relative">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newTag}
                    onChange={handleTagInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => newTag.length > 0 && setShowSuggestions(true)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Add a category tag..."
                  />

                  {/* Suggestions Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
                    >
                      {filteredSuggestions.map((tag, index) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => selectSuggestion(tag)}
                          className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                            index === selectedSuggestionIndex ? 'bg-blue-100' : ''
                          }`}
                        >
                          <span className="text-gray-900">
                            {tag.substring(0, tag.toLowerCase().indexOf(newTag.toLowerCase()))}
                            <span className="bg-yellow-200">
                              {tag.substring(
                                tag.toLowerCase().indexOf(newTag.toLowerCase()),
                                tag.toLowerCase().indexOf(newTag.toLowerCase()) + newTag.length
                              )}
                            </span>
                            {tag.substring(tag.toLowerCase().indexOf(newTag.toLowerCase()) + newTag.length)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addTag()}
                  disabled={!newTag.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center space-x-3">
            <input
              id="is_featured"
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
              Mark as featured product
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}