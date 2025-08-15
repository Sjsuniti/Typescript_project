import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@store/authStore'

interface PublicRouteProps {
  children: React.ReactNode
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-secondary-700">Loading...</h2>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    // Redirect to the intended destination or dashboard
    const from = location.state?.from?.pathname || '/app'
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}

export default PublicRoute
