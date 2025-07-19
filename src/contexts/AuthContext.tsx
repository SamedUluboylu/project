import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiService } from '../lib/api'

interface User {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'customer' | 'seller'
  phone?: string
  avatarUrl?: string
  emailVerified: boolean
  isActive: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        const response = await apiService.getProfile()
        if (response.success) {
          setUser(response.data)
        } else {
          localStorage.removeItem('auth_token')
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      localStorage.removeItem('auth_token')
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      const response = await apiService.register({
        email,
        password,
        fullName,
        phone,
      })
      
      if (!response.success) {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password)
      
      if (response.success) {
        setUser(response.data.user)
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem('auth_token')
      setUser(null)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const response = await apiService.forgotPassword(email)
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed')
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await apiService.changePassword(currentPassword, newPassword)
      if (!response.success) {
        throw new Error(response.message || 'Password change failed')
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await apiService.updateProfile(userData)
      if (response.success) {
        setUser(response.data)
      } else {
        throw new Error(response.message || 'Profile update failed')
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const verifyEmail = async (token: string) => {
    try {
      const response = await apiService.verifyEmail(token)
      if (response.success) {
        await checkAuthStatus()
      } else {
        throw new Error(response.message || 'Email verification failed')
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    changePassword,
    updateProfile,
    verifyEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

        email,
        password,
      })

      if (error) throw error
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}