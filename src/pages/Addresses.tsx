import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, MapPin, X, Save } from 'lucide-react'
import { apiService } from '../lib/api'

interface Address {
  id: string
  title: string
  firstName: string
  lastName: string
  address: string
  city: string
  district: string
  postalCode: string
  phone: string
  isDefault: boolean
}

const Addresses: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    phone: '',
    isDefault: false,
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      const response = await apiService.getAddresses()
      if (response.success) {
        setAddresses(response.data)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingAddress) {
        const response = await apiService.updateAddress(editingAddress.id, formData)
        if (response.success) {
          await fetchAddresses()
          setEditingAddress(null)
        }
      } else {
        const response = await apiService.createAddress(formData)
        if (response.success) {
          await fetchAddresses()
          setShowModal(false)
        }
      }
      
      setFormData({
        title: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        district: '',
        postalCode: '',
        phone: '',
        isDefault: false,
      })
    } catch (error) {
      console.error('Error saving address:', error)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      title: address.title,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      district: address.district,
      postalCode: address.postalCode,
      phone: address.phone,
      isDefault: address.isDefault,
    })
  }

  const handleDelete = async (addressId: string) => {
    if (window.confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
      try {
        const response = await apiService.deleteAddress(addressId)
        if (response.success) {
          await fetchAddresses()
        }
      } catch (error) {
        console.error('Error deleting address:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Adreslerim</h1>
              <p className="text-gray-600">Teslimat adreslerinizi yönetin</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Yeni Adres
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Henüz adres eklemediniz
              </h3>
              <p className="text-gray-600 mb-6">
                Hızlı teslimat için adres bilgilerinizi ekleyin
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                İlk Adresimi Ekle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((address) => (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-lg shadow-md p-6 relative"
                >
                  {address.isDefault && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Varsayılan
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{address.title}</h3>
                    <p className="text-gray-700">
                      {address.firstName} {address.lastName}
                    </p>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>{address.address}</p>
                    <p>{address.district}, {address.city}</p>
                    <p>{address.postalCode}</p>
                    <p>{address.phone}</p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add/Edit Modal */}
          <AnimatePresence>
            {(showModal || editingAddress) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">
                      {editingAddress ? 'Adres Düzenle' : 'Yeni Adres Ekle'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowModal(false)
                        setEditingAddress(null)
                        setFormData({
                          title: '',
                          firstName: '',
                          lastName: '',
                          address: '',
                          city: '',
                          district: '',
                          postalCode: '',
                          phone: '',
                          isDefault: false,
                        })
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adres Başlığı
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ev, İş, vb."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ad
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Soyad
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Adres
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          İl
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          İlçe
                        </label>
                        <input
                          type="text"
                          value={formData.district}
                          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Posta Kodu
                        </label>
                        <input
                          type="text"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefon
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        checked={formData.isDefault}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                        Varsayılan adres olarak ayarla
                      </label>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {editingAddress ? 'Güncelle' : 'Kaydet'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false)
                          setEditingAddress(null)
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default Addresses