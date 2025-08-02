import { loadStripe } from '@stripe/stripe-js'

// Stripe publishable key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripePublishableKey) {
  throw new Error('Missing Stripe publishable key. Please check your .env file.')
}

export const stripe = loadStripe(stripePublishableKey)

// Stripe price configuration
export const STRIPE_CONFIG = {
  prices: {
    pro: {
      monthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY,
      amount: 4.99,
      currency: 'usd',
      interval: 'month'
    }
  }
} as const