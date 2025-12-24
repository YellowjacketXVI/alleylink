import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

type UserRole = 'user' | 'admin'

interface ProtectedRouteProps {
  children: ReactNode
  adminOnly?: boolean
  requiredRole?: UserRole
  requiresSubscription?: boolean
}

export default function ProtectedRoute({ 
  children, 
  adminOnly = false, 
  requiredRole,
  requiresSubscription = false 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()

  // Show loading while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Wait for profile to load for role-based checks
  if ((adminOnly || requiredRole || requiresSubscription) && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Check admin access (legacy support)
  if (adminOnly && !profile?.is_admin) {
    return <Navigate to="/dashboard" replace />
  }

  // Check role-based access
  if (requiredRole === 'admin' && !profile?.is_admin) {
    return <Navigate to="/dashboard" replace />
  }

  // Check subscription requirement
  if (requiresSubscription && profile?.subscription_status !== 'active') {
    return <Navigate to="/pricing" replace />
  }

  return <>{children}</>
}