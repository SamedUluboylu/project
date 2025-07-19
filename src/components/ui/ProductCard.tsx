import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'

interface Product {
  id: string
  name: string
  price: number
  sale_price?: number
  images: string[]
  stock_quantity: number
  rating?: number
  review_count?: number
}

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart()
  const [isWishlisted, setIsWishlisted] = React.useState(false)
  const [imageError, setImageError] = React.useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await addToCart(product.id)
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const discount = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0

  const displayPrice = product.sale_price || product.price
  const mainImage = product.images?.[0] || 'https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=400'

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link to={`/product/${product.id}`}>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={imageError ? 'https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=400' : mainImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
            
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                -{discount}%
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
              <button
                onClick={handleWishlistToggle}
                className={`p-2 rounded-full shadow-md transition-colors ${
                  isWishlisted 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Quick Add to Cart */}
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  product.stock_quantity > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>
                    {product.stock_quantity > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
              {product.name}
            </h3>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating!)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  ({product.review_count || 0})
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ₺{displayPrice.toLocaleString()}
              </span>
              {product.sale_price && (
                <span className="text-sm text-gray-500 line-through">
                  ₺{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="mt-2">
              {product.stock_quantity > 0 ? (
                <span className="text-xs text-green-600">
                  {product.stock_quantity < 10 
                    ? `Son ${product.stock_quantity} adet!`
                    : 'Stokta mevcut'
                  }
                </span>
              ) : (
                <span className="text-xs text-red-600">Stokta yok</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard