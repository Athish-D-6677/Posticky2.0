import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

const CART_KEY = 'posticky_cart'

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (item) => {
    setCart((prev) => {
      const key = `${item.productId}-${item.size}-${item.customText}`
      const exists = prev.find(
        (i) => `${i.productId}-${i.size}-${i.customText}` === key
      )
      if (exists) {
        return prev.map((i) =>
          `${i.productId}-${i.size}-${i.customText}` === key
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const removeFromCart = (key) =>
    setCart((prev) =>
      prev.filter((i) => `${i.productId}-${i.size}-${i.customText}` !== key)
    )

  const updateQty = (key, qty) => {
    if (qty < 1) return removeFromCart(key)
    setCart((prev) =>
      prev.map((i) =>
        `${i.productId}-${i.size}-${i.customText}` === key ? { ...i, qty } : i
      )
    )
  }

  const clearCart = () => setCart([])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
