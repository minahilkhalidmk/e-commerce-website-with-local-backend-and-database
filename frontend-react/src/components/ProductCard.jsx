import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

export default function ProductCard({ product, layout, variants, initial, animate, exit }) {
  const isOutOfStock = product.stockQuantity <= 0;
  const navigate = useNavigate();

  return (
    <motion.div
      layout={layout}
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg flex flex-col h-full border border-gray-100 cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Placeholder for Product Image */}
      <div className="aspect-square bg-gray-100 w-full relative">
        {product.majorImageUrl ? (
          <img src={product.majorImageUrl} alt={product.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-mono text-xs tracking-widest uppercase">
            Image Placeholder
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-sm z-10">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:underline">
            {product.title}
          </h3>
          <span className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-1 font-light leading-relaxed">
          {product.description}
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            try {
              const cart = JSON.parse(localStorage.getItem('cart')) || [];
              const existing = cart.find(c => c.productId === product.id);
              if (existing) {
                existing.quantity += 1;
              } else {
                cart.push({
                  productId: product.id,
                  quantity: 1,
                  product: product
                });
              }
              localStorage.setItem('cart', JSON.stringify(cart));
              window.dispatchEvent(new Event('cartUpdated'));
              window.dispatchEvent(new Event('openCart'));
            } catch (err) {
              console.error('Failed to add to cart', err);
            }
          }}
          disabled={isOutOfStock}
          className={`w-full py-3 text-sm font-bold tracking-widest uppercase rounded-sm transition-all duration-300 ${
            isOutOfStock
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-mochi-teal text-white hover:bg-mochi-ocean'
          }`}
        >
          {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
}
