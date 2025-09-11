import { useState, useEffect } from 'react'
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
}

export function useAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalClicks: 0,
    profileViews: 0,
    productClicks: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      fetchAnalytics()
    }
  }, [user?.id])

  const fetchAnalytics = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
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
        // Profile views still counted even when no products
        let profileViewCount = 0
        try {
          const { data: profileViewsData, error: profileViewsError } = await supabase
            .from('profile_view_analytics')
            .select('id')
            .eq('profile_user_id', user.id)

          if (profileViewsError && !profileViewsError.message?.includes('does not exist')) {
            throw profileViewsError
          }
          profileViewCount = profileViewsData?.length || 0
        } catch (pvErr: any) {
          if (!pvErr.message?.includes('does not exist')) {
            console.error('Profile view analytics error:', pvErr)
          }
        }

        setAnalytics({ totalClicks: 0, profileViews: profileViewCount, productClicks: [] })
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

      // 3) Fetch profile view analytics count for this user
      let profileViews = 0
      try {
        const { data, error: profileViewError } = await supabase
          .from('profile_view_analytics')
          .select('id')
          .eq('profile_user_id', user.id)

        if (profileViewError && !profileViewError.message?.includes('does not exist')) {
          throw profileViewError
        }
        profileViews = data?.length || 0
      } catch (err: any) {
        if (!err.message?.includes('does not exist')) {
          console.error('Profile view analytics error:', err)
        }
        profileViews = 0
      }

      // 4) Aggregate clicks per product_id
      const counts = new Map<number, number>()
      for (const row of clickRows) {
        counts.set(row.product_id, (counts.get(row.product_id) || 0) + 1)
      }

      // 5) Join counts with product titles
      const productTitleById = new Map<number, string>(products!.map(p => [p.id, p.title]))
      const productClicks: ProductClickAnalytics[] = Array.from(counts.entries()).map(([product_id, count]) => ({
        product_id,
        product_title: productTitleById.get(product_id) || `Product ${product_id}`,
        click_count: count,
      }))

      // 6) Sort by clicks desc and compute totals
      productClicks.sort((a, b) => b.click_count - a.click_count)
      const totalClicks = clickRows.length

      setAnalytics({
        totalClicks,
        profileViews,
        productClicks,
      })
    } catch (err: any) {
      console.error('Analytics fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    analytics,
    loading,
    error,
    refetch: fetchAnalytics
  }
}
