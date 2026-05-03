import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <p className="font-bold text-gray-900 dark:text-white mb-2">Posticky</p>
          <p>Wall Stickers & Printed T-Shirts delivered to your door.</p>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white mb-2">Shop</p>
          <div className="flex flex-col gap-1">
            <Link to="/stickers">Wall Stickers</Link>
            <Link to="/tshirts">T-Shirts</Link>
            <Link to="/shop">All Products</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white mb-2">Account</p>
          <div className="flex flex-col gap-1">
            <Link to="/login">Login</Link>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white mb-2">Contact</p>
          <p>support@posticky.in</p>
        </div>
      </div>
      <div className="text-center py-4 border-t border-gray-200 dark:border-gray-700">
        © {new Date().getFullYear()} Posticky. All rights reserved.
      </div>
    </footer>
  )
}
