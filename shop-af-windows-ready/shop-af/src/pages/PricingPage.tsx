import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { Check, Star, Crown, ArrowLeft, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function PricingPage() {
  const { user } = useAuth()
  const { createSubscription, isPro, loading: subscriptionLoading } = useSubscription()

  const handleUpgrade = async (planType: 'pro') => {
    const checkoutUrl = await createSubscription(planType)
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }

  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      price: 0,
      description: 'Try AlleyLink with limited features',
      features: [
        'Up to 3 products',
        'Personal storefront',
        'Basic customization',
        'Community support',
        'Profile URL (alleylink.com/u/yourlink)'
      ],
      limitations: [
        'Limited to 3 products',
        'No analytics',
        'Basic support only'
      ],
      buttonText: 'Start Free Trial',
      buttonAction: () => window.location.href = user ? '/dashboard' : '/signup',
      popular: false,
      current: !isPro
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 4.99,
      description: 'For serious affiliate marketers',
      features: [
        'Unlimited products',
        'Advanced analytics & insights',
        'Custom branding & colors',
        'Priority support',
        'Click tracking & conversion data',
        'Featured product highlights',
        'Custom profile themes',
        'Export analytics data'
      ],
      limitations: [],
      buttonText: isPro ? 'Current Plan' : 'Upgrade to Pro',
      buttonAction: () => !isPro && handleUpgrade('pro'),
      popular: true,
      current: isPro
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Simple, Transparent
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Pricing
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Start free, upgrade when you're ready to scale your affiliate business.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white transform hover:scale-105'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-500'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}

                {/* Current Plan Badge */}
                {plan.current && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Current Plan
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      plan.popular ? 'bg-white/20' : 'bg-blue-100'
                    }`}>
                      {plan.id === 'pro' ? (
                        <Crown className={`w-8 h-8 ${plan.popular ? 'text-white' : 'text-blue-600'}`} />
                      ) : (
                        <Zap className={`w-8 h-8 ${plan.popular ? 'text-white' : 'text-blue-600'}`} />
                      )}
                    </div>
                  </div>

                  <h3 className={`text-2xl font-bold mb-2 ${
                    plan.popular ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </h3>

                  <div className={`text-4xl font-bold mb-2 ${
                    plan.popular ? 'text-white' : 'text-gray-900'
                  }`}>
                    ${plan.price}
                    <span className={`text-lg font-medium ${
                      plan.popular ? 'text-blue-200' : 'text-gray-600'
                    }`}>
                      {plan.price > 0 ? '/month' : ''}
                    </span>
                  </div>

                  <p className={`${
                    plan.popular ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-green-300' : 'text-green-500'
                      }`} />
                      <span className={`${
                        plan.popular ? 'text-white' : 'text-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={plan.buttonAction}
                  disabled={subscriptionLoading || plan.current}
                  className={`w-full py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    plan.popular
                      ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                  }`}
                >
                  {subscriptionLoading ? 'Processing...' : plan.buttonText}
                </button>

                {plan.id === 'pro' && !plan.current && (
                  <p className={`text-center mt-3 text-sm ${
                    plan.popular ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    Cancel anytime
                  </p>
                )}
              </div>
            ))}
          </div>



          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are building successful affiliate businesses with Shop AF.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl inline-flex items-center justify-center space-x-2"
                >
                  <span>{user ? "Go to Dashboard" : "Start Free Today"}</span>
                </Link>

                <Link
                  to="/"
                  className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all inline-flex items-center justify-center space-x-2"
                >
                  <span>Learn More</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}