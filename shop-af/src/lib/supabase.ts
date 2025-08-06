import { createClient } from '@supabase/supabase-js'

// Production configuration with fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eyafgfuxvarbpkhjkuxq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YWZnZnV4dmFyYnBraGprdXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxNTI5NzksImV4cCI6MjA2ODcyODk3OX0.3TcVpxX3XeuL_WtMNsitvKFP1-DI3gFzdZkTYJ7BSQQ'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for Shop AF
export interface Profile {
  user_id: string
  username: string
  display_name: string
  bio?: string
  avatar_url?: string
  primary_color: string
  background_type?: 'image' | 'gradient' | 'solid'
  background_image?: string
  background_gradient_direction?: 'white' | 'black'
  display_name_color?: string
  display_name_font?: 'merriweather' | 'poppins' | 'orbitron' | 'montserrat' | 'inter' | 'papyrus' | 'sansserif'
  subscription_status: 'free' | 'active' | 'inactive'
  plan_type: 'free' | 'pro' | 'unlimited'
  stripe_customer_id?: string
  stripe_subscription_id?: string
  product_count: number
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: number
  user_id: string
  title: string
  description?: string
  image_url?: string
  affiliate_url: string
  category_tags: string[]
  click_count: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  user_id: string
  name: string
  color: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: number
  user_id: string
  stripe_subscription_id?: string
  stripe_customer_id?: string
  plan_type: string
  status: string
  current_period_start?: string
  current_period_end?: string
  cancel_at_period_end: boolean
  canceled_at?: string
  customer_email?: string
  created_at: string
  updated_at: string
}

export interface WhitelistEntry {
  id: number
  email: string
  granted_by_admin?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ClickAnalytics {
  id: number
  product_id: number
  user_id?: string
  clicked_at: string
  ip_address?: string
  user_agent?: string
  referrer?: string
}

export interface ProfileViewAnalytics {
  id: number
  profile_user_id: string
  viewer_user_id?: string
  viewed_at: string
  ip_address?: string
  user_agent?: string
  referrer?: string
}

// Plan limits
export const PLAN_LIMITS = {
  free: { products: 3, analytics: false },
  pro: { products: Infinity, analytics: true },
  unlimited: { products: Infinity, analytics: true }
} as const

// Stripe price IDs with fallback
export const STRIPE_PRICES = {
  pro_monthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY || 'price_1Rrki6DGBbR8XeGsrr4iz7TY'
} as const