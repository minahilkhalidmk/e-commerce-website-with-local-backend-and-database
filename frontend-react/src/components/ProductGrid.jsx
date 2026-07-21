import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api/axiosConfig';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/Product');
        
        const demoImages = ['/demo1.jpg', '/demo2.jpg', '/demo3.jpg'];
        const mappedProducts = response.data.map((p, index) => ({
          ...p,
          majorImageUrl: p.majorImageUrl || demoImages[index % demoImages.length],
          minorImageUrl1: p.minorImageUrl1 || '/minor1.jpg',
          minorImageUrl2: p.minorImageUrl2 || '/minor2.jpg',
          minorImageUrl3: p.minorImageUrl3 || '/minor3.jpg',
          minorImageUrl4: p.minorImageUrl4 || '/minor4.jpg'
        }));
        
        setProducts(mappedProducts);
        setIsLoading(false);
      } catch (err) {
        console.warn("Backend unavailable. Loading demo collection.");
        setProducts([
          { id: 1, title: 'Mochi Keyboard', description: 'Luxurious minimalist mechanical keyboard', price: 299, stockQuantity: 12, maxQuantityPerUser: 2, imageUrl: '/demo1.jpg' },
          { id: 2, title: 'Vase Edition', description: 'Elegant ceramic handcrafted vase', price: 150, stockQuantity: 3, maxQuantityPerUser: 1, imageUrl: '/demo2.jpg' },
          { id: 3, title: 'Luxury Chair', description: 'Modern ergonomic desk chair', price: 1200, stockQuantity: 0, maxQuantityPerUser: 4, imageUrl: '/demo3.jpg' }
        ]);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="relative z-20 bg-gradient-to-b from-mochi-ocean/60 to-[#0A4B46]/60 backdrop-blur-xl border-t border-b border-white/10 py-32 px-8 shadow-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-8 text-white">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight">Curated Selection</h2>
          <Link to="/collection" className="flex items-center gap-2 text-sm uppercase tracking-widest hover:text-gray-400 transition-colors">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 py-10 font-light tracking-wide">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-light tracking-wide uppercase">
            No products available at the moment.
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
