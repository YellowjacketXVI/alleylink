import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ErrorProvider } from './context/ErrorContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import AuthRedirect from './components/AuthRedirect'
import MetaProvider from './components/MetaProvider'
import { PageLoadingSpinner } from './components/LoadingSpinner'

// Lazy load pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const TestPage = lazy(() => import('./pages/TestPage'))
const CreateProfilePage = lazy(() => import('./pages/CreateProfilePage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

// Global styles
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <AuthProvider>
          <Router>
            <MetaProvider />
            <div className="App">
              <Suspense fallback={<PageLoadingSpinner />}>
                <div className="route-transition">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/test" element={<TestPage />} />

                    {/* Auth Routes - Redirect authenticated users */}
                    <Route
                      path="/signup"
                      element={
                        <AuthRedirect>
                          <SignUpPage />
                        </AuthRedirect>
                      }
                    />
                    <Route
                      path="/login"
                      element={
                        <AuthRedirect>
                          <LoginPage />
                        </AuthRedirect>
                      }
                    />

                    {/* Public Profile Routes */}
                    <Route path="/u/:username" element={<ProfilePage />} />

                    {/* Protected Routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/create-profile"
                      element={
                        <ProtectedRoute>
                          <CreateProfilePage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* 404 Page */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </div>
              </Suspense>
            </div>
          </Router>
        </AuthProvider>
      </ErrorProvider>
    </ErrorBoundary>
  )
}

export default App
