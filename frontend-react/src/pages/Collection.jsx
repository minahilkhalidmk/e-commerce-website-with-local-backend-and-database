import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Filter, ChevronDown, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import API from '../api/axiosConfig';

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Filter States
  const [priceRange, setPriceRange] = useState(500); // 0 to 1000
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const categories = ['Ceramics', 'Furniture', 'Lighting', 'Decor'];

  const headerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

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
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter(p => {
    // Dummy category logic: since API doesn't have category, we'll assign pseudo-categories based on ID for demo, 
    // or just ignore category filtering if API doesn't support it. Let's filter by price.
    return p.price <= priceRange;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'newest') return b.id - a.id;
    return 0; // featured
  });

  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      {/* Cinematic Header */}
      <div ref={headerRef} className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden bg-black text-white pt-20">
        <motion.div className="absolute inset-0 z-0" style={{ y }}>
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img src="/hero-bg.jpg" alt="Collection Hero" className="w-full h-full object-cover scale-105" />
        </motion.div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-medium tracking-tighter"
          >
            THE COLLECTION
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-4 text-gray-300 tracking-widest uppercase text-sm font-light"
          >
            Curated objects for the modern aesthete
          </motion.p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Filters */}
        <div className={`w-full md:w-64 shrink-0 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
          <div className="sticky top-32 space-y-10">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
              <h3 className="font-semibold uppercase tracking-widest text-sm">Filters</h3>
              <Filter size={16} className="text-gray-400" />
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Price Range</h4>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>$0</span>
                <span>${priceRange}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1000" 
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Category</h4>
              <div className="space-y-3">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-black border-black text-white' : 'border-gray-300 group-hover:border-black'}`}>
                      {selectedCategories.includes(cat) && <Check size={12} />}
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-black">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Product Grid Area */}
        <div className="flex-1">
          {/* Top Bar: Mobile Filter Toggle & Sort */}
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
            >
              <Filter size={16} /> Filters
            </button>
            <div className="hidden md:block text-sm text-gray-500">
              Showing {filteredProducts.length} results
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest hover:text-gray-600 transition-colors"
              >
                Sort By <ChevronDown size={14} className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl z-20 py-2"
                  >
                    {[
                      { id: 'featured', label: 'Featured' },
                      { id: 'newest', label: 'Newest Arrivals' },
                      { id: 'price-low', label: 'Price: Low to High' },
                      { id: 'price-high', label: 'Price: High to Low' }
                    ].map(option => (
                      <button
                        key={option.id}
                        onClick={() => { setSortBy(option.id); setIsSortOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${sortBy === option.id ? 'bg-gray-50 font-bold' : 'hover:bg-gray-50'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="flex justify-center py-32">
              <div className="w-8 h-8 border-t-2 border-black rounded-full animate-spin"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-32 text-gray-500 font-light tracking-wide">
              No products found matching your filters.
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-12"
            >
              <AnimatePresence mode="popLayout">
                {filteredProducts.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    layout 
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
