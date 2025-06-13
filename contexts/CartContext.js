import { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load cart từ localStorage khi mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(stored);

    // Lắng nghe event đồng bộ cart từ các nơi khác (nếu có)
    const handleUpdate = () => {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartItems(stored);
    };

    window.addEventListener('cart-updated', handleUpdate);
    return () => window.removeEventListener('cart-updated', handleUpdate);
  }, []);

  // Hàm lưu cart và phát event để đồng bộ các component khác
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
    window.dispatchEvent(new Event('cart-updated'));
  };

  // Thêm sản phẩm mới hoặc tăng số lượng nếu đã có
  const addToCart = (product, quantity = 1) => {
    const existing = cartItems.find(item => item.id === product.id);
    let updated;
    if (existing) {
      updated = cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      updated = [...cartItems, { ...product, quantity }];
    }
    saveCart(updated);
  };

  // Xóa sản phẩm theo id
  const removeFromCart = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    saveCart(updated);
  };

  // Cập nhật số lượng
  const updateCartQuantity = (id, quantity) => {
    if (quantity < 1) return;
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    saveCart([]);
  };

  // Tính tổng tiền
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discount_price || item.original_price;
      return total + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
