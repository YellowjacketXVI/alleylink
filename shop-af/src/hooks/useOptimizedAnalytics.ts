import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface ProductClickAnalytics {
  product_id: number
  product_title: string
  click_count: number
}

interface AnalyticsData {
  totalClicks: number
  profileViews: number
  productClicks: ProductClickAnalytics[]
  clickRate: number
}

export function useOptimizedAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalClicks: 0,
    profileViews: 0,
    productClicks: [],
    clickRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (user?.id) {
      // Initial fetch
      fetchAnalytics()
      
      // Set up real-time updates every 300ms (skip loading state for updates)
      intervalRef.current = setInterval(() => {
        fetchAnalytics(true)
      }, 300)
    }

    // Cleanup interval on unmount or user change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [user?.id])

  const fetchAnalytics = async (skipLoading = false) => {
    if (!user?.id) return

    try {
      if (!skipLoading) {
        setLoading(true)
      }
      setError(null)

      // Use Promise.all for parallel queries to improve performance
      const [productClicksResult, profileViewsResult] = await Promise.all([
        // 1) Fetch product clicks using materialized view (fallback to regular query)
        (async () => {
          const materializedResult = await supabase
            .from('analytics_summary')
            .select('product_id, product_title, click_count')
            .eq('user_id', user.id)
            .order('click_count', { ascending: false })

          // If materialized view doesn't exist, fallback to regular query
          if (materializedResult.error && materializedResult.error.message?.includes('does not exist')) {
            return await supabase
              .from('products')
              .select(`
                id,
                title,
                click_analytics!inner(product_id)
              `)
              .eq('user_id', user.id)
              .eq('is_active', true)
          }
          return materializedResult
        })(),

        // 2) Fetch profile views count
        supabase
          .from('profile_view_analytics')
          .select('id', { count: 'exact', head: true })
          .eq('profile_user_id', user.id)
      ])

      // Process product clicks data
      let productClicks: ProductClickAnalytics[] = []
      let totalClicks = 0

      if (productClicksResult.data) {
        if (Array.isArray(productClicksResult.data) && productClicksResult.data.length > 0) {
          // Check if we're using materialized view data or regular query data
          if ('click_count' in productClicksResult.data[0]) {
            // Materialized view data
            productClicks = productClicksResult.data.map((item: any) => ({
              product_id: item.product_id,
              product_title: item.product_title,
              click_count: item.click_count || 0
            }))
            totalClicks = productClicks.reduce((sum, item) => sum + item.click_count, 0)
          } else {
            // Regular query data - need to aggregate
            const clickCounts = new Map<number, { title: string, count: number }>()
            
            for (const product of productClicksResult.data as any[]) {
              const clickCount = product.click_analytics?.length || 0
              clickCounts.set(product.id, {
                title: product.title,
                count: clickCount
              })
              totalClicks += clickCount
            }

            productClicks = Array.from(clickCounts.entries())
              .map(([product_id, data]) => ({
                product_id,
                product_title: data.title,
                click_count: data.count
              }))
              .filter(item => item.click_count > 0)
              .sort((a, b) => b.click_count - a.click_count)
          }
        }
      }

      // Process profile views data
      const profileViews = profileViewsResult.count || 0

      // Calculate click rate percentage (clicks per profile view)
      const clickRate = profileViews > 0 ? (totalClicks / profileViews) * 100 : 0

      setAnalytics({
        totalClicks,
        profileViews,
        productClicks,
        clickRate: Math.round(clickRate * 10) / 10 // Round to 1 decimal place
      })

    } catch (err: any) {
      console.error('Analytics fetch error:', err)
      setError(err.message)
    } finally {
      if (!skipLoading) {
        setLoading(false)
      }
    }
  }

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  }
}