import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authAPI } from '@api/auth'

export interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  avatar?: string
  lastLogin?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  updateProfile: (profileData: Partial<User>) => Promise<void>
  clearError: () => void
}

export interface RegisterData {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authAPI.login(email, password)
          const { user, token } = response.data
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error?.message || 'Login failed'
          })
          throw error
        }
      },

      register: async (userData: RegisterData) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authAPI.register(userData)
          const { user, token } = response.data
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error?.message || 'Registration failed'
          })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        })
      },

      checkAuth: async () => {
        const { token } = get()
        
        if (!token) {
          set({ isAuthenticated: false, isLoading: false })
          return
        }

        try {
          set({ isLoading: true })
          
          const response = await authAPI.getProfile()
          const { user } = response.data
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error: any) {
          // Token is invalid, clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          })
        }
      },

      updateProfile: async (profileData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null })
          
          const response = await authAPI.updateProfile(profileData)
          const { user } = response.data
          
          set({
            user,
            isLoading: false,
            error: null
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error?.message || 'Profile update failed'
          })
          throw error
        }
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'mindcanvas-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
