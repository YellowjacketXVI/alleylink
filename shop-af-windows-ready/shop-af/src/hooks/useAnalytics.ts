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

      // Fetch click analytics (with fallback if table doesn't exist)
      let clickData: any[] = []
      try {
        const { data, error: clickError } = await supabase
          .from('click_analytics')
          .select(`
            product_id,
            products!inner(title, user_id)
          `)
          .eq('products.user_id', user.id)

        if (clickError && !clickError.message.includes('does not exist')) {
          throw clickError
        }
        clickData = data || []
      } catch (err: any) {
        if (!err.message?.includes('does not exist')) {
          console.error('Click analytics error:', err)
        }
        clickData = []
      }

      // Fetch profile view analytics (with fallback if table doesn't exist)
      let profileViewData: any[] = []
      try {
        const { data, error: profileViewError } = await supabase
          .from('profile_view_analytics')
          .select('id')
          .eq('profile_user_id', user.id)

        if (profileViewError && !profileViewError.message.includes('does not exist')) {
          throw profileViewError
        }
        profileViewData = data || []
      } catch (err: any) {
        if (!err.message?.includes('does not exist')) {
          console.error('Profile view analytics error:', err)
        }
        profileViewData = []
      }

      // Process click data
      const productClickMap = new Map<number, { title: string; count: number }>()
      
      clickData?.forEach((click: any) => {
        const productId = click.product_id
        const productTitle = click.products.title
        
        if (productClickMap.has(productId)) {
          productClickMap.get(productId)!.count++
        } else {
          productClickMap.set(productId, { title: productTitle, count: 1 })
        }
      })

      const productClicks: ProductClickAnalytics[] = Array.from(productClickMap.entries()).map(
        ([productId, data]) => ({
          product_id: productId,
          product_title: data.title,
          click_count: data.count
        })
      )

      setAnalytics({
        totalClicks: clickData?.length || 0,
        profileViews: profileViewData?.length || 0,
        productClicks: productClicks.sort((a, b) => b.click_count - a.click_count)
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
