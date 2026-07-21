import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowLeft } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-mochi-navy min-h-screen text-mochi-cream font-sans selection:bg-mochi-teal selection:text-white">
      <Navbar />

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-mochi-sky hover:text-white mb-12 transition-colors uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
            Our Manifesto
          </h1>
          <div className="w-20 h-1 bg-mochi-teal mb-12"></div>

          <article className="prose prose-invert prose-lg max-w-none prose-headings:font-light prose-p:font-light prose-p:leading-relaxed prose-p:text-mochi-cream/80">
            <p className="text-2xl leading-relaxed text-mochi-sky mb-10 font-serif italic">
              "Dedicated to delivering uncompromising quality and engineering excellence in every product we offer."
            </p>

            <h3 className="text-2xl mt-12 mb-6">Our Mission</h3>
            <p className="mb-6">
              At Mochi Store, our mission is to provide technology professionals and enthusiasts with premium-grade equipment that enhances productivity and elevates the modern workspace. We bridge the gap between industrial design and reliable daily performance.
            </p>

            <h3 className="text-2xl mt-12 mb-6">Commitment to Quality</h3>
            <p className="mb-6">
              Quality is the cornerstone of our operations. From sourcing premium materials to our rigorous quality assurance processes, every item in our catalog is meticulously evaluated. We partner exclusively with industry-leading manufacturers to ensure our customers receive products built for longevity and consistent performance.
            </p>

            <h3 className="text-2xl mt-12 mb-6">Customer-Centric Approach</h3>
            <p className="mb-6">
              We prioritize our customers' operational success and satisfaction above all else. Our dedicated support team, transparent policies, and secure fulfillment infrastructure are designed to provide a seamless and professional purchasing experience from checkout to delivery.
            </p>

            <h3 className="text-2xl mt-12 mb-6">Sustainable Innovation</h3>
            <p className="mb-10">
              As we continue to grow, we remain committed to responsible sourcing and sustainable operational practices. We believe that professional excellence must align with environmental stewardship, ensuring that our innovative solutions contribute positively to the broader community.
            </p>
          </article>
        </motion.div>
      </main>
    </div>
  );
}
