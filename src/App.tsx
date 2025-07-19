import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { AdminProvider } from './contexts/AdminContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Profile from './pages/Profile'
import Addresses from './pages/Addresses'
import Notifications from './pages/Notifications'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'
import Cart from './pages/Cart'
import Dashboard from './pages/admin/Dashboard'
import ProductManagement from './pages/admin/ProductManagement'
import OrderManagement from './pages/admin/OrderManagement'
import CategoryManagement from './pages/admin/CategoryManagement'
import BrandManagement from './pages/admin/BrandManagement'
import UserManagement from './pages/admin/UserManagement'
import CouponManagement from './pages/admin/CouponManagement'
import ReviewManagement from './pages/admin/ReviewManagement'
import SettingsManagement from './pages/admin/SettingsManagement'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <WishlistProvider>
          <CartProvider>
            <AdminProvider>
              <Router>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <Home />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/products" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <Products />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/product/:id" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <ProductDetail />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/login" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <Login />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/register" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <Register />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/forgot-password" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <ForgotPassword />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/reset-password" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <ResetPassword />
                      </main>
                      <Footer />
                    </div>
                  } />
                  <Route path="/verify-email" element={
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-1">
                        <VerifyEmail />
                      </main>
                      <Footer />
                    </div>
                  } />

                  {/* Protected routes */}
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-1">
                          <Cart />
                        </main>
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/wishlist" element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-1">
                          <Wishlist />
                        </main>
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-1">
                          <Checkout />
                        </main>
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-1">
                          <Orders />
                        </main>
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/orders/:id" element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-1">
                          <OrderDetail />
                        </main>
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-1">
                          <Profile />
                        </main>
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/addresses" element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-1">
                          <Addresses />
                        </main>
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <div className="min-h-screen flex flex-col">
                        <Header />
                        <main className="flex-1">
                          <Notifications />
                        </main>
                        <Footer />
                      </div>
                    </ProtectedRoute>
                  } />

                  {/* Admin routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="categories" element={<CategoryManagement />} />
                    <Route path="brands" element={<BrandManagement />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="coupons" element={<CouponManagement />} />
                    <Route path="reviews" element={<ReviewManagement />} />
                    <Route path="settings" element={<SettingsManagement />} />
                  </Route>
                </Routes>
              </Router>
            </AdminProvider>
          </CartProvider>
        </WishlistProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App