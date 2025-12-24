import { createContext, useContext, useState, ReactNode } from 'react'

interface ErrorState {
  message: string
  type: 'network' | 'auth' | 'validation' | 'general'
  timestamp: number
}

interface ErrorContextType {
  error: ErrorState | null
  setError: (error: ErrorState | null) => void
  clearError: () => void
  showError: (message: string, type?: ErrorState['type']) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function useError() {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider')
  }
  return context
}

interface ErrorProviderProps {
  children: ReactNode
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [error, setError] = useState<ErrorState | null>(null)

  const clearError = () => setError(null)

  const showError = (message: string, type: ErrorState['type'] = 'general') => {
    setError({
      message,
      type,
      timestamp: Date.now()
    })

    // Auto-clear error after 5 seconds
    setTimeout(() => {
      setError(current => 
        current?.timestamp === Date.now() ? null : current
      )
    }, 5000)
  }

  return (
    <ErrorContext.Provider value={{ error, setError, clearError, showError }}>
      {children}
      {error && <ErrorToast error={error} onClose={clearError} />}
    </ErrorContext.Provider>
  )
}

interface ErrorToastProps {
  error: ErrorState
  onClose: () => void
}

function ErrorToast({ error, onClose }: ErrorToastProps) {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return '🌐'
      case 'auth':
        return '🔒'
      case 'validation':
        return '⚠️'
      default:
        return '❌'
    }
  }

  const getErrorColor = () => {
    switch (error.type) {
      case 'network':
        return 'bg-orange-500'
      case 'auth':
        return 'bg-red-500'
      case 'validation':
        return 'bg-yellow-500'
      default:
        return 'bg-red-500'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={`${getErrorColor()} text-white p-4 rounded-lg shadow-lg flex items-start space-x-3`}>
        <span className="text-lg flex-shrink-0">{getErrorIcon()}</span>
        <div className="flex-1">
          <p className="font-medium">Error</p>
          <p className="text-sm opacity-90">{error.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}