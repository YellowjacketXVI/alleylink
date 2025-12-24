import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { Check, Star, Crown, ArrowLeft, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'

export default function PricingPage() {
  const { user, profile } = useAuth()
  const { createSubscription, isPro, loading: subscriptionLoading } = useSubscription()

  const isBasic = profile?.plan_type === 'basic'
  const currentPlan = profile?.plan_type || 'free'

  const handleUpgrade = async (planType: 'basic' | 'pro') => {
    try {
      const checkoutUrl = await createSubscription(planType)
      
      if (checkoutUrl) {
        window.location.href = checkoutUrl
      }
    } catch (error) {
      console.error('Error in handleUpgrade:', error)
    }
  }

  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      price: 0,
      description: 'Try AlleyLink with limited features',
      features: [
        'Up to 9 products',
        'Personal storefront',
        'Basic customization',
        'Community support',
        'Profile URL (alleylink.com/u/yourlink)'
      ],
      limitations: [
        'Limited to 9 products',
        'No analytics',
        'Basic support only'
      ],
      buttonText: 'Start Free Trial',
      buttonAction: () => window.location.href = user ? '/dashboard' : '/signup',
      popular: false,
      current: currentPlan === 'free'
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 2.99,
      description: 'Perfect for growing affiliate marketers',
      features: [
        'Up to 100 products',
        'Personal storefront',
        'Custom branding & colors',
        'Email support',
        'Profile URL (alleylink.com/u/yourlink)',
        'Basic customization options'
      ],
      limitations: [
        'Limited to 100 products',
        'No advanced analytics',
        'Email support only'
      ],
      buttonText: isBasic ? 'Current Plan' : 'Upgrade to Basic',
      buttonAction: () => !isBasic && handleUpgrade('basic'),
      popular: false,
      current: currentPlan === 'basic'
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
      current: currentPlan === 'pro'
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
            <div className="inline-block bg-blue-100 rounded-full px-6 py-2 mb-6">
              <span className="text-blue-600 font-medium">✨ Affiliate Marketing Made Simple</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Simple, Transparent
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Pricing
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get your link, add products, start earning. No hidden fees, no complexity.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 lg:p-8 shadow-xl transition-all duration-300 hover:shadow-2xl h-full flex flex-col ${
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
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-3">
                    <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center ${
                      plan.popular ? 'bg-white/20' : 'bg-blue-100'
                    }`}>
                      {plan.id === 'pro' ? (
                        <Crown className={`w-6 h-6 lg:w-8 lg:h-8 ${plan.popular ? 'text-white' : 'text-blue-600'}`} />
                      ) : plan.id === 'basic' ? (
                        <Zap className={`w-6 h-6 lg:w-8 lg:h-8 ${plan.popular ? 'text-white' : 'text-blue-600'}`} />
                      ) : (
                        <Star className={`w-6 h-6 lg:w-8 lg:h-8 ${plan.popular ? 'text-white' : 'text-blue-600'}`} />
                      )}
                    </div>
                  </div>

                  <h3 className={`text-xl lg:text-2xl font-bold mb-2 ${
                    plan.popular ? 'text-white' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </h3>

                  <div className={`text-3xl lg:text-4xl font-bold mb-2 ${
                    plan.popular ? 'text-white' : 'text-gray-900'
                  }`}>
                    ${plan.price.toFixed(2)}
                    <span className={`text-base lg:text-lg font-medium ${
                      plan.popular ? 'text-blue-200' : 'text-gray-600'
                    }`}>
                      {plan.price > 0 ? '/month' : ''}
                    </span>
                  </div>

                  <p className={`text-sm lg:text-base ${
                    plan.popular ? 'text-blue-100' : 'text-gray-600'
                  }`}>
                    {plan.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-6 flex-grow">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className={`w-4 h-4 lg:w-5 lg:h-5 mt-0.5 flex-shrink-0 ${
                        plan.popular ? 'text-green-300' : 'text-green-500'
                      }`} />
                      <span className={`text-sm lg:text-base ${
                        plan.popular ? 'text-white' : 'text-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  <button
                    onClick={plan.buttonAction}
                    disabled={subscriptionLoading || plan.current}
                    className={`w-full py-3 lg:py-4 rounded-xl font-semibold text-base lg:text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                      plan.popular
                        ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                    }`}
                  >
                    {subscriptionLoading ? 'Processing...' : plan.buttonText}
                  </button>

                  {plan.id === 'pro' && !plan.current && (
                    <p className={`text-center mt-2 text-xs lg:text-sm ${
                      plan.popular ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      Cancel anytime
                    </p>
                  )}
                </div>
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