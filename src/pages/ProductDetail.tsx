import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Minus, 
  Plus, 
  Share2, 
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { apiService } from '../lib/api'
import { useCart } from '../contexts/CartContext'
import { useWishlist } from '../contexts/WishlistContext'
import { useAuth } from '../contexts/AuthContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  sale_price?: number
  images: string[]
  stock_quantity: number
  category: string
  brand: string
  rating: number
  review_count: number
  variants?: {
    id: string
    name: string
    options: string[]
  }[]
  specifications?: {
    [key: string]: string
  }
}

interface Review {
  id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({})
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    if (id) {
      fetchProduct()
      fetchReviews()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await apiService.getProduct(id!)
      if (response.success) {
        setProduct(response.data)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await apiService.getProductReviews(id!)
      if (response.success) {
        setReviews(response.data)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    try {
      await addToCart(product.id, quantity)
      // Show success notification
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const handleWishlistToggle = async () => {
    if (!product || !user) {
      navigate('/login')
      return
    }

    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id)
      } else {
        await addToWishlist(product.id)
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
    }
  }

  const nextImage = () => {
    if (product && product.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (product && product.images.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ürün bulunamadı</h2>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ürünlere Dön
          </button>
        </div>
      </div>
    )
  }

  const discount = product.sale_price 
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0

  const displayPrice = product.sale_price || product.price

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImageIndex] || 'https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=600'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md font-semibold">
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600">{product.category} • {product.brand}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.review_count} değerlendirme)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                ₺{displayPrice.toLocaleString()}
              </span>
              {product.sale_price && (
                <span className="text-xl text-gray-500 line-through">
                  ₺{product.price.toLocaleString()}
                </span>
              )}
            </div>

            {/* Variants */}
            {product.variants?.map((variant) => (
              <div key={variant.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {variant.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => setSelectedVariants({
                        ...selectedVariants,
                        [variant.id]: option
                      })}
                      className={`px-4 py-2 border rounded-lg ${
                        selectedVariants[variant.id] === option
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adet
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div>
              {product.stock_quantity > 0 ? (
                <span className="text-green-600 font-medium">
                  {product.stock_quantity < 10 
                    ? `Son ${product.stock_quantity} adet!`
                    : 'Stokta mevcut'
                  }
                </span>
              ) : (
                <span className="text-red-600 font-medium">Stokta yok</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Sepete Ekle
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleWishlistToggle}
                  className={`flex items-center justify-center px-4 py-2 border rounded-lg font-medium ${
                    user && isInWishlist(product.id)
                      ? 'border-red-500 text-red-500 bg-red-50'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-4 h-4 mr-2" fill={user && isInWishlist(product.id) ? 'currentColor' : 'none'} />
                  Favorilere Ekle
                </button>

                <button className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Share2 className="w-4 h-4 mr-2" />
                  Paylaş
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center">
                <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Ücretsiz Kargo</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Güvenli Ödeme</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">14 Gün İade</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Açıklama' },
                { id: 'specifications', label: 'Özellikler' },
                { id: 'reviews', label: 'Değerlendirmeler' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications ? (
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="font-medium text-gray-900">{key}</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Teknik özellikler bulunmuyor.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{review.user_name}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Henüz değerlendirme bulunmuyor.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail