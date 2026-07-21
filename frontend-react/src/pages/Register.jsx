import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import API from '../api/axiosConfig';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await API.post('/Auth/register', { email, password });
      // Successfully created account, now navigate to login!
      navigate('/login');
    } catch (err) {
      console.error("Registration failed:", err);
      if (!err.response) {
         setError("Network Error: Is the C# backend running on port 7088?");
      } else {
         setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center font-sans selection:bg-mochi-teal selection:text-white">
      <div className="absolute inset-0 z-0">
        <img src="/hero-bg.jpg" alt="Premium background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-mochi-navy/80 backdrop-blur-sm z-10" />
      </div>

      <div className="relative z-20 w-full max-w-md px-6 my-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-mochi-cream rounded-xl shadow-2xl p-10 lg:p-12"
        >
          <div className="mb-10 text-center">
            <Link to="/" className="inline-flex items-center justify-center w-12 h-12 bg-mochi-navy text-mochi-cream rounded-full mb-6 font-bold text-xl tracking-tighter">
              M
            </Link>
            <h1 className="text-3xl font-medium tracking-tight text-mochi-navy mb-2">Create Account</h1>
            <p className="text-sm text-mochi-ocean">Join Mochi Store today.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <AnimatePresence mode="popLayout">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm py-3 px-4 rounded-md border border-red-100">
                    <AlertCircle size={16} className="shrink-0" />
                    <p className="truncate">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block px-0 pb-2.5 pt-6 w-full text-sm text-mochi-navy bg-transparent border-b border-mochi-sky appearance-none focus:outline-none focus:ring-0 focus:border-mochi-teal peer transition-colors"
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="absolute text-sm text-mochi-ocean duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-mochi-teal cursor-text font-medium"
              >
                Email Address
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block px-0 pb-2.5 pt-6 w-full text-sm text-mochi-navy bg-transparent border-b border-mochi-sky appearance-none focus:outline-none focus:ring-0 focus:border-mochi-teal peer transition-colors"
                placeholder=" "
                required
              />
              <label
                htmlFor="password"
                className="absolute text-sm text-mochi-ocean duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-0 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-mochi-teal cursor-text font-medium"
              >
                Password
              </label>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 mt-4 bg-mochi-teal text-white rounded-sm text-sm font-bold tracking-widest uppercase transition-colors shadow-md flex items-center justify-center min-h-[52px] ${
                isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:bg-mochi-ocean'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign Up'
              )}
            </motion.button>
          </form>


          
          <div className="mt-8 text-center text-sm text-mochi-ocean">
            Already have an account? <Link to="/login" className="font-bold text-mochi-navy hover:text-mochi-teal transition-colors">Sign in</Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-mochi-cream/50 hover:text-mochi-cream transition-colors">
            <ArrowLeft size={14} /> Return to Store
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
