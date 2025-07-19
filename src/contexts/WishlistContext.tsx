import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiService } from '../lib/api'
import { useAuth } from './AuthContext'

interface WishlistItem {
  id: string
  product_id: string
  product: {
    id: string
    name: string
    price: number
    sale_price?: number
    images: string[]
    stock_quantity: number
  }
  created_at: string
}

interface WishlistContextType {
  items: WishlistItem[]
  loading: boolean
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  getTotalItems: () => number
}

const WishlistContext = createContext<WishlistContextType>({} as WishlistContextType)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchWishlistItems()
    } else {
      setItems([])
    }
  }, [user])

  const fetchWishlistItems = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await apiService.getWishlist()
      if (response.success) {
        setItems(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching wishlist items:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (productId: string) => {
    if (!user) throw new Error('Must be logged in to add to wishlist')

    try {
      const response = await apiService.addToWishlist(productId)
      if (response.success) {
        await fetchWishlistItems()
      } else {
        throw new Error(response.message || 'Failed to add to wishlist')
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await apiService.removeFromWishlist(productId)
      if (response.success) {
        await fetchWishlistItems()
      } else {
        throw new Error(response.message || 'Failed to remove from wishlist')
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const isInWishlist = (productId: string) => {
    return items.some(item => item.product_id === productId)
  }

  const getTotalItems = () => {
    return items.length
  }

  const value = {
    items,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getTotalItems,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}