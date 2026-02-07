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
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-fluid-lg font-semibold text-gray-900 flex items-center">
          <Crown className="w-4 h-4 mr-1.5 text-blue-600" />
          Subscription
        </h3>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-2.5">
        {/* Current Plan Info */}
        <div className="border border-gray-200 rounded-lg p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-sm font-medium text-gray-900">Current Plan</h4>
            <span className="text-base font-bold text-gray-900">
              {isPro ? '$4.99' : isBasic ? '$2.99' : 'Free'}
              {(isPro || isBasic) && <span className="text-xs font-normal text-gray-600">/month</span>}
            </span>
          </div>

          <div className="space-y-1 text-xs text-gray-600">
            {isPro ? (
              <>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                  Unlimited products
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                  Advanced analytics & insights
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                  Custom branding & colors
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                  Priority support
                </div>
              </>
            ) : isBasic ? (
              <>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                  Up to 100 products
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                  Custom branding & colors
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                  Email support
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                  No advanced analytics
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                  Up to 3 products
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                  Basic customization
                </div>
                <div className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                  Community support
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-1.5">
          {isPro && isSubscribed && !profile.is_admin && (
            <button
              onClick={() => openCustomerPortal()}
              disabled={loading}
              className="flex items-center justify-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard className="w-3.5 h-3.5 mr-1.5" />
              {loading ? 'Loading...' : 'Manage Subscription'}
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </button>
          )}

          {!isPro && (
            <a
              href="/pricing"
              className="flex items-center justify-center px-3 py-1.5 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              <Crown className="w-3.5 h-3.5 mr-1.5" />
              Upgrade to Pro
            </a>
          )}

          {profile.is_admin && (
            <div className="flex items-center px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Crown className="w-3.5 h-3.5 mr-1.5 text-yellow-600" />
              <span className="text-yellow-800 text-xs font-medium">
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
