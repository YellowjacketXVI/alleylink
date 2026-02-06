import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { STRIPE_CONFIG } from '../lib/stripe'

type PlanType = 'basic' | 'pro'

const VALID_PLAN_TYPES: PlanType[] = ['basic', 'pro']

const isValidPlanType = (planType: string): planType is PlanType => {
  return VALID_PLAN_TYPES.includes(planType as PlanType)
}

export function useSubscription() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, profile, refreshProfile } = useAuth()

  // Cleanup function to reset states on unmount
  useEffect(() => {
    return () => {
      setLoading(false)
      setError(null)
    }
  }, [])

  const createSubscription = async (planType: PlanType = 'pro'): Promise<string | null> => {
    if (!user) {
      const errorMsg = 'Authentication required: Please sign in to subscribe'
      setError(errorMsg)
      return null
    }

    if (!isValidPlanType(planType)) {
      const errorMsg = `Invalid plan type: ${planType}. Must be one of: ${VALID_PLAN_TYPES.join(', ')}`
      setError(errorMsg)
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { planType }
      })

      if (error) {
        throw new Error(`Subscription creation failed: ${error.message || 'Unknown error'}`)
      }

      if (data.data.whitelisted) {
        // User is whitelisted, refresh profile to show new status
        try {
          await refreshProfile()
          return null // No checkout needed
        } catch (refreshError: any) {
          // Even if profile refresh fails, the subscription was created successfully
          console.warn('Profile refresh failed after whitelisting:', refreshError)
          return null
        }
      }

      if (data.data.checkoutUrl) {
        return data.data.checkoutUrl
      }

      throw new Error('Subscription service error: No checkout URL received from payment provider')
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to create subscription due to an unexpected error'
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }

  const openCustomerPortal = useCallback(async (onNavigate?: (url: string) => void): Promise<boolean> => {
    if (!user) {
      const errorMsg = 'Authentication required: Please sign in to manage your subscription'
      setError(errorMsg)
      return false
    }

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal')

      if (error) {
        throw new Error(`Portal access failed: ${error.message || 'Unknown error'}`)
      }

      if (data.data.portalUrl) {
        if (onNavigate) {
          onNavigate(data.data.portalUrl)
        } else {
          window.location.href = data.data.portalUrl
        }
        return true
      } else {
        throw new Error('Portal service error: No portal URL received from payment provider')
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to open customer portal due to an unexpected error'
      setError(errorMsg)
      return false
    } finally {
      setLoading(false)
    }
  }, [user])

  const cancelSubscription = async (onNavigate?: (url: string) => void): Promise<boolean> => {
    // Redirect to customer portal for subscription management
    return await openCustomerPortal(onNavigate)
  }

  const isSubscribed = profile?.subscription_status === 'active'
  const isBasic = profile?.plan_type === 'basic'
  const isPro = profile?.plan_type === 'pro' || profile?.plan_type === 'unlimited'
  const isUnlimited = profile?.plan_type === 'unlimited'

  return {
    createSubscription,
    cancelSubscription,
    openCustomerPortal,
    isSubscribed,
    isBasic,
    isPro,
    isUnlimited,
    loading,
    error
  }
}