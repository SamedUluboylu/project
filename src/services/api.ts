// API service for .NET Core backend integration

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7001/api'

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(userData: any) {
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

  // Product endpoints
  async getProducts(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ''
    return this.request(`/products${queryString}`)
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`)
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    })
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    })
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    })
  }

  // Category endpoints
  async getCategories() {
    return this.request('/categories')
  }

  async createCategory(categoryData: any) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
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

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    })
  }

  // User endpoints
  async getUsers(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ''
    return this.request(`/users${queryString}`)
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart')
  }

  async addToCart(productId: string, quantity: number) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
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

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/stats')
  }

  async getAdminReports(type: string, params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : ''
    return this.request(`/admin/reports/${type}${queryString}`)
  }

  // Payment endpoints
  async createPayment(paymentData: any) {
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
}

export const apiService = new ApiService()
export default apiService