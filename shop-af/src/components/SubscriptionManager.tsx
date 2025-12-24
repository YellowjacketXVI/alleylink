import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useSubscription } from '../hooks/useSubscription'
import { Crown, CreditCard, Calendar, ExternalLink, AlertCircle } from 'lucide-react'

export default function SubscriptionManager() {
  const { profile } = useAuth()
  const { openCustomerPortal, isPro, isSubscribed, loading, error } = useSubscription()

  if (!profile) return null

  const isBasic = profile?.plan_type === 'basic'

  const getStatusColor = () => {
    if (isPro) return 'text-green-600 bg-green-100'
    if (isBasic) return 'text-blue-600 bg-blue-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getStatusText = () => {
    if (profile.is_admin) return 'Admin Access'
    if (isPro) return 'Pro Plan Active'
    if (isBasic) return 'Basic Plan Active'
    return 'Free Trial'
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Crown className="w-5 h-5 mr-2 text-blue-600" />
          Subscription
        </h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Current Plan Info */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Current Plan</h4>
            <span className="text-2xl font-bold text-gray-900">
              {isPro ? '$4.99' : isBasic ? '$2.99' : 'Free'}
              {(isPro || isBasic) && <span className="text-sm font-normal text-gray-600">/month</span>}
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            {isPro ? (
              <>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Unlimited products
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Advanced analytics & insights
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Custom branding & colors
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Priority support
                </div>
              </>
            ) : isBasic ? (
              <>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Up to 100 products
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Custom branding & colors
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Email support
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  No advanced analytics
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Up to 3 products
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Basic customization
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  Community support
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {isPro && isSubscribed && !profile.is_admin && (
            <button
              onClick={() => openCustomerPortal()}
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              {loading ? 'Loading...' : 'Manage Subscription'}
              <ExternalLink className="w-4 h-4 ml-2" />
            </button>
          )}

          {!isPro && (
            <a
              href="/pricing"
              className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Pro
            </a>
          )}

          {profile.is_admin && (
            <div className="flex items-center px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Crown className="w-4 h-4 mr-2 text-yellow-600" />
              <span className="text-yellow-800 text-sm font-medium">
                Admin account with full access
              </span>
            </div>
          )}
        </div>

        {/* Billing Info */}
        {isPro && !profile.is_admin && (
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Billing managed through Stripe</span>
            </div>
            <p>
              Use "Manage Subscription" to update payment methods, view invoices, or cancel your subscription.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
