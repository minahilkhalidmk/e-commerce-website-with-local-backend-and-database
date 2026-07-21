import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('mochi_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('mochi_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, color = 'Default', size = 'One Size') => {
    setCartItems(prev => {
      const existing = prev.find(item => 
        item.productId === product.id && 
        item.color === color && 
        item.size === size
      );

      if (existing) {
        return prev.map(item =>
          item === existing ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...prev, {
        productId: product.id,
        name: product.title,
        image: product.majorImageUrl,
        price: product.price,
        color,
        size,
        quantity
      }];
    });
  };

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
