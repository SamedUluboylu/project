import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Package, Truck, CheckCircle, Clock, X, MapPin } from 'lucide-react'
import { apiService } from '../lib/api'

interface OrderDetail {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  subtotal: number
  shipping: number
  tax: number
  createdAt: string
  shippingAddress: {
    name: string
    address: string
    city: string
    district: string
    postalCode: string
    phone: string
  }
  items: {
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }[]
  trackingNumber?: string
  estimatedDelivery?: string
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchOrderDetail()
    }
  }, [id])

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      const response = await apiService.getOrder(id!)
      if (response.success) {
        setOrder(response.data)
      }
    } catch (error) {
      console.error('Error fetching order detail:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-2" />
            Bekliyor
          </span>
        )
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-4 h-4 mr-2" />
            Onaylandı
          </span>
        )
      case 'shipped':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <Truck className="w-4 h-4 mr-2" />
            Kargoda
          </span>
        )
      case 'delivered':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Package className="w-4 h-4 mr-2" />
            Teslim Edildi
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <X className="w-4 h-4 mr-2" />
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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sipariş bulunamadı</h2>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Siparişlere Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/orders')}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Sipariş #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                {new Date(order.createdAt).toLocaleDateString('tr-TR')}
              </p>
            </div>
            <div className="ml-auto">
              {getStatusBadge(order.status)}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Detayları</h2>
                
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.image || 'https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=100'}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ₺{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          ₺{item.price.toLocaleString()} / adet
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Info */}
              {order.trackingNumber && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Kargo Takibi</h2>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900">Takip Numarası</p>
                        <p className="text-blue-700">{order.trackingNumber}</p>
                      </div>
                      <Truck className="w-8 h-8 text-blue-600" />
                    </div>
                    {order.estimatedDelivery && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-sm text-blue-700">
                          Tahmini Teslimat: {new Date(order.estimatedDelivery).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary & Address */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span className="font-medium">₺{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kargo</span>
                    <span className="font-medium">
                      {order.shipping === 0 ? (
                        <span className="text-green-600">Ücretsiz</span>
                      ) : (
                        `₺${order.shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  {order.tax > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">KDV</span>
                      <span className="font-medium">₺{order.tax.toLocaleString()}</span>
                    </div>
                  )}
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Toplam</span>
                    <span>₺{order.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Teslimat Adresi
                </h2>
                
                <div className="text-gray-700">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="mt-1">{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.district}, {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.postalCode}</p>
                  <p className="mt-2 text-sm">
                    Tel: {order.shippingAddress.phone}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {order.status === 'pending' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">İşlemler</h2>
                  
                  <button className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                    Siparişi İptal Et
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderDetail