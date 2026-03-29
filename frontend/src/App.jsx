import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';

import VendorDashboard from './pages/vendor/VendorDashboard';
import VendorProducts from './pages/vendor/VendorProducts';
import VendorProductForm from './pages/vendor/VendorProductForm';
import VendorOrders from './pages/vendor/VendorOrders';
import VendorAnalytics from './pages/vendor/VendorAnalytics';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminVendors from './pages/admin/AdminVendors';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

/* Public layout with Navbar + Footer */
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />

        {/* Buyer protected */}
        <Route path="/cart" element={<ProtectedRoute roles={['BUYER']}><CartPage /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute roles={['BUYER']}><CheckoutPage /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute roles={['BUYER']}><OrdersPage /></ProtectedRoute>} />
      </Route>

      {/* Vendor Dashboard */}
      <Route
        path="/vendor"
        element={
          <ProtectedRoute roles={['VENDOR']}>
            <DashboardLayout type="vendor" />
          </ProtectedRoute>
        }
      >
        <Route index element={<VendorDashboard />} />
        <Route path="products" element={<VendorProducts />} />
        <Route path="products/new" element={<VendorProductForm />} />
        <Route path="products/edit/:id" element={<VendorProductForm />} />
        <Route path="orders" element={<VendorOrders />} />
        <Route path="analytics" element={<VendorAnalytics />} />
      </Route>

      {/* Admin Panel */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['ADMIN']}>
            <DashboardLayout type="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="vendors" element={<AdminVendors />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  );
}
