import { createClient } from '@supabase/supabase-js'

// Environment variables - must be set in .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.')
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
  background_gradient_type?: 'linear' | 'radial' | 'diamond' | 'vignette'
  display_name_color?: string
  display_name_font?: string // Support all font options dynamically
  card_style?: 'light' | 'dark' | 'custom'
  card_color?: string
  card_text_color?: string
  glass_mode?: 'matte' | 'gloss'
  glass_tint?: string
  subscription_status: 'free' | 'active' | 'inactive'
  plan_type: 'free' | 'basic' | 'pro' | 'unlimited'
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
  basic: { products: 100, analytics: true },
  pro: { products: Infinity, analytics: true },
  unlimited: { products: Infinity, analytics: true }
} as const

// Stripe price IDs - must be set in .env file
export const STRIPE_PRICES = {
  basic_monthly: import.meta.env.VITE_STRIPE_PRICE_BASIC_MONTHLY || '',
  pro_monthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY || ''
} as const
