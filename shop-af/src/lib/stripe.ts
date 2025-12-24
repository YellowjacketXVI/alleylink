import { loadStripe } from '@stripe/stripe-js'

// Stripe publishable key with fallback
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_l3DJeztxsxijCpy2hAuQ90VK'

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key. Please check your .env file.')
}

export const stripe = loadStripe(stripePublishableKey)

// Stripe price configuration
export const STRIPE_CONFIG = {
  prices: {
    basic: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_BASIC_MONTHLY || 'price_1SB68VDGBbR8XeGs5EqAmqyu',
      amount: 2.99,
      currency: 'usd',
      interval: 'month'
    },
    pro: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY || 'price_1Rrki6DGBbR8XeGsrr4iz7TY',
      amount: 4.99,
      currency: 'usd',
      interval: 'month'
    }
  }
} as const