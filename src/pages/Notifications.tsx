import React from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, Trash2, Package, Heart, ShoppingCart } from 'lucide-react'
import { useNotifications } from '../contexts/NotificationContext'

const Notifications: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications()

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="w-5 h-5 text-blue-600" />
      case 'wishlist':
        return <Heart className="w-5 h-5 text-red-600" />
      case 'cart':
        return <ShoppingCart className="w-5 h-5 text-green-600" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Bildirimler</h1>
              <p className="text-gray-600">
                {notifications.filter(n => !n.isRead).length} okunmamış bildirim
              </p>
            </div>
            {notifications.some(n => !n.isRead) && (
              <button
                onClick={markAllAsRead}
                className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Check className="w-4 h-4 mr-2" />
                Tümünü Okundu İşaretle
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz bildirim yok
              </h3>
              <p className="text-gray-600">
                Yeni bildirimler burada görünecek
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-200">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-6 hover:bg-gray-50 cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-sm font-medium ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <span className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                        </div>
                        
                        <p className={`mt-1 text-sm ${
                          !notification.isRead ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Notifications