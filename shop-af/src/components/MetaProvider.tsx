import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface MetaData {
  title?: string
  description?: string
  keywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
}

const routeMetaData: Record<string, MetaData> = {
  '/': {
    title: 'AlleyLink - Your Personal Affiliate Storefront',
    description: 'Create your personalized affiliate marketing storefront with AlleyLink. Showcase products, track performance, and grow your affiliate business.',
    keywords: 'affiliate marketing, storefront, e-commerce, affiliate links',
    ogTitle: 'AlleyLink - Your Personal Affiliate Storefront',
    ogDescription: 'Create your personalized affiliate marketing storefront with AlleyLink.',
    ogImage: '/og-image.jpg'
  },
  '/pricing': {
    title: 'Pricing - AlleyLink',
    description: 'Choose the perfect plan for your affiliate marketing business. Start free and upgrade as you grow.',
    keywords: 'pricing, plans, affiliate marketing, subscription',
    ogTitle: 'AlleyLink Pricing - Choose Your Plan',
    ogDescription: 'Choose the perfect plan for your affiliate marketing business.'
  },
  '/signup': {
    title: 'Sign Up - AlleyLink',
    description: 'Join AlleyLink and start building your affiliate marketing storefront today.',
    keywords: 'sign up, register, affiliate marketing, join',
    ogTitle: 'Join AlleyLink Today',
    ogDescription: 'Start building your affiliate marketing storefront today.'
  },
  '/login': {
    title: 'Login - AlleyLink',
    description: 'Access your AlleyLink dashboard and manage your affiliate storefront.',
    keywords: 'login, sign in, dashboard, affiliate marketing',
    ogTitle: 'Login to AlleyLink',
    ogDescription: 'Access your AlleyLink dashboard and manage your affiliate storefront.'
  },
  '/dashboard': {
    title: 'Dashboard - AlleyLink',
    description: 'Manage your affiliate products, track performance, and grow your business.',
    keywords: 'dashboard, affiliate management, analytics, products',
    ogTitle: 'AlleyLink Dashboard',
    ogDescription: 'Manage your affiliate products and track performance.'
  }
}

export default function MetaProvider() {
  const location = useLocation()

  useEffect(() => {
    const meta = routeMetaData[location.pathname] || routeMetaData['/']
    
    // Update title
    if (meta.title) {
      document.title = meta.title
    }

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!element) {
        element = document.createElement('meta')
        element.name = name
        document.head.appendChild(element)
      }
      element.content = content
    }

    const updatePropertyTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute('property', property)
        document.head.appendChild(element)
      }
      element.content = content
    }

    if (meta.description) {
      updateMetaTag('description', meta.description)
    }
    
    if (meta.keywords) {
      updateMetaTag('keywords', meta.keywords)
    }

    if (meta.ogTitle) {
      updatePropertyTag('og:title', meta.ogTitle)
    }

    if (meta.ogDescription) {
      updatePropertyTag('og:description', meta.ogDescription)
    }

    if (meta.ogImage) {
      updatePropertyTag('og:image', meta.ogImage)
    }

    // Always update og:url
    updatePropertyTag('og:url', window.location.href)
    updatePropertyTag('og:type', 'website')

  }, [location.pathname])

  return null
}