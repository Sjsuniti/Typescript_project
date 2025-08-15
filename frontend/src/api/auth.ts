import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mindcanvas-auth')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`
        }
      } catch (error) {
        console.error('Error parsing auth token:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear local storage
      localStorage.removeItem('mindcanvas-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface ProfileData {
  firstName?: string
  lastName?: string
  avatar?: string
}

export const authAPI = {
  // Login user
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  // Register user
  register: (userData: RegisterData) =>
    api.post('/auth/register', userData),

  // Get user profile
  getProfile: () =>
    api.get('/auth/profile'),

  // Update user profile
  updateProfile: (profileData: ProfileData) =>
    api.put('/auth/profile', profileData),

  // Change password
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),

  // Refresh token
  refreshToken: () =>
    api.post('/auth/refresh'),
}

export default api
