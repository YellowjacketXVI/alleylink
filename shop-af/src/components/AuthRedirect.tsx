import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageLoadingSpinner } from './LoadingSpinner'

interface AuthRedirectProps {
  children: ReactNode
  redirectTo?: string
}

export default function AuthRedirect({ children, redirectTo = '/dashboard' }: AuthRedirectProps) {
  const { user, loading } = useAuth()

  // Show loading while checking auth status
  if (loading) {
    return <PageLoadingSpinner />
  }

  // If user is authenticated, redirect them away from auth pages
  if (user) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}