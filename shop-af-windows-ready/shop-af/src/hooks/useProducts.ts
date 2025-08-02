import { useState, useEffect, useRef } from 'react'
import { supabase, type Product, PLAN_LIMITS } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useProducts(userId?: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastFetchedUserIdRef = useRef<string | null>(null)
  const { user, profile } = useAuth()

  useEffect(() => {
    const targetUserId = userId || user?.id

    // Prevent duplicate fetches for the same user
    if (targetUserId && targetUserId !== lastFetchedUserIdRef.current) {
      console.log('useProducts: Fetching products for userId:', targetUserId)
      lastFetchedUserIdRef.current = targetUserId
      fetchProducts(targetUserId)
    } else if (!targetUserId) {
      console.log('useProducts: No userId provided, setting empty products')
      setLoading(false)
      setProducts([])
      lastFetchedUserIdRef.current = null
    } else {
      console.log('useProducts: Skipping fetch, already loaded for userId:', targetUserId)
    }
  }, [userId, user?.id])

  const fetchProducts = async (targetUserId?: string) => {
    const actualUserId = targetUserId || userId || user?.id
    if (!actualUserId) {
      console.log('fetchProducts: No userId available')
      setLoading(false)
      return
    }

    try {
      console.log('fetchProducts: Loading products for userId:', actualUserId)
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', actualUserId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      console.log('fetchProducts result:', { data, error })

      if (error) {
        console.error('Products fetch error:', error)
        throw error
      }

      setProducts(data || [])
      console.log('Products loaded successfully:', data?.length || 0, 'products')
    } catch (err: any) {
      console.error('fetchProducts error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product: Omit<Product, 'id' | 'user_id' | 'click_count' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    if (!user || !profile) {
      setError('Authentication required')
      return false
    }

    // Check plan limits
    const currentCount = products.length
    const limit = PLAN_LIMITS[profile.plan_type].products

    if (currentCount >= limit) {
      setError(`You've reached your plan limit of ${limit} products. Upgrade to add more.`)
      return false
    }

    try {
      const { error } = await supabase
        .from('products')
        .insert([{
          ...product,
          user_id: user.id
        }])

      if (error) throw error

      // Update product count in profile
      await supabase
        .from('profiles')
        .update({
          product_count: currentCount + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      await fetchProducts()
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const updateProduct = async (id: number, updates: Partial<Product>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user?.id) // Ensure user owns the product

      if (error) throw error
      await fetchProducts()
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const deleteProduct = async (id: number): Promise<boolean> => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      // Update product count
      const newCount = Math.max(0, products.length - 1)
      await supabase
        .from('profiles')
        .update({
          product_count: newCount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      await fetchProducts()
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const trackClick = async (productId: number, affiliateUrl: string) => {
    console.log('trackClick called with:', { productId, affiliateUrl })

    // Always open the affiliate link immediately
    window.open(affiliateUrl, '_blank', 'noopener,noreferrer')

    // Try to track the click in the background (non-blocking)
    try {
      const { data, error } = await supabase.functions.invoke('track-click', {
        body: { productId, affiliateUrl }
      })

      if (error) {
        console.log('Track-click function error (non-critical):', error)
      } else {
        console.log('Click tracked successfully:', data)
      }
    } catch (err) {
      console.log('Track-click function failed (non-critical):', err)
      // This is non-critical since we already opened the link
    }
  }

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    trackClick,
    refetch: fetchProducts
  }
}