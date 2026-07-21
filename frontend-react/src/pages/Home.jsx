import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import ProductGrid from '../components/ProductGrid';

export default function Home() {
  const containerRef = useRef(null);
  
  // Setup Framer Motion scroll hooks for parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="text-mochi-navy min-h-screen selection:bg-mochi-teal selection:text-white font-sans overflow-hidden">
      
      <Navbar />


      {/* Fixed Background Image for Glassmorphism */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="/hero-bg.jpg" 
          alt="Cinematic background" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Hero Section */}
      <section 
        ref={containerRef} 
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-medium tracking-tighter leading-none mb-6 text-mochi-cream"
          >
            ELEVATE <br />
            <span className="italic font-serif font-light text-mochi-sky">YOUR</span> SPACE
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-mochi-cream max-w-2xl font-light mb-10 tracking-wide"
          >
            Discover objects of desire. Premium design curated for the modern aesthete. 
            Experience unparalleled craftsmanship and cinematic luxury.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/collection" className="group relative inline-flex items-center justify-center gap-3 bg-mochi-teal text-mochi-cream px-8 py-4 rounded-full text-sm font-semibold tracking-widest uppercase overflow-hidden transition-all hover:bg-mochi-ocean hover:scale-105">
              <span className="relative z-10 flex items-center gap-2">
                Explore Collection <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/50 text-xs tracking-widest uppercase"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>

      {/* Featured Products from API */}
      <ProductGrid />

      {/* Brand Story Placeholder */}
      <section id="story" className="relative z-20 bg-mochi-navy py-40 px-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xs tracking-[0.3em] uppercase text-mochi-sky mb-8">Corporate Philosophy</h2>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight mb-12 text-mochi-cream">
            "Dedicated to delivering uncompromising quality and engineering excellence in every product we offer."
          </h3>
          <p className="text-mochi-sky max-w-2xl mx-auto font-light leading-relaxed mb-12">
            At Mochi Store, we prioritize our customers' operational success by bridging the gap between premium industrial design and reliable daily performance. We partner exclusively with industry-leading manufacturers to ensure excellence.
          </p>
          <Link to="/about" className="inline-block border-b border-mochi-sky pb-1 text-sm uppercase tracking-widest text-mochi-sky hover:text-mochi-cream hover:border-mochi-cream transition-all">
            Read our manifesto
          </Link>
        </div>
      </section>

      {/* Ultra-Compact Footer */}
      <footer className="relative z-20 bg-mochi-teal py-4 px-8 border-t border-mochi-sky/20 text-mochi-cream text-center">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs font-light tracking-wide">
          <div className="flex items-center gap-2 font-bold uppercase tracking-widest">
            <div className="w-5 h-5 rounded-full bg-mochi-cream flex items-center justify-center text-mochi-navy text-[10px]">M</div>
            <span>Mochi Store</span>
          </div>
          
          <div className="flex gap-4 md:gap-8 text-mochi-cream/90">
            <span><strong>Contact Number:</strong> +1 (555) 123-4567</span>
            <span><strong>Contact Info:</strong> support@mochistore.com</span>
            <span><strong>Reference Number:</strong> #MOCHI-2026-X</span>
          </div>
          
          <div className="text-mochi-cream/60 uppercase tracking-widest text-[10px]">
            © 2026 All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
