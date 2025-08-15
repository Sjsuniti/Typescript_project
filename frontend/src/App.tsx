import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '@store/authStore'
import Layout from '@components/Layout'
import ProtectedRoute from '@components/ProtectedRoute'
import PublicRoute from '@components/PublicRoute'

// Public Pages
import LandingPage from '@pages/LandingPage'
import LoginPage from '@pages/LoginPage'
import RegisterPage from '@pages/RegisterPage'

// Protected Pages
import DashboardPage from '@pages/DashboardPage'
import CanvasPage from '@pages/CanvasPage'
import NotesPage from '@pages/NotesPage'
import ProfilePage from '@pages/ProfilePage'
import SettingsPage from '@pages/SettingsPage'

function App() {
  const { checkAuth, isAuthenticated, isLoading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-secondary-700">Loading MindCanvas...</h2>
          <p className="text-secondary-500 mt-2">Preparing your knowledge workspace</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="canvas/:id?" element={<CanvasPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch all route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
              <h2 className="text-2xl font-semibold text-secondary-700 mb-4">Page Not Found</h2>
              <p className="text-secondary-500 mb-8">The page you're looking for doesn't exist.</p>
              <a
                href="/"
                className="btn-primary btn-lg"
              >
                Go Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  )
}

export default App
