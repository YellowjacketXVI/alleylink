import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useSubscription() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, profile, refreshProfile } = useAuth()

  const createSubscription = async (planType: 'pro' = 'pro'): Promise<string | null> => {
    if (!user) {
      setError('Please sign in to subscribe')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { planType }
      })

      if (error) throw error

      if (data.data.whitelisted) {
        // User is whitelisted, refresh profile to show new status
        await refreshProfile()
        return null // No checkout needed
      }

      if (data.data.checkoutUrl) {
        return data.data.checkoutUrl
      }

      throw new Error('No checkout URL received')
    } catch (err: any) {
      setError(err.message || 'Failed to create subscription')
      return null
    } finally {
      setLoading(false)
    }
  }

  const openCustomerPortal = async (): Promise<void> => {
    if (!user) {
      setError('Please sign in to manage subscription')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal')

      if (error) throw error

      if (data.data.portalUrl) {
        window.location.href = data.data.portalUrl
      } else {
        throw new Error('No portal URL received')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to open customer portal')
    } finally {
      setLoading(false)
    }
  }

  const cancelSubscription = async (): Promise<boolean> => {
    // Redirect to customer portal for subscription management
    await openCustomerPortal()
    return true
  }

  const isSubscribed = profile?.subscription_status === 'active'
  const isPro = profile?.plan_type === 'pro' || profile?.plan_type === 'unlimited'
  const isUnlimited = profile?.plan_type === 'unlimited'

  return {
    createSubscription,
    cancelSubscription,
    openCustomerPortal,
    isSubscribed,
    isPro,
    isUnlimited,
    loading,
    error
  }
}