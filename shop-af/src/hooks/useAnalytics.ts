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
  productClicks: ProductClickAnalytics[]
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalClicks: 0,
    productClicks: []
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
    if (!user?.id) {
      return
    }

    try {
      if (!skipLoading) {
        setLoading(true)
      }
      setError(null)

      // 1) Fetch this user's active products (id + title)
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, title')
        .eq('user_id', user.id)
        .eq('is_active', true)

      if (productsError) throw productsError

      const productIds = (products || []).map(p => p.id)

      // Early return if no products
      if (!productIds.length) {
        setAnalytics({ totalClicks: 0, productClicks: [] })
        return
      }

      // 2) Fetch click analytics rows for these product IDs
      let clickRows: { product_id: number }[] = []
      try {
        const { data, error: clickError } = await supabase
          .from('click_analytics')
          .select('product_id')
          .in('product_id', productIds)

        if (clickError && !clickError.message?.includes('does not exist')) {
          throw clickError
        }
        clickRows = (data as { product_id: number }[]) || []
      } catch (err: any) {
        if (!err.message?.includes('does not exist')) {
          console.error('Click analytics error:', err)
        }
        clickRows = []
      }

      // 3) Aggregate clicks per product_id
      const counts = new Map<number, number>()
      for (const row of clickRows) {
        counts.set(row.product_id, (counts.get(row.product_id) || 0) + 1)
      }

      // 4) Join counts with product titles
      const productTitleById = new Map<number, string>(products!.map(p => [p.id, p.title]))
      const productClicks: ProductClickAnalytics[] = Array.from(counts.entries()).map(([product_id, count]) => ({
        product_id,
        product_title: productTitleById.get(product_id) || `Product ${product_id}`,
        click_count: count,
      }))

      // 5) Sort by clicks desc and compute totals
      productClicks.sort((a, b) => b.click_count - a.click_count)
      const totalClicks = clickRows.length

      const analyticsData = {
        totalClicks,
        productClicks
      }

      setAnalytics(analyticsData)
    } catch (err: any) {
      console.error('[Analytics] Fetch error:', err)
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
