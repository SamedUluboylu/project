import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Star,
  MessageSquare,
  User,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface Review {
  id: string
  productId: string
  productName: string
  productImage: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  comment: string
  isApproved: boolean
  isReported: boolean
  reportCount: number
  createdAt: string
}

const ReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedRating, setSelectedRating] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      // Mock data for now
      const mockReviews: Review[] = [
        {
          id: '1',
          productId: '1',
          productName: 'iPhone 15 Pro Max',
          productImage: 'https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=100',
          userId: '1',
          userName: 'Ahmet Yılmaz',
          rating: 5,
          comment: 'Harika bir telefon! Kamera kalitesi mükemmel, performans çok iyi. Kesinlikle tavsiye ederim.',
          isApproved: true,
          isReported: false,
          reportCount: 0,
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          productId: '2',
          productName: 'Samsung Galaxy S24',
          productImage: 'https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=100',
          userId: '2',
          userName: 'Fatma Demir',
          rating: 4,
          comment: 'Güzel telefon ama batarya ömrü biraz kısa. Genel olarak memnunum.',
          isApproved: false,
          isReported: false,
          reportCount: 0,
          createdAt: '2024-01-14T15:45:00Z'
        },
        {
          id: '3',
          productId: '1',
          productName: 'iPhone 15 Pro Max',
          productImage: 'https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=100',
          userId: '3',
          userName: 'Mehmet Kaya',
          rating: 2,
          comment: 'Çok pahalı ve beklediğim performansı alamadım. Hayal kırıklığı.',
          isApproved: false,
          isReported: true,
          reportCount: 3,
          createdAt: '2024-01-13T09:15:00Z'
        }
      ]
      
      setReviews(mockReviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !selectedStatus || 
                         (selectedStatus === 'approved' && review.isApproved) ||
                         (selectedStatus === 'pending' && !review.isApproved) ||
                         (selectedStatus === 'reported' && review.isReported)
    
    const matchesRating = !selectedRating || review.rating.toString() === selectedRating
    
    return matchesSearch && matchesStatus && matchesRating
  })

  const getStatusBadge = (review: Review) => {
    if (review.isReported) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Şikayet Edildi ({review.reportCount})
        </span>
      )
    }

    if (review.isApproved) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Onaylandı
        </span>
      )
    }

    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <MessageSquare className="w-3 h-3 mr-1" />
        Beklemede
      </span>
    )
  }

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    )
  }

  const handleApprove = async (reviewId: string) => {
    try {
      // Call API to approve review
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, isApproved: true } : review
      ))
    } catch (error) {
      console.error('Error approving review:', error)
    }
  }

  const handleReject = async (reviewId: string) => {
    try {
      // Call API to reject review
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, isApproved: false } : review
      ))
    } catch (error) {
      console.error('Error rejecting review:', error)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (window.confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      try {
        // Call API to delete review
        setReviews(reviews.filter(review => review.id !== reviewId))
      } catch (error) {
        console.error('Error deleting review:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Yorum Yönetimi</h1>
          <p className="text-gray-600">Ürün yorumlarını görüntüleyin ve yönetin</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Yorum ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tüm Durumlar</option>
            <option value="approved">Onaylandı</option>
            <option value="pending">Beklemede</option>
            <option value="reported">Şikayet Edildi</option>
          </select>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tüm Puanlar</option>
            <option value="5">5 Yıldız</option>
            <option value="4">4 Yıldız</option>
            <option value="3">3 Yıldız</option>
            <option value="2">2 Yıldız</option>
            <option value="1">1 Yıldız</option>
          </select>

          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5 mr-2" />
            Filtrele
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200">
          <AnimatePresence>
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 hover:bg-gray-50"
              >
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <img
                    src={review.productImage}
                    alt={review.productName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {review.productName}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">{review.userName}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">
                              {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(review)}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mb-3">
                      {getRatingStars(review.rating)}
                    </div>

                    {/* Comment */}
                    <p className="text-gray-700 text-sm mb-4">
                      {review.comment}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {!review.isApproved && (
                        <button
                          onClick={() => handleApprove(review.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Onayla
                        </button>
                      )}
                      
                      {review.isApproved && (
                        <button
                          onClick={() => handleReject(review.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Onayı Kaldır
                        </button>
                      )}

                      <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                        <Eye className="w-3 h-3 mr-1" />
                        Detay
                      </button>

                      <button
                        onClick={() => handleDelete(review.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Yorum bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinize uygun yorum bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewManagement