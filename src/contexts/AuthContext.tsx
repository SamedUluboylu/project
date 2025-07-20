import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiService } from '../lib/api'

interface User {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'customer' | 'seller'
  isEmailVerified: boolean
}

interface AuthContextType {
  user: User | null
  userProfile: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
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

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiService.login(email, password)
      if (response.success) {
        setUser(response.data.user)
      } else {
        throw new Error(response.message || 'Giriş başarısız')
      }
    } catch (error: any) {
      throw new Error(error.message || 'Giriş sırasında bir hata oluştu')
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await apiService.register({
        email,
        password,
        fullName,
      })
      if (response.success) {
        // Auto login after registration
        await signIn(email, password)
      } else {
        throw new Error(response.message || 'Kayıt başarısız')
      }
    } catch (error: any) {
      throw new Error(error.message || 'Kayıt sırasında bir hata oluştu')
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem('auth_token')
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const response = await apiService.forgotPassword(email)
      if (!response.success) {
        throw new Error(response.message || 'Şifre sıfırlama başarısız')
      }
    } catch (error: any) {
      throw new Error(error.message || 'Şifre sıfırlama sırasında bir hata oluştu')
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await apiService.updateProfile(data)
      if (response.success) {
        setUser(prev => prev ? { ...prev, ...data } : null)
      } else {
        throw new Error(response.message || 'Profil güncelleme başarısız')
      }
    } catch (error: any) {
      throw new Error(error.message || 'Profil güncelleme sırasında bir hata oluştu')
    }
  }

  const value = {
    user,
    userProfile: user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}