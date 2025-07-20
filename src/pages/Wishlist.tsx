import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useWishlist } from '../contexts/WishlistContext'
import { useCart } from '../contexts/CartContext'

const Wishlist: React.FC = () => {
  const { items, loading, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId)
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Heart className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Favorileriniz boş</h2>
          <p className="text-gray-600 mb-8">
            Henüz favorilerinize ürün eklemediniz. Beğendiğiniz ürünleri favorilere ekleyin.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ürünleri İncele
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
              Favorilerim ({items.length} ürün)
            </h1>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link to={`/product/${item.product.id}`}>
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={item.product.images?.[0] || 'https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 hover:text-blue-600">
                          {item.product.name}
                        </h3>
                      </Link>

                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">
                          ₺{(item.product.sale_price || item.product.price).toLocaleString()}
                        </span>
                        {item.product.sale_price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₺{item.product.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddToCart(item.product.id)}
                          disabled={item.product.stock_quantity === 0}
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          {item.product.stock_quantity > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
                        </button>
                        
                        <button
                          onClick={() => handleRemoveFromWishlist(item.product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Wishlist