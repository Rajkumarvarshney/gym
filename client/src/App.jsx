import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Customer Pages
import Home from './pages/customer/Home';
import Store from './pages/customer/Store';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Profile from './pages/customer/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageMembers from './pages/admin/ManageMembers';
import ManagePlans from './pages/admin/ManagePlans';
import ManageEquipment from './pages/admin/ManageEquipment';
import ManageProducts from './pages/admin/ManageProducts';
import ManageTimings from './pages/admin/ManageTimings';

// Auth Pages
import Login from './pages/customer/Login';
import Register from './pages/customer/Register';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gym-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gym-neon"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route Wrapper
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gym-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gym-neon"></div>
      </div>
    );
  }
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col justify-between">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public / Customer Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/store" element={<Store />} />
                <Route path="/store/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Protected Customer Routes */}
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Protected Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/members" 
                  element={
                    <AdminRoute>
                      <ManageMembers />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/plans" 
                  element={
                    <AdminRoute>
                      <ManagePlans />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/equipment" 
                  element={
                    <AdminRoute>
                      <ManageEquipment />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/products" 
                  element={
                    <AdminRoute>
                      <ManageProducts />
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/timings" 
                  element={
                    <AdminRoute>
                      <ManageTimings />
                    </AdminRoute>
                  } 
                />
                
                {/* Fallback to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
