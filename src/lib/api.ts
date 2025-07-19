// API service for .NET Core backend integration with JWT

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001/api'

interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add JWT token if available
    const token = this.getAuthToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (response.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
        throw new Error('Unauthorized')
      }
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }
      
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    if (response.success && response.data.token) {
      localStorage.setItem('auth_token', response.data.token)
    }
    
    return response
  }

  async register(userData: {
    email: string
    password: string
    fullName: string
    phone?: string
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    })
  }

  async forgotPassword(email: string) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token: string, password: string) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    })
  }

  async verifyEmail(token: string) {
    return this.request('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token }),
    })
  }

  // User profile
  async getProfile() {
    return this.request('/user/profile')
  }

  async updateProfile(userData: any) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/user/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number
    limit?: number
    category?: string
    brand?: string
    minPrice?: number
    maxPrice?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : ''
    return this.request(`/products${queryString}`)
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`)
  }

  async getFeaturedProducts() {
    return this.request('/products/featured')
  }

  async getProductsByCategory(categoryId: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ''
    return this.request(`/products/category/${categoryId}${queryString}`)
  }

  async searchProducts(query: string, params?: any) {
    const queryString = params ? `&${new URLSearchParams(params)}` : ''
    return this.request(`/products/search?q=${encodeURIComponent(query)}${queryString}`)
  }

  // Admin Product Management
  async createProduct(productData: any) {
    return this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(id: string) {
    return this.request(`/admin/products/${id}`, {
      method: 'DELETE',
    })
  }

  async updateProductStock(id: string, quantity: number) {
    return this.request(`/admin/products/${id}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  }

  // Category endpoints
  async getCategories() {
    return this.request('/categories')
  }

  async getCategory(id: string) {
    return this.request(`/categories/${id}`)
  }

  async createCategory(categoryData: {
    name: string
    slug: string
    description?: string
    parentId?: string
    imageUrl?: string
  }) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    })
  }

  async updateCategory(id: string, categoryData: any) {
    return this.request(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    })
  }

  async deleteCategory(id: string) {
    return this.request(`/admin/categories/${id}`, {
      method: 'DELETE',
    })
  }

  // Brand endpoints
  async getBrands() {
    return this.request('/brands')
  }

  async createBrand(brandData: {
    name: string
    slug: string
    description?: string
    logoUrl?: string
  }) {
    return this.request('/admin/brands', {
      method: 'POST',
      body: JSON.stringify(brandData),
    })
  }

  async updateBrand(id: string, brandData: any) {
    return this.request(`/admin/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(brandData),
    })
  }

  async deleteBrand(id: string) {
    return this.request(`/admin/brands/${id}`, {
      method: 'DELETE',
    })
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart')
  }

  async addToCart(productId: string, quantity: number, variantId?: string) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, variantId }),
    })
  }

  async updateCartItem(itemId: string, quantity: number) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    })
  }

  async removeFromCart(itemId: string) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'DELETE',
    })
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'DELETE',
    })
  }

  // Wishlist endpoints
  async getWishlist() {
    return this.request('/wishlist')
  }

  async addToWishlist(productId: string) {
    return this.request('/wishlist/items', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    })
  }

  async removeFromWishlist(productId: string) {
    return this.request(`/wishlist/items/${productId}`, {
      method: 'DELETE',
    })
  }

  // Order endpoints
  async getOrders(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ''
    return this.request(`/orders${queryString}`)
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`)
  }

  async createOrder(orderData: {
    items: Array<{ productId: string; quantity: number; variantId?: string }>
    shippingAddress: any
    billingAddress?: any
    paymentMethod: string
    couponCode?: string
  }) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    })
  }

  async cancelOrder(id: string, reason?: string) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  async trackOrder(trackingNumber: string) {
    return this.request(`/orders/track/${trackingNumber}`)
  }

  // Admin Order Management
  async updateOrderStatus(id: string, status: string, notes?: string) {
    return this.request(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    })
  }

  async assignTrackingNumber(id: string, trackingNumber: string, carrier: string) {
    return this.request(`/admin/orders/${id}/tracking`, {
      method: 'PUT',
      body: JSON.stringify({ trackingNumber, carrier }),
    })
  }

  // Address endpoints
  async getAddresses() {
    return this.request('/user/addresses')
  }

  async createAddress(addressData: any) {
    return this.request('/user/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    })
  }

  async updateAddress(id: string, addressData: any) {
    return this.request(`/user/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    })
  }

  async deleteAddress(id: string) {
    return this.request(`/user/addresses/${id}`, {
      method: 'DELETE',
    })
  }

  // Payment endpoints
  async createPayment(paymentData: {
    orderId: string
    amount: number
    paymentMethod: string
    cardToken?: string
  }) {
    return this.request('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    })
  }

  async verifyPayment(paymentId: string) {
    return this.request(`/payments/${paymentId}/verify`, {
      method: 'POST',
    })
  }

  // Review endpoints
  async getProductReviews(productId: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ''
    return this.request(`/products/${productId}/reviews${queryString}`)
  }

  async createReview(productId: string, reviewData: {
    rating: number
    comment: string
    orderId: string
  }) {
    return this.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    })
  }

  async updateReview(reviewId: string, reviewData: any) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    })
  }

  async deleteReview(reviewId: string) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'DELETE',
    })
  }

  // Coupon endpoints
  async validateCoupon(code: string, cartTotal: number) {
    return this.request('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, cartTotal }),
    })
  }

  // Admin Coupon Management
  async getCoupons() {
    return this.request('/admin/coupons')
  }

  async createCoupon(couponData: any) {
    return this.request('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    })
  }

  async updateCoupon(id: string, couponData: any) {
    return this.request(`/admin/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(couponData),
    })
  }

  async deleteCoupon(id: string) {
    return this.request(`/admin/coupons/${id}`, {
      method: 'DELETE',
    })
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/dashboard/stats')
  }

  async getAdminReports(type: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ''
    return this.request(`/admin/reports/${type}${queryString}`)
  }

  async getUsers(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ''
    return this.request(`/admin/users${queryString}`)
  }

  async updateUserRole(userId: string, role: string) {
    return this.request(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    })
  }

  async banUser(userId: string, reason?: string) {
    return this.request(`/admin/users/${userId}/ban`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  async unbanUser(userId: string) {
    return this.request(`/admin/users/${userId}/unban`, {
      method: 'POST',
    })
  }

  // Notification endpoints
  async getNotifications() {
    return this.request('/notifications')
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    })
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    })
  }

  // File upload
  async uploadFile(file: File, type: 'product' | 'category' | 'brand' | 'user') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const token = this.getAuthToken()
    const headers: any = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    })

    return response.json()
  }

  // Settings
  async getSettings() {
    return this.request('/admin/settings')
  }

  async updateSettings(settings: any) {
    return this.request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }
}

export const apiService = new ApiService()
export default apiService