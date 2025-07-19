import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Truck, Shield, Headphones, RotateCcw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ui/ProductCard'

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      // Fetch featured products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .limit(8)

      if (products) {
        setFeaturedProducts(products)
      }

      // Fetch categories
      const { data: categoryData } = await supabase
        .from('categories')
        .select('*')
        .is('parent_id', null)
        .limit(6)

      if (categoryData) {
        setCategories(categoryData)
      }
    } catch (error) {
      console.error('Error fetching home data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 md:h-[500px] bg-gradient-to-r from-blue-600 to-emerald-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              En İyi Ürünler
              <br />
              <span className="text-yellow-300">Uygun Fiyatlarla</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Binlerce kaliteli ürün arasından seçim yapın. Güvenli alışveriş, hızlı teslimat.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Alışverişe Başla
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20">
          <img
            src="https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: 'Ücretsiz Kargo',
                description: '500 TL ve üzeri alışverişlerde',
              },
              {
                icon: Shield,
                title: 'Güvenli Ödeme',
                description: '256-bit SSL sertifikası ile korumalı',
              },
              {
                icon: RotateCcw,
                title: '14 Gün İade',
                description: 'Koşulsuz iade garantisi',
              },
              {
                icon: Headphones,
                title: '7/24 Destek',
                description: 'Müşteri hizmetleri her zaman yanınızda',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kategoriler</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              İhtiyacınız olan tüm ürün kategorilerine göz atın
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category: any, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  to={`/category/${category.slug}`}
                  className="group block text-center"
                >
                  <div className="w-full aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden group-hover:shadow-lg transition-shadow">
                    <img
                      src={category.image_url || 'https://images.pexels.com/photos/3985062/pexels-photo-3985062.jpeg?auto=compress&cs=tinysrgb&w=200'}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En çok tercih edilen ve kaliteli ürünlerimizi keşfedin
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tüm Ürünleri Gör
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Kampanyalardan Haberdar Olun
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Özel indirimler, yeni ürünler ve kampanyalar hakkında ilk siz haberdar olun
          </p>
          <div className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="E-posta adresiniz"
              className="flex-1 px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-r-lg hover:bg-emerald-600 transition-colors">
              Abone Ol
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home