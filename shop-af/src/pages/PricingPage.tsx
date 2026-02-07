import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { Check, Star, Crown, ArrowLeft, ArrowRight, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'

/* ── Scroll-triggered fade hook ── */
function useScrollFade() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll('.scroll-fade').forEach(child => child.classList.add('visible'))
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

/* ── Floating gold particles component ── */
function FloatingParticles() {
  const particles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 10 + 12,
      delay: Math.random() * 15,
    })),
  [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            background: '#fbbf24',
            opacity: 0,
            animation: `float-up ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function PricingPage() {
  const { user, profile } = useAuth()
  const { createSubscription, isPro, loading: subscriptionLoading } = useSubscription()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const cardsRef = useScrollFade()
  const ctaRef = useScrollFade()

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
      monthlyPrice: 0,
      yearlyPrice: 0,
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
      current: currentPlan === 'free',
      icon: Star,
      iconGradient: 'from-gray-400 to-gray-500',
      checkColor: 'text-purple-700',
      checkBg: 'bg-purple-100',
    },
    {
      id: 'basic',
      name: 'Basic',
      monthlyPrice: 2.99,
      yearlyPrice: 2.39,
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
      current: currentPlan === 'basic',
      icon: Zap,
      iconGradient: 'from-purple-500 to-purple-700',
      checkColor: 'text-purple-700',
      checkBg: 'bg-purple-100',
    },
    {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 4.99,
      yearlyPrice: 3.99,
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
      current: currentPlan === 'pro',
      icon: Crown,
      iconGradient: 'from-purple-600 to-purple-800',
      checkColor: 'text-gold-300',
      checkBg: 'bg-white/20',
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-gold-50/30 font-sans relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-40 left-10 w-80 h-80 bg-gold-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl pointer-events-none"></div>

      <Navbar />

      <div className="relative py-8 px-3 sm:px-4 lg:px-6">
        <div className="max-w-screen-xl mx-auto">
          {/* Back button */}
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-block glass rounded-full px-5 py-2 mb-4">
              <span className="text-purple-700 font-accent text-sm tracking-wider uppercase">Affiliate Marketing Made Simple</span>
            </div>
            <h1 className="text-fluid-2xl font-extrabold text-gray-900 mb-4 leading-tight">
              Simple, Transparent
              <span className="text-gradient-purple"> Pricing</span>
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6">
              Get your link, add products, start earning. No hidden fees, no complexity.
            </p>

            {/* Monthly / Yearly Toggle */}
            <div className="inline-flex items-center glass rounded-full p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Yearly
                <span className="ml-1.5 text-[10px] font-bold bg-gradient-to-r from-gold-400 to-gold-500 text-white px-1.5 py-0.5 rounded-full">
                  SAVE 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-screen-xl mx-auto" ref={cardsRef}>
            {plans.map((plan, idx) => (
              <div key={plan.id} className={`scroll-fade delay-${idx + 1} ${plan.popular ? 'relative' : ''}`}>
                {/* Gradient border for Pro */}
                {plan.popular && (
                  <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-purple-500 via-gold-400 to-purple-600 opacity-80 blur-[1px] pointer-events-none"></div>
                )}

                <div
                  className={`relative rounded-2xl p-5 lg:p-6 transition-all duration-300 h-full flex flex-col ${
                    plan.popular
                      ? 'bg-gradient-to-br from-purple-700 via-purple-800 to-purple-950 text-white shadow-xl overflow-hidden'
                      : 'glass border border-white/60 shadow-md card-lift'
                  }`}
                >
                  {/* Pattern overlay for Pro */}
                  {plan.popular && (
                    <div className="absolute inset-0 pattern-dots opacity-15 pointer-events-none"></div>
                  )}

                  {/* Decorative glow for Pro */}
                  {plan.popular && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-2xl pointer-events-none"></div>
                  )}

                  {/* Recommended Badge */}
                  {plan.popular && (
                    <div className="absolute -top-0 left-1/2 animate-badge-bounce z-10">
                      <span className="bg-gradient-to-r from-gold-400 to-gold-500 text-purple-900 px-4 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-gold">
                        <Star className="w-3 h-3 fill-purple-900" />
                        <span>Recommended</span>
                      </span>
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {plan.current && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        Current Plan
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className={`text-center mb-4 ${plan.popular ? 'mt-4' : ''}`}>
                    <div className="flex items-center justify-center mb-3">
                      <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center shadow-md ${
                        plan.popular ? 'bg-white/20' : `bg-gradient-to-br ${plan.iconGradient}`
                      }`}>
                        {plan.popular ? (
                          <plan.icon className="w-6 h-6 lg:w-7 lg:h-7 text-gold-300" />
                        ) : (
                          <plan.icon className={`w-6 h-6 lg:w-7 lg:h-7 ${plan.id === 'free' ? 'text-white' : 'text-white'}`} />
                        )}
                      </div>
                    </div>

                    <h3 className={`text-lg lg:text-xl font-extrabold mb-2 ${
                      plan.popular ? 'text-white' : 'text-gray-900'
                    }`}>
                      {plan.name}
                    </h3>

                    <div className={`text-3xl lg:text-4xl font-extrabold mb-1 font-accent ${
                      plan.popular ? 'text-white' : 'text-gray-900'
                    }`}>
                      ${(billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice).toFixed(2)}
                      <span className={`text-base lg:text-lg font-sans font-medium ${
                        plan.popular ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {plan.monthlyPrice > 0 ? '/month' : ''}
                      </span>
                    </div>

                    {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                      <p className={`text-xs ${plan.popular ? 'text-purple-200' : 'text-gray-500'}`}>
                        Billed as ${(plan.yearlyPrice * 12).toFixed(2)}/year
                      </p>
                    )}

                    <p className={`text-sm mt-1 ${
                      plan.popular ? 'text-purple-100' : 'text-gray-500'
                    }`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="relative space-y-2 mb-4 flex-grow">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.checkBg}`}>
                          <Check className={`w-3 h-3 ${plan.checkColor}`} />
                        </div>
                        <span className={`text-sm ${
                          plan.popular ? 'text-white' : 'text-gray-700'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="relative mt-auto">
                    <button
                      onClick={plan.buttonAction}
                      disabled={subscriptionLoading || plan.current}
                      className={`w-full py-2.5 lg:py-3 rounded-full font-bold text-sm lg:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        plan.popular
                          ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-purple-900 shadow-gold hover:shadow-gold-lg btn-glow animate-glow-pulse'
                          : plan.id === 'basic'
                            ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 shadow-md hover:shadow-purple-lg btn-purple-glow'
                            : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md btn-purple-glow'
                      }`}
                    >
                      {subscriptionLoading ? 'Processing...' : plan.buttonText}
                    </button>

                    {plan.id === 'pro' && !plan.current && (
                      <p className={`text-center mt-2 text-xs ${
                        plan.popular ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        Cancel anytime
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-14 text-center" ref={ctaRef}>
            <div className="relative rounded-2xl overflow-hidden">
              {/* Multi-layer background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800"></div>
              <div className="absolute inset-0 mesh-gradient opacity-30"></div>
              <div className="absolute inset-0 pattern-grid opacity-20 pointer-events-none"></div>

              <FloatingParticles />

              <div className="relative p-8 lg:p-12 text-white">
                <h2 className="text-fluid-2xl font-extrabold mb-4 scroll-fade">
                  Ready to Start Your Journey?
                </h2>
                <p className="text-base text-purple-100 mb-6 max-w-2xl mx-auto scroll-fade delay-1">
                  Join thousands of creators who are building successful affiliate businesses with AlleyLink.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center scroll-fade delay-2">
                  <Link
                    to={user ? "/dashboard" : "/signup"}
                    className="group bg-gradient-to-r from-gold-400 to-gold-500 text-purple-900 px-8 py-3 rounded-full font-bold text-base transition-all shadow-gold hover:shadow-gold-lg inline-flex items-center justify-center space-x-2 btn-glow"
                  >
                    <span>{user ? "Go to Dashboard" : "Start Free Today"}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    to="/"
                    className="border-2 border-white/50 text-white px-8 py-3 rounded-full font-bold text-base hover:bg-white hover:text-purple-700 transition-all inline-flex items-center justify-center space-x-2"
                  >
                    <span>Learn More</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
