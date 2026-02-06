import React from 'react'
import { Edit, Trash2, ExternalLink, Tag } from 'lucide-react'
import { type Product } from '../lib/supabase'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  onEdit?: (product: Product) => void
  onDelete?: (productId: number) => void
  editable?: boolean
  onProductClick?: (product: Product) => void
  trackClick?: (productId: number, affiliateUrl: string) => void
}

export default function ProductGrid({
  products,
  loading = false,
  onEdit,
  onDelete,
  editable = false,
  onProductClick,
  trackClick
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {editable ? 'No Products Yet' : 'No Products Found'}
        </h3>
        <p className="text-gray-600">
          {editable
            ? 'Ready to start earning? Add your first product in just a few clicks.'
            : 'This user hasn\'t added any products yet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative"
          onClick={() => {
            if (editable) {
              onProductClick?.(product)
            } else {
              trackClick?.(product.id, product.affiliate_url)
            }
          }}
        >
          {/* Admin Actions */}
          {editable && (
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit?.(product)
                  }}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm('Are you sure you want to delete this product?')) {
                      onDelete?.(product.id)
                    }
                  }}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Product Image */}
          <div
            className="relative overflow-hidden aspect-square"
            style={{ backgroundColor: product.bg_color || (product.image_url ? '#f3f4f6' : undefined) }}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Tag className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>

            {product.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
            )}

            {/* Tags */}
            {product.category_tags && product.category_tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {product.category_tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {product.category_tags.length > 3 && (
                  <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                    +{product.category_tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{product.click_count} clicks</span>
              {product.is_featured && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  Featured
                </span>
              )}
            </div>

            {/* Action Button */}
            {!editable && (
              <button
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                onClick={(e) => {
                  e.stopPropagation() // Prevent double-click from parent div
                  trackClick?.(product.id, product.affiliate_url)
                }}
              >
                Open Product
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}