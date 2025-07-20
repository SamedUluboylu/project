import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiService } from '../lib/api'
import { useAuth } from './AuthContext'

interface CartItem {
  id: string
  product_id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    sale_price?: number
    images: string[]
    stock_quantity: number
  }
}

interface CartContextType {
  items: CartItem[]
  loading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType>({} as CartContextType)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchCartItems()
    } else {
      setItems([])
    }
  }, [user])

  const fetchCartItems = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await apiService.getCart()
      if (response.success) {
        setItems(response.data || [])
      }
    } catch (error) {
      console.error('Error fetching cart items:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (productId: string, quantity = 1) => {
    if (!user) throw new Error('Must be logged in to add to cart')

    try {
      // Check if item already exists in cart
      const existingItem = items.find(item => item.product_id === productId)

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.quantity + quantity)
      } else {
        const response = await apiService.addToCart(productId, quantity)
        if (!response.success) throw new Error(response.message)
        await fetchCartItems()
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(itemId)
        return
      }

      const response = await apiService.updateCartItem(itemId, quantity)
      if (!response.success) throw new Error(response.message)
      await fetchCartItems()
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      const response = await apiService.removeFromCart(itemId)
      if (!response.success) throw new Error(response.message)
      await fetchCartItems()
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const clearCart = async () => {
    if (!user) return

    try {
      const response = await apiService.clearCart()
      if (!response.success) throw new Error(response.message)
      setItems([])
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = item.product.sale_price || item.product.price
      return total + price * item.quantity
    }, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    items,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}