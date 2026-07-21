import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import CartDrawer from './CartDrawer';
import API from '../api/axiosConfig';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const fetchCart = () => {
    try {
      const stored = localStorage.getItem('cart');
      if (stored) {
        setCartItems(JSON.parse(stored));
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error("Failed to parse cart", err);
    }
  };

  useEffect(() => {
    fetchCart();
    
    const handleOpenCart = () => setIsCartOpen(true);
    
    window.addEventListener('cartUpdated', fetchCart);
    window.addEventListener('openCart', handleOpenCart);
    
    return () => {
      window.removeEventListener('cartUpdated', fetchCart);
      window.removeEventListener('openCart', handleOpenCart);
    };
  }, []);

  const handleUpdateQuantity = (productId, newQuantity) => {
    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (newQuantity <= 0) {
      currentCart = currentCart.filter(item => item.productId !== productId);
    } else {
      const item = currentCart.find(item => item.productId === productId);
      if (item) {
        item.quantity = newQuantity;
      }
    }
    localStorage.setItem('cart', JSON.stringify(currentCart));
    fetchCart();
  };

  const handleRemoveItem = (productId) => {
    let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
    currentCart = currentCart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(currentCart));
    fetchCart();
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-8 py-6 transition-all duration-500 ${
          isScrolled 
            ? 'bg-mochi-navy/85 backdrop-blur-md text-mochi-cream shadow-sm border-b border-mochi-sky/10' 
            : 'bg-transparent text-white'
        }`}
      >
        <Link to="/" className="text-xl font-bold tracking-tighter uppercase flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors duration-500 ${isScrolled ? 'bg-mochi-cream text-mochi-navy' : 'bg-white text-mochi-navy'}`}>
            M
          </div>
          Mochi.
        </Link>
        
        <div className="flex items-center gap-8 text-sm font-medium tracking-wide">
          <Link to="/collection" className="hover:opacity-70 transition-opacity uppercase">Collection</Link>
          <a href="/#story" className="hover:opacity-70 transition-opacity uppercase">Brand</a>
          <Link to="/login" className="hover:opacity-70 transition-opacity uppercase">Login</Link>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className={`flex items-center gap-2 border rounded-full px-5 py-2 transition-all duration-300 relative ${
              isScrolled 
                ? 'border-mochi-cream/20 hover:bg-mochi-cream hover:text-mochi-navy' 
                : 'border-white/30 hover:bg-white hover:text-mochi-navy'
            }`}
          >
            <ShoppingBag size={16} /> 
            <span>Cart</span>
            
            {/* Dynamic notification bubble */}
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Cart Drawer rendered at the root level of Navbar */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </>
  );
}
