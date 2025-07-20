import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Eye, Truck, CheckCircle, Clock, X } from 'lucide-react'
import { apiService } from '../lib/api'

interface Order {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  itemCount: number
  createdAt: string
  items: {
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }[]
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await apiService.getOrders()
      if (response.success) {
        setOrders(response.data)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Bekliyor
          </span>
        )
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Onaylandı
          </span>
        )
      case 'shipped':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            <Truck className="w-3 h-3 mr-1" />
            Kargoda
          </span>
        )
      case 'delivered':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Package className="w-3 h-3 mr-1" />
            Teslim Edildi
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="w-3 h-3 mr-1" />
            İptal Edildi
          </span>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Henüz siparişiniz yok</h2>
          <p className="text-gray-600 mb-8">
            İlk siparişinizi vermek için ürünleri inceleyin.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Alışverişe Başla
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Siparişlerim ({orders.length} sipariş)
            </h1>
          </div>

          <div className="divide-y divide-gray-200">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Sipariş #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('tr-TR')} • {order.itemCount} ürün
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    {getStatusBadge(order.status)}
                    <span className="text-lg font-semibold text-gray-900">
                      ₺{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {order.items.slice(0, 4).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img
                        src={item.image || 'https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} adet
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      +{order.items.length - 4} ürün daha
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Detayları Gör
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Orders