import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

interface AdminStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  monthlyRevenue: number
  pendingOrders: number
  lowStockProducts: number
  newUsersToday: number
}

interface AdminContextType {
  stats: AdminStats | null
  loading: boolean
  refreshStats: () => Promise<void>
}

const AdminContext = createContext<AdminContextType>({} as AdminContextType)

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, userProfile } = useAuth()

  useEffect(() => {
    if (user && userProfile?.role === 'admin') {
      fetchStats()
    }
  }, [user, userProfile])

  const fetchStats = async () => {
    try {
      setLoading(true)
      // This would call your .NET Core API
      // const response = await fetch('/api/admin/stats')
      // const data = await response.json()
      
      // Mock data for now
      const mockStats: AdminStats = {
        totalUsers: 1250,
        totalProducts: 450,
        totalOrders: 890,
        totalRevenue: 125000,
        monthlyRevenue: 25000,
        pendingOrders: 15,
        lowStockProducts: 8,
        newUsersToday: 12
      }
      
      setStats(mockStats)
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshStats = async () => {
    await fetchStats()
  }

  const value = {
    stats,
    loading,
    refreshStats,
  }

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}