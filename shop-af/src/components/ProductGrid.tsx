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
      <div className="grid grid-auto-fill gap-fluid">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-gray-200"></div>
            <div className="p-3">
              <div className="h-3.5 bg-gray-200 rounded mb-1.5"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Tag className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {editable ? 'No Products Yet' : 'No Products Found'}
        </h3>
        <p className="text-gray-600 text-sm">
          {editable
            ? 'Ready to start earning? Add your first product in just a few clicks.'
            : 'This user hasn\'t added any products yet.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-auto-fill gap-fluid">
      {products.map((product) => (
        <div
          key={product.id}
          className="group bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition-all duration-200 hover:-translate-y-1 cursor-pointer relative"
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
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit?.(product)
                  }}
                  className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm('Are you sure you want to delete this product?')) {
                      onDelete?.(product.id)
                    }
                  }}
                  className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Product Image */}
          <div
            className="relative overflow-hidden aspect-[4/3]"
            style={{ backgroundColor: product.bg_color || (product.image_url ? '#f3f4f6' : undefined) }}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Tag className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-3">
            <h3 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>

            {product.description && (
              <p className="text-gray-500 text-xs mb-2 line-clamp-1">
                {product.description}
              </p>
            )}

            {/* Tags */}
            {product.category_tags && product.category_tags.length > 0 && (
              <div className="flex flex-wrap gap-0.5 mb-2">
                {product.category_tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 text-[10px] font-medium bg-blue-50 text-blue-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {product.category_tags.length > 2 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500 rounded-full">
                    +{product.category_tags.length - 2}
                  </span>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>{product.click_count} clicks</span>
              {product.is_featured && (
                <span className="bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                  Featured
                </span>
              )}
            </div>

            {/* Action Button */}
            {!editable && (
              <button
                className="w-full mt-2 bg-blue-600 text-white py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                onClick={(e) => {
                  e.stopPropagation()
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