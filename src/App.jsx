import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './admin/AdminLayout'

// Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import Stickers from './pages/Stickers'
import Tshirts from './pages/Tshirts'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Unauthorized from './pages/Unauthorized'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import MyOrders from './pages/MyOrders'
import Account from './pages/Account'
import Wishlist from './pages/Wishlist'
import CustomOrder from './pages/CustomOrder'
import About from './pages/About'
import Contact from './pages/Contact'

// Admin pages
import AdminLogin from './admin/AdminLogin'
import Dashboard from './admin/Dashboard'
import Products from './admin/Products'
import AddProduct from './admin/AddProduct'
import Orders from './admin/Orders'
import OrderDetail from './admin/OrderDetail'
import Users from './admin/Users'
import Coupons from './admin/Coupons'

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public customer routes */}
            <Route path="/" element={<CustomerLayout><Home /></CustomerLayout>} />
            <Route path="/shop" element={<CustomerLayout><Shop /></CustomerLayout>} />
            <Route path="/stickers" element={<CustomerLayout><Stickers /></CustomerLayout>} />
            <Route path="/tshirts" element={<CustomerLayout><Tshirts /></CustomerLayout>} />
            <Route path="/product/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
            <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
            <Route path="/unauthorized" element={<CustomerLayout><Unauthorized /></CustomerLayout>} />
            <Route path="/custom-order" element={<CustomerLayout><CustomOrder /></CustomerLayout>} />
            <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
            <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />

            {/* Protected customer routes */}
            <Route path="/cart" element={<CustomerLayout><PrivateRoute><Cart /></PrivateRoute></CustomerLayout>} />
            <Route path="/checkout" element={<CustomerLayout><PrivateRoute><Checkout /></PrivateRoute></CustomerLayout>} />
            <Route path="/order-success" element={<CustomerLayout><PrivateRoute><OrderSuccess /></PrivateRoute></CustomerLayout>} />
            <Route path="/my-orders" element={<CustomerLayout><PrivateRoute><MyOrders /></PrivateRoute></CustomerLayout>} />
            <Route path="/account" element={<CustomerLayout><PrivateRoute><Account /></PrivateRoute></CustomerLayout>} />
            <Route path="/wishlist" element={<CustomerLayout><PrivateRoute><Wishlist /></PrivateRoute></CustomerLayout>} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminLayout><Dashboard /></AdminLayout></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminLayout><Products /></AdminLayout></AdminRoute>} />
            <Route path="/admin/products/add" element={<AdminRoute><AdminLayout><AddProduct /></AdminLayout></AdminRoute>} />
            <Route path="/admin/products/edit/:id" element={<AdminRoute><AdminLayout><AddProduct /></AdminLayout></AdminRoute>} />
            <Route path="/admin/orders" element={<AdminRoute><AdminLayout><Orders /></AdminLayout></AdminRoute>} />
            <Route path="/admin/orders/:id" element={<AdminRoute><AdminLayout><OrderDetail /></AdminLayout></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminLayout><Users /></AdminLayout></AdminRoute>} />
            <Route path="/admin/coupons" element={<AdminRoute><AdminLayout><Coupons /></AdminLayout></AdminRoute>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
