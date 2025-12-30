import { loadStripe } from '@stripe/stripe-js'

// Environment variables - must be set in .env file
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key. Please set VITE_STRIPE_PUBLISHABLE_KEY in your .env file.')
}

export const stripe = loadStripe(stripePublishableKey)

// Stripe price configuration - IDs must be set in .env file
export const STRIPE_CONFIG = {
  prices: {
    basic: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_BASIC_MONTHLY || '',
      amount: 2.99,
      currency: 'usd',
      interval: 'month'
    },
    pro: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY || '',
      amount: 4.99,
      currency: 'usd',
      interval: 'month'
    }
  }
} as const