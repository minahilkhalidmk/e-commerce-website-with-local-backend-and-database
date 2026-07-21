import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronDown, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import API from '../api/axiosConfig';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Local state for interactivity
  const [selectedColor, setSelectedColor] = useState('black');
  const [selectedSize, setSelectedSize] = useState('M');
  
  // Docs toggle
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  
  // Gallery state
  const [activeImage, setActiveImage] = useState(null);

  const colors = [
    { name: 'black', class: 'bg-zinc-900' },
    { name: 'white', class: 'bg-zinc-100 border border-mochi-sky' },
    { name: 'gray', class: 'bg-zinc-400' }
  ];
  
  const sizes = ['S', 'M', 'L', 'XL'];

  useEffect(() => {
    const fetchProduct = async () => {
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
        
        const found = mappedProducts.find(p => p.id.toString() === id);
        if (found) {
          setProduct(found);
          setActiveImage(found.majorImageUrl);
        } else {
          setProduct(null);
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setIsLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mochi-cream flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-mochi-navy rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-mochi-cream flex flex-col items-center justify-center text-center px-4 text-mochi-navy">
        <h1 className="text-4xl font-light mb-4">Product Not Found</h1>
        <Link to="/" className="text-sm uppercase tracking-widest border-b border-mochi-navy pb-1">Return Home</Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;
  const allImages = [product.majorImageUrl, product.minorImageUrl1, product.minorImageUrl2, product.minorImageUrl3, product.minorImageUrl4].filter(Boolean);

  return (
    <div className="min-h-screen bg-mochi-cream text-mochi-navy font-sans selection:bg-mochi-teal selection:text-white pb-24">
      <Navbar />

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pt-24 max-w-[1600px] mx-auto px-6 md:px-12 pb-24"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-mochi-ocean hover:text-mochi-teal transition-colors mb-8 font-bold">
          <ArrowLeft size={16} /> Back to Collection
        </Link>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* LEFT: Sticky Image Gallery */}
          <div className="w-full lg:w-3/5">
            <div className="sticky top-32 flex gap-4 h-[calc(100vh-160px)]">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col gap-4 overflow-y-auto pr-2 w-24 no-scrollbar">
                {allImages.map((url, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImage(url)}
                    className={`aspect-[3/4] bg-white/50 cursor-pointer rounded-sm overflow-hidden border ${activeImage === url ? 'border-mochi-teal ring-1 ring-mochi-teal ring-offset-1 ring-offset-mochi-cream' : 'border-mochi-sky opacity-60 hover:opacity-100 transition-opacity'}`}
                  >
                    <img src={url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                ))}
              </div>
              
              {/* Main Image */}
              <div className="flex-1 bg-white/50 border border-mochi-sky rounded-lg relative overflow-hidden group shadow-sm">
                <img 
                  src={activeImage || product.majorImageUrl} 
                  alt={product.title} 
                  className="w-full h-full object-cover mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {isOutOfStock && (
                  <div className="absolute top-6 right-6 bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-4 py-2 uppercase tracking-widest rounded-sm shadow-md">
                    Out of Stock
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Scrollable Product Info */}
          <div className="w-full lg:w-2/5 flex flex-col justify-center">
            
            {/* Reviews */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-mochi-teal">
                {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="currentColor" />)}
              </div>
              <span className="text-xs tracking-widest text-mochi-ocean font-bold uppercase">128 Reviews</span>
            </div>

            {/* Title & Price */}
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-tight mb-6 text-mochi-navy">
              {product.title}
            </h1>
            <p className="text-3xl font-mono text-mochi-ocean mb-10 pb-10 border-b border-mochi-sky/50">
              ${Number(product.price).toFixed(2)}
            </p>

            {/* Variant Selectors */}
            <div className="mb-10 space-y-8">
              {/* Color Selection */}
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold mb-4 flex items-center justify-between text-mochi-navy">
                  Color <span className="text-mochi-ocean font-medium">{selectedColor}</span>
                </h4>
                <div className="flex gap-4">
                  {colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${selectedColor === color.name ? 'ring-2 ring-mochi-teal ring-offset-2 ring-offset-mochi-cream' : 'opacity-80 hover:opacity-100'}`}
                    >
                      <span className={`w-full h-full rounded-full ${color.class}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold mb-4 flex items-center justify-between text-mochi-navy">
                  Size <span className="text-mochi-ocean font-medium underline cursor-pointer hover:text-mochi-teal">Size Guide</span>
                </h4>
                <div className="flex gap-3">
                  {sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-12 flex items-center justify-center border rounded-sm text-sm font-bold transition-all ${
                        selectedSize === size 
                          ? 'border-mochi-teal bg-mochi-teal text-white shadow-sm' 
                          : 'border-mochi-sky text-mochi-navy hover:border-mochi-teal/50 bg-white/40'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-lg leading-relaxed text-mochi-navy/90 mb-10 font-medium">
              {product.description || "Crafted with intention and designed for longevity. This piece represents the pinnacle of Mochi's commitment to quality materials and timeless aesthetics."}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileTap={!isOutOfStock ? { scale: 0.97 } : {}}
              disabled={isOutOfStock}
              onClick={() => {
                try {
                  const cart = JSON.parse(localStorage.getItem('cart')) || [];
                  const existing = cart.find(c => c.productId === product.id);
                  if (existing) {
                    existing.quantity += 1;
                  } else {
                    cart.push({
                      productId: product.id,
                      quantity: 1,
                      product: product // Keep product details so the Cart Drawer can display them
                    });
                  }
                  localStorage.setItem('cart', JSON.stringify(cart));
                  
                  // Trigger UI updates
                  window.dispatchEvent(new Event('cartUpdated'));
                  window.dispatchEvent(new Event('openCart'));
                } catch (err) {
                  console.error('Failed to add to cart', err);
                }
              }}
              className={`w-full py-5 text-sm font-bold tracking-widest uppercase mb-12 rounded-sm shadow-sm transition-colors ${
                isOutOfStock 
                  ? 'bg-mochi-sky/30 text-mochi-navy/40 cursor-not-allowed border border-mochi-sky' 
                  : 'bg-mochi-teal text-white hover:bg-mochi-ocean'
              }`}
            >
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </motion.button>

            {/* Inline Expanding Accordion for Documentation */}
            <div className="border-t border-mochi-sky pt-6">
              <button
                onClick={() => setIsDocsOpen(!isDocsOpen)}
                className="w-full py-4 flex justify-between items-center text-left focus:outline-none group"
              >
                <span className="text-sm uppercase tracking-widest font-bold text-mochi-navy group-hover:text-mochi-teal transition-colors">
                  View Product Details & Media
                </span>
                <motion.div
                  animate={{ rotate: isDocsOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} className="text-mochi-ocean group-hover:text-mochi-teal transition-colors" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {isDocsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 pt-4">
                      <div className="border-l-2 border-mochi-sky pl-6 py-2">
                        <ul className="list-disc pl-4 space-y-3 text-mochi-navy/80 font-medium mb-8">
                          <li>Premium aerospace-grade materials</li>
                          <li>Weight: 1.2kg</li>
                          <li>Dimensions: 40cm x 30cm x 15cm</li>
                          <li>Stock limit per customer: {product.maxQuantityPerUser} units</li>
                        </ul>

                        {product.documentUrl && (
                           <div className="mt-8">
                             <h5 className="text-xs font-bold uppercase tracking-widest text-mochi-ocean mb-4">Product Media</h5>
                             <div className="bg-white/60 p-2 rounded-sm shadow-sm border border-mochi-sky/50 inline-block w-full">
                               {product.documentUrl.toLowerCase().match(/\.(jpeg|jpg|gif|png|jfif|webp)$/) != null ? (
                                 <img 
                                   src={product.documentUrl} 
                                   alt="Product Documentation" 
                                   className="w-full h-auto object-contain rounded-sm" 
                                 />
                               ) : product.documentUrl.toLowerCase().endsWith('.pdf') ? (
                                 <iframe 
                                   src={`${product.documentUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                                   title="Product Documentation" 
                                   className="w-full h-[600px] border border-mochi-sky/30 rounded-sm"
                                 ></iframe>
                               ) : (
                                 <a 
                                   href={product.documentUrl} 
                                   target="_blank" 
                                   rel="noopener noreferrer" 
                                   className="inline-flex items-center gap-2 text-mochi-teal hover:text-mochi-ocean underline font-bold uppercase text-xs tracking-widest"
                                 >
                                   <BookOpen size={16} /> Open Document
                                 </a>
                               )}
                             </div>
                           </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </motion.main>
    </div>
  );
}
