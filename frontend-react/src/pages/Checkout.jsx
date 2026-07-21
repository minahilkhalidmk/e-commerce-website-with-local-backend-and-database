import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import API from '../api/axiosConfig';

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState({
    shippingFirstName: '',
    shippingLastName: '',
    shippingStreet: '',
    shippingCity: '',
    shippingZipCode: ''
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cart');
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to parse cart", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% dummy tax
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderItems = cartItems.map(item => ({
        id: 0,
        orderId: 0,
        productId: item.productId,
        productName: item.product.title,
        productImage: item.product.majorImageUrl || '',
        quantity: item.quantity,
        unitPrice: item.product.price
      }));

      const orderPayload = {
        id: 0,
        userId: null,
        orderNumber: "",
        orderDate: new Date().toISOString(),
        status: "",
        totalAmount: total,
        shippingFirstName: formData.shippingFirstName,
        shippingLastName: formData.shippingLastName,
        shippingStreet: formData.shippingStreet,
        shippingCity: formData.shippingCity,
        shippingZipCode: formData.shippingZipCode,
        orderItems: orderItems
      };

      await API.post('/Order', orderPayload);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated')); // Clears navbar cart
      setOrderComplete(true);
    } catch (err) {
      console.error("Failed to place order", err);
      alert(`There was an error placing your order: ${err.message}. Base URL: ${API.defaults.baseURL}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mochi-cream flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-mochi-navy rounded-full animate-spin"></div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-mochi-cream flex flex-col items-center justify-center text-center px-4">
        <Navbar />
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring" }}
          className="bg-white p-12 rounded-lg shadow-xl max-w-md w-full border border-mochi-sky"
        >
          <CheckCircle size={64} className="text-mochi-teal mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-mochi-navy mb-4">Order Placed!</h1>
          <p className="text-mochi-navy/70 mb-8">Your order is placed and securely stored in the database. Our admin team will process it shortly. Thank you for your purchase!</p>
          <button 
            onClick={() => navigate('/collection')}
            className="w-full py-4 bg-mochi-navy text-white font-bold tracking-widest uppercase hover:bg-black transition-colors rounded-sm"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mochi-cream text-mochi-navy pb-24">
      <Navbar />

      <main className="pt-32 max-w-6xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-mochi-ocean hover:text-mochi-teal transition-colors mb-8 font-bold">
          <ArrowLeft size={16} /> Back to Store
        </Link>

        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-12">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Shipping Form */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-mochi-sky/50">
              <h2 className="text-xl font-bold mb-6 border-b border-mochi-sky/30 pb-4">Shipping Information</h2>
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-mochi-navy/70">First Name</label>
                    <input 
                      required 
                      className="w-full bg-mochi-cream/30 border border-mochi-sky p-3 rounded-sm focus:outline-none focus:border-mochi-teal" 
                      value={formData.shippingFirstName}
                      onChange={e => setFormData({...formData, shippingFirstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-mochi-navy/70">Last Name</label>
                    <input 
                      required 
                      className="w-full bg-mochi-cream/30 border border-mochi-sky p-3 rounded-sm focus:outline-none focus:border-mochi-teal" 
                      value={formData.shippingLastName}
                      onChange={e => setFormData({...formData, shippingLastName: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-mochi-navy/70">Street Address</label>
                  <input 
                    required 
                    pattern="[A-Za-z0-9\s]+"
                    title="Please enter only letters and numbers (no special characters)."
                    className="w-full bg-mochi-cream/30 border border-mochi-sky p-3 rounded-sm focus:outline-none focus:border-mochi-teal" 
                    value={formData.shippingStreet}
                    onChange={e => setFormData({...formData, shippingStreet: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-mochi-navy/70">City</label>
                    <select 
                      required 
                      className="w-full bg-mochi-cream/30 border border-mochi-sky p-3 rounded-sm focus:outline-none focus:border-mochi-teal appearance-none" 
                      value={formData.shippingCity}
                      onChange={e => setFormData({...formData, shippingCity: e.target.value})}
                    >
                      <option value="" disabled>Select City</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Lahore">Lahore</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Gujranwala">Gujranwala</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Multan">Multan</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Bahawalpur">Bahawalpur</option>
                      <option value="Sargodha">Sargodha</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Sukkur">Sukkur</option>
                      <option value="Larkana">Larkana</option>
                      <option value="Sheikhupura">Sheikhupura</option>
                      <option value="Rahim Yar Khan">Rahim Yar Khan</option>
                      <option value="Jhang">Jhang</option>
                      <option value="Dera Ghazi Khan">Dera Ghazi Khan</option>
                      <option value="Gujrat">Gujrat</option>
                      <option value="Sahiwal">Sahiwal</option>
                      <option value="Wah Cantonment">Wah Cantonment</option>
                      <option value="Mardan">Mardan</option>
                      <option value="Kasur">Kasur</option>
                      <option value="Okara">Okara</option>
                      <option value="Mingora">Mingora</option>
                      <option value="Nawabshah">Nawabshah</option>
                      <option value="Chiniot">Chiniot</option>
                      <option value="Kotri">Kotri</option>
                      <option value="Kamoke">Kamoke</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-mochi-navy/70">ZIP Code</label>
                    <input 
                      required 
                      pattern="\d{4}"
                      maxLength="4"
                      title="ZIP Code must be exactly 4 digits."
                      className="w-full bg-mochi-cream/30 border border-mochi-sky p-3 rounded-sm focus:outline-none focus:border-mochi-teal" 
                      value={formData.shippingZipCode}
                      onChange={e => setFormData({...formData, shippingZipCode: e.target.value})}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-mochi-sky/50 sticky top-32">
              <h2 className="text-xl font-bold mb-6 border-b border-mochi-sky/30 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-mochi-navy/80">{item.quantity}x {item.product.title}</span>
                    <span className="font-mono">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-mochi-sky/30 pt-4 space-y-3 mb-8">
                <div className="flex justify-between text-sm text-mochi-navy/70">
                  <span>Subtotal</span>
                  <span className="font-mono">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-mochi-navy/70">
                  <span>Estimated Tax</span>
                  <span className="font-mono">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-mochi-sky/30">
                  <span>Total</span>
                  <span className="font-mono text-mochi-ocean">${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                form="checkout-form"
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className={`w-full py-4 font-bold tracking-widest uppercase transition-colors shadow-md rounded-sm ${
                  isSubmitting || cartItems.length === 0
                    ? 'bg-mochi-sky text-mochi-navy/50 cursor-not-allowed'
                    : 'bg-mochi-teal text-white hover:bg-mochi-ocean'
                }`}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
