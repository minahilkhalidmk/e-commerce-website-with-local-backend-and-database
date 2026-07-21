import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) {
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-mochi-cream shadow-2xl z-50 flex flex-col border-l border-mochi-sky"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-mochi-sky/50 bg-white/50">
              <h2 className="text-xl font-bold uppercase tracking-widest text-mochi-navy flex items-center gap-2">
                <ShoppingBag size={20} /> Your Cart
              </h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-mochi-sky/20 rounded-full transition-colors text-mochi-navy"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-mochi-navy/50 space-y-4">
                  <ShoppingBag size={48} className="opacity-50" />
                  <p className="font-medium tracking-wide">Your cart is empty.</p>
                  <button 
                    onClick={() => { onClose(); navigate('/'); }}
                    className="mt-4 px-6 py-2 border border-mochi-teal text-mochi-teal font-bold uppercase tracking-widest text-xs hover:bg-mochi-teal hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-4 bg-white/60 p-4 rounded-sm border border-mochi-sky/30">
                    {/* Image */}
                    <div className="w-20 h-24 bg-mochi-cream rounded-sm overflow-hidden flex-shrink-0">
                      <img 
                        src={item.product.majorImageUrl || '/demo1.jpg'} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-mochi-navy text-sm">{item.product.title}</h3>
                          <p className="text-mochi-ocean font-mono text-sm mt-1">${item.product.price.toFixed(2)}</p>
                        </div>
                        <button 
                          onClick={() => onRemoveItem(item.productId)}
                          className="text-red-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-4">
                        <div className="flex items-center border border-mochi-sky rounded-sm overflow-hidden bg-white">
                          <button 
                            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                            className="p-1 hover:bg-mochi-cream transition-colors text-mochi-navy"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-mochi-navy">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                            className="p-1 hover:bg-mochi-cream transition-colors text-mochi-navy"
                            disabled={item.quantity >= item.product.stockQuantity}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        {item.quantity >= item.product.stockQuantity && (
                          <span className="text-[10px] uppercase text-red-500 font-bold tracking-widest">Max Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-mochi-sky/50 bg-white/80 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-bold uppercase tracking-widest text-mochi-navy/70">Subtotal</span>
                  <span className="text-xl font-mono text-mochi-navy">${subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-mochi-navy/60 mb-6 tracking-wide">Shipping and taxes calculated at checkout.</p>
                <button 
                  onClick={() => { onClose(); navigate('/checkout'); }}
                  className="w-full py-4 bg-mochi-teal text-white font-bold tracking-widest uppercase hover:bg-mochi-ocean transition-colors shadow-md rounded-sm"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
