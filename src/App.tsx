import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { AdminProvider } from './contexts/AdminContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Cart from './pages/Cart'
import Dashboard from './pages/admin/Dashboard'
import ProductManagement from './pages/admin/ProductManagement'
import OrderManagement from './pages/admin/OrderManagement'

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
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
              <Route path="/cart" element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    <Cart />
                  </main>
                  <Footer />
                </div>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="categories" element={<div>Kategori Yönetimi</div>} />
                <Route path="users" element={<div>Kullanıcı Yönetimi</div>} />
                <Route path="shipping" element={<div>Kargo Yönetimi</div>} />
                <Route path="reviews" element={<div>Yorum Yönetimi</div>} />
                <Route path="campaigns" element={<div>Kampanya Yönetimi</div>} />
                <Route path="reports" element={<div>Raporlar</div>} />
                <Route path="settings" element={<div>Ayarlar</div>} />
              </Route>
            </Routes>
          </Router>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  )
}

export default App