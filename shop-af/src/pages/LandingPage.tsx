import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Users, TrendingUp, Star, Check, Zap, Link as LinkIcon, Plus, Share2, Mail, Twitter, Instagram, Youtube } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'

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
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
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

export default function LandingPage() {
  const { user } = useAuth()
  const { createSubscription, isPro, loading: subscriptionLoading } = useSubscription()
  const [footerImageError, setFooterImageError] = useState(false)

  const howRef = useScrollFade()
  const featuresRef = useScrollFade()
  const pricingRef = useScrollFade()
  const ctaRef = useScrollFade()

  const handleUpgrade = async () => {
    if (!user) {
      window.location.href = '/signup'
      return
    }
    const checkoutUrl = await createSubscription('pro')
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }

  const monthlyPrice = 4.99

  return (
    <div className="min-h-screen font-sans">
      {/* ═══ Hero Section — Mesh Gradient + Particles ═══ */}
      <div className="relative overflow-hidden">
        {/* Multi-layer background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-purple-800 to-purple-950"></div>
        <div className="absolute inset-0 mesh-gradient opacity-60"></div>
        <div className="absolute inset-0 pattern-dots opacity-30"></div>

        {/* Decorative radial blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>

        {/* Floating particles */}
        <FloatingParticles />

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-transparent to-purple-950/50"></div>

        <Navbar transparent />

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="inline-block glass-dark rounded-full px-5 py-2 mb-6 animate-fade-in">
              <span className="text-gold-300 font-accent text-sm tracking-wider uppercase">Affiliate Marketing Made Simple</span>
            </div>

            <h1 className="text-fluid-3xl font-extrabold text-white mb-6 leading-tight animate-fade-in-up">
              Get Your Link.
              <br />
              <span className="text-gold-shimmer">
                Add Products.
              </span>
              <br />
              Start Earning.
            </h1>

            <p className="text-fluid-base text-purple-100 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Create your personalized storefront in minutes. No coding, no complexity —
              just a simple way to share products and earn affiliate commissions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to={user ? "/dashboard" : "/signup"}
                className="group bg-gradient-to-r from-gold-400 to-gold-500 text-purple-900 px-8 py-3.5 rounded-full font-bold text-base transition-all shadow-gold hover:shadow-gold-lg flex items-center space-x-2 btn-glow"
              >
                <span>{user ? "Go to Dashboard" : "Get Your Free Link"}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="text-purple-200 text-sm font-medium">
                Free forever &bull; No credit card required
              </div>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-purple-100">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-gold-400" />
                <span>1,000+ creators earning</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-gold-400" />
                <span>Growing fast</span>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                ))}
                <span className="ml-1">Loved by users</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ How It Works ═══ */}
      <div className="relative py-16 bg-gradient-to-b from-white to-purple-50/50 overflow-hidden" ref={howRef}>
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gold-100/40 rounded-full blur-3xl"></div>

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 scroll-fade">
            <h2 className="text-fluid-2xl font-extrabold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Start earning in 3 simple steps. No technical skills required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="text-center group scroll-fade delay-1">
              <div className="perspective-1000">
                <div className="relative mb-6 preserve-3d">
                  <div className="w-18 h-18 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all shadow-purple animate-float" style={{ animationDelay: '0s', width: '4.5rem', height: '4.5rem' }}>
                    <LinkIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-gold" style={{ right: 'calc(50% - 3.5rem)' }}>
                    1
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Get Your Link</h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up for free and get your personalized AlleyLink URL instantly.
                No setup fees, no waiting.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group scroll-fade delay-2">
              <div className="perspective-1000">
                <div className="relative mb-6 preserve-3d">
                  <div className="w-18 h-18 bg-gradient-to-br from-gold-500 to-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all shadow-gold animate-float" style={{ animationDelay: '0.5s', width: '4.5rem', height: '4.5rem' }}>
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-gold" style={{ right: 'calc(50% - 3.5rem)' }}>
                    2
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Add Products</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload product images, add descriptions, and paste your affiliate links.
                Our simple interface makes it effortless.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group scroll-fade delay-3">
              <div className="perspective-1000">
                <div className="relative mb-6 preserve-3d">
                  <div className="w-18 h-18 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all shadow-purple animate-float" style={{ animationDelay: '1s', width: '4.5rem', height: '4.5rem' }}>
                    <Share2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-gold" style={{ right: 'calc(50% - 3.5rem)' }}>
                    3
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Share &amp; Earn</h3>
              <p className="text-gray-600 leading-relaxed">
                Share your beautiful storefront on social media, with friends, or anywhere online.
                Start earning commissions immediately.
              </p>
            </div>
          </div>

          {/* ─── Features Grid ─── */}
          <div ref={featuresRef}>
            <div className="text-center mb-10 scroll-fade">
              <h3 className="text-fluid-xl font-extrabold text-gray-900 mb-4">
                Everything You Need to
                <span className="text-gradient-purple"> Succeed</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: ShoppingBag,
                  title: 'Beautiful Storefronts',
                  desc: 'Create stunning, mobile-optimized profile pages with custom fonts, colors, and backgrounds that reflect your brand.',
                  gradient: 'from-purple-600 to-purple-800',
                  bg: 'from-purple-50 to-gold-50',
                },
                {
                  icon: Zap,
                  title: 'Drag & Drop Simple',
                  desc: 'Add products in seconds with our intuitive interface. Upload images, organize with categories, and manage everything effortlessly.',
                  gradient: 'from-gold-500 to-gold-600',
                  bg: 'from-gold-50 to-gold-100/50',
                },
                {
                  icon: TrendingUp,
                  title: 'Track Your Success',
                  desc: 'Monitor clicks, track performance, and see which products are earning you the most with detailed analytics.',
                  gradient: 'from-purple-500 to-purple-700',
                  bg: 'from-purple-50 to-purple-100/50',
                },
              ].map((feat, i) => (
                <div
                  key={feat.title}
                  className={`bg-gradient-to-br ${feat.bg} rounded-2xl p-6 card-lift border border-white/60 scroll-fade delay-${i + 1}`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${feat.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                    <feat.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Pricing Preview ═══ */}
      <div className="relative py-16 bg-gradient-to-br from-gray-50 via-white to-purple-50 overflow-hidden" ref={pricingRef}>
        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-gold-200/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 scroll-fade">
            <h2 className="text-fluid-2xl font-extrabold text-gray-900 mb-4">
              Simple, Transparent <span className="text-gradient-purple">Pricing</span>
            </h2>
            <p className="text-base text-gray-600 mb-6">
              Start free, upgrade when you're ready to scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Trial Card */}
            <div className="glass rounded-2xl p-6 shadow-md border border-white/60 card-lift scroll-fade delay-1">
              <div className="text-center mb-5">
                <h3 className="text-lg font-extrabold text-gray-900 mb-1">Free Trial</h3>
                <div className="text-3xl font-extrabold text-gray-900 mb-2 font-accent">
                  $0<span className="text-sm text-gray-500 font-sans font-medium">/month</span>
                </div>
                <p className="text-gray-500 text-sm">Try AlleyLink with limited features</p>
              </div>

              <ul className="space-y-2.5 mb-6">
                {['Up to 3 products', 'Personal storefront', 'Basic customization', 'Community support'].map((f) => (
                  <li key={f} className="flex items-center space-x-2.5">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-purple-700" />
                    </div>
                    <span className="text-gray-700 text-sm">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className="w-full bg-gray-900 text-white py-2.5 px-4 rounded-full font-bold hover:bg-gray-800 transition-all text-center block text-sm btn-purple-glow"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro Plan Card — Enhanced */}
            <div className="relative scroll-fade delay-2">
              {/* Gradient border glow */}
              <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-purple-500 via-gold-400 to-purple-600 opacity-80 blur-[1px]"></div>

              <div className="relative bg-gradient-to-br from-purple-700 via-purple-800 to-purple-950 rounded-2xl p-6 shadow-xl overflow-hidden">
                {/* Pattern overlay */}
                <div className="absolute inset-0 pattern-dots opacity-20 pointer-events-none"></div>

                {/* Decorative glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-2xl"></div>

                {/* Animated "Recommended" badge */}
                <div className="absolute -top-0 left-1/2 animate-badge-bounce z-10">
                  <span className="bg-gradient-to-r from-gold-400 to-gold-500 text-purple-900 px-4 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-gold">
                    <Star className="w-3 h-3 fill-purple-900" />
                    <span>Recommended</span>
                  </span>
                </div>

                <div className="relative text-center mb-5 mt-4">
                  <h3 className="text-lg font-extrabold text-white mb-1">Pro Plan</h3>
                  <div className="text-3xl font-extrabold text-white mb-2 font-accent">
                    ${monthlyPrice.toFixed(2)}
                    <span className="text-sm text-purple-200 font-sans font-medium">/month</span>
                  </div>
                  <p className="text-purple-100 text-sm mt-1">For serious affiliate marketers</p>
                </div>

                <ul className="relative space-y-2.5 mb-6">
                  {['Unlimited products', 'Advanced analytics', 'Custom branding', 'Priority support'].map((f) => (
                    <li key={f} className="flex items-center space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-gold-300" />
                      </div>
                      <span className="text-white text-sm">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleUpgrade}
                  disabled={subscriptionLoading}
                  className="relative w-full bg-gradient-to-r from-gold-400 to-gold-500 text-purple-900 py-2.5 px-4 rounded-full font-bold transition-all text-sm shadow-gold hover:shadow-gold-lg transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none btn-glow animate-glow-pulse"
                >
                  {subscriptionLoading ? 'Loading...' : (isPro ? 'Current Plan' : 'Upgrade to Pro')}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              to="/pricing"
              className="text-purple-700 hover:text-purple-800 font-semibold text-base flex items-center justify-center space-x-2 group underline-animate"
            >
              <span>View detailed pricing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ CTA Section ═══ */}
      <div className="relative overflow-hidden" ref={ctaRef}>
        {/* Multi-layer background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800"></div>
        <div className="absolute inset-0 mesh-gradient opacity-40"></div>
        <div className="absolute inset-0 pattern-grid opacity-30 pointer-events-none"></div>

        {/* Floating particles */}
        <FloatingParticles />

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-fluid-2xl font-extrabold text-white mb-4 scroll-fade">
            Ready to Build Your Affiliate{' '}
            <span className="text-gold-shimmer">Empire</span>?
          </h2>
          <p className="text-base text-purple-100 mb-8 scroll-fade delay-1">
            Join thousands of creators who are already earning with AlleyLink.
          </p>

          <Link
            to={user ? "/dashboard" : "/signup"}
            className="group relative inline-flex items-center space-x-2 bg-gradient-to-r from-gold-400 to-gold-500 text-purple-900 px-10 py-4 rounded-full font-bold text-lg transition-all shadow-gold hover:shadow-gold-lg btn-glow scroll-fade delay-2"
          >
            <span>{user ? "Go to Dashboard" : "Get Started Now"}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Social proof stars */}
          <div className="mt-8 flex items-center justify-center space-x-1 scroll-fade delay-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
            ))}
            <span className="ml-2 text-purple-100 text-sm font-medium">Rated 4.9/5 by creators</span>
          </div>
        </div>
      </div>

      {/* ═══ Footer ═══ */}
      <footer className="relative bg-gradient-to-b from-gray-900 to-gray-950 text-white py-12 overflow-hidden">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 via-gold-400 to-purple-500"></div>

        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            {/* Brand + Newsletter — col-span-5 */}
            <div className="md:col-span-5">
              <div className="flex items-center space-x-3 mb-4">
                {!footerImageError ? (
                  <img
                    src="/sitetitle.png"
                    alt="AlleyLink"
                    className="h-8 w-auto brightness-0 invert"
                    onError={() => setFooterImageError(true)}
                  />
                ) : (
                  <>
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-gold-400 bg-clip-text text-transparent">
                      AlleyLink
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-400 mb-5 max-w-md text-sm leading-relaxed">
                The ultimate platform for affiliate marketers to create stunning
                storefronts and grow their business.
              </p>

              {/* Newsletter signup */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-300 mb-2">Stay in the loop</p>
                <form onSubmit={(e) => e.preventDefault()} className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-l-full px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2 rounded-r-full text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center space-x-1"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Join</span>
                  </button>
                </form>
              </div>

              {/* Social icons */}
              <div className="flex items-center space-x-3">
                {[
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Youtube, label: 'YouTube' },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors group"
                  >
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            {/* Sitemap columns — col-span-7 */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4 font-sans">Product</h4>
                <ul className="space-y-2.5 text-gray-400 text-sm">
                  <li><Link to="/pricing" className="hover:text-white transition-colors underline-animate">Pricing</Link></li>
                  <li><Link to="/help" className="hover:text-white transition-colors underline-animate">Help Center</Link></li>
                  <li><Link to="/dashboard" className="hover:text-white transition-colors underline-animate">Dashboard</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4 font-sans">Company</h4>
                <ul className="space-y-2.5 text-gray-400 text-sm">
                  <li><Link to="/terms" className="hover:text-white transition-colors underline-animate">Terms of Service</Link></li>
                  <li><a href="mailto:support@alleylink.com" className="hover:text-white transition-colors underline-animate">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider text-gray-300 mb-4 font-sans">Get Started</h4>
                <ul className="space-y-2.5 text-gray-400 text-sm">
                  <li><Link to="/signup" className="hover:text-white transition-colors underline-animate">Sign Up Free</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors underline-animate">Log In</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-sm">
            <p>&copy; 2025 AlleyLink. All rights reserved.</p>
            <p className="mt-2 sm:mt-0">Built for creators, by creators.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
