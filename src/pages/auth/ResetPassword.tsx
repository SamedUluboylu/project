import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { apiService } from '../../lib/api'

interface ResetPasswordForm {
  password: string
  confirmPassword: string
}

const ResetPassword: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>()

  const password = watch('password')

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setError('Geçersiz sıfırlama bağlantısı')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      const response = await apiService.resetPassword(token, data.password)
      if (response.success) {
        navigate('/login', { 
          state: { message: 'Şifreniz başarıyla sıfırlandı. Yeni şifrenizle giriş yapabilirsiniz.' }
        })
      } else {
        setError(response.message || 'Şifre sıfırlama başarısız')
      }
    } catch (error: any) {
      setError(error.message || 'Şifre sıfırlama sırasında bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Geçersiz Bağlantı</h2>
            <p className="text-gray-600 mb-6">
              Şifre sıfırlama bağlantısı geçersiz veya süresi dolmuş.
            </p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Yeni Bağlantı İste
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900">Yeni Şifre Belirle</h2>
          <p className="mt-2 text-gray-600">
            Hesabınız için yeni bir şifre belirleyin.
          </p>
        </motion.div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10"
        >
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Yeni Şifre
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('password', {
                    required: 'Şifre gereklidir',
                    minLength: {
                      value: 6,
                      message: 'Şifre en az 6 karakter olmalıdır',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Yeni şifreniz"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Şifre Tekrarı
              </label>
              <div className="mt-1 relative">
                <input
                  {...register('confirmPassword', {
                    required: 'Şifre tekrarı gereklidir',
                    validate: (value) =>
                      value === password || 'Şifreler eşleşmiyor',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="appearance-none block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Şifrenizi tekrar girin"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Şifre sıfırlanıyor...' : 'Şifreyi Sıfırla'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default ResetPassword