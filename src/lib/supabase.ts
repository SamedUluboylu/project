import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'customer' | 'seller'
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: 'admin' | 'customer' | 'seller'
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'customer' | 'seller'
          avatar_url?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description?: string
          image_url?: string
          parent_id?: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          image_url?: string
          parent_id?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string
          image_url?: string
          parent_id?: string
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url?: string
          description?: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          logo_url?: string
          description?: string
        }
        Update: {
          name?: string
          slug?: string
          logo_url?: string
          description?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          price: number
          sale_price?: number
          sku: string
          stock_quantity: number
          category_id: string
          brand_id?: string
          images: string[]
          features: Record<string, any>
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          price: number
          sale_price?: number
          sku: string
          stock_quantity: number
          category_id: string
          brand_id?: string
          images?: string[]
          features?: Record<string, any>
          is_active?: boolean
        }
        Update: {
          name?: string
          slug?: string
          description?: string
          price?: number
          sale_price?: number
          sku?: string
          stock_quantity?: number
          category_id?: string
          brand_id?: string
          images?: string[]
          features?: Record<string, any>
          is_active?: boolean
          updated_at?: string
        }
      }
      cart_items: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
        }
        Update: {
          quantity?: number
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          total_amount: number
          status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: Record<string, any>
          payment_method: string
          payment_status: 'pending' | 'completed' | 'failed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_amount: number
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          shipping_address: Record<string, any>
          payment_method: string
          payment_status?: 'pending' | 'completed' | 'failed'
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'completed' | 'failed'
          updated_at?: string
        }
      }
    }
  }
}