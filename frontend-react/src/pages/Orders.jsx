import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Clock, Truck, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import API from '../api/axiosConfig';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await API.get('/Order/history');
        setOrders(response.data);
      } catch (err) {
        console.error("Failed to fetch order history", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return <Clock className="text-amber-500" />;
      case 'shipped': return <Truck className="text-mochi-teal" />;
      case 'delivered': return <CheckCircle className="text-green-500" />;
      default: return <Package className="text-mochi-navy/50" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-mochi-cream flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-mochi-navy rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mochi-cream text-mochi-navy pb-24">
      <Navbar />

      <main className="pt-32 max-w-5xl mx-auto px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-mochi-ocean hover:text-mochi-teal transition-colors mb-8 font-bold">
          <ArrowLeft size={16} /> Back to Store
        </Link>

        <h1 className="text-4xl font-bold uppercase tracking-tighter mb-12">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-mochi-sky text-center">
            <Package size={48} className="mx-auto mb-4 text-mochi-navy/30" />
            <h2 className="text-xl font-bold text-mochi-navy mb-2">No orders found</h2>
            <p className="text-mochi-navy/60 mb-6">Looks like you haven't placed any orders yet.</p>
            <Link to="/collection" className="inline-block px-8 py-3 bg-mochi-teal text-white font-bold uppercase tracking-widest text-sm rounded-sm hover:bg-mochi-ocean transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={order.id} 
                className="bg-white p-8 rounded-lg shadow-sm border border-mochi-sky/50"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-mochi-sky/30 pb-6 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-mochi-navy/60 font-bold mb-1">Order Number</p>
                    <p className="font-mono text-lg">{order.orderNumber}</p>
                    <p className="text-xs text-mochi-navy/50 mt-1">{new Date(order.orderDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center gap-3 bg-mochi-cream px-4 py-2 rounded-full border border-mochi-sky">
                    {getStatusIcon(order.status)}
                    <span className="font-bold uppercase tracking-widest text-xs">{order.status}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.orderItems.map(item => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-16 h-20 bg-mochi-cream rounded-sm overflow-hidden border border-mochi-sky/30">
                        <img 
                          src={item.productImage || '/demo1.jpg'} 
                          alt={item.productName} 
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{item.productName}</h4>
                        <p className="text-xs text-mochi-navy/60 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-mono text-mochi-ocean">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-mochi-sky/30 flex justify-between items-center">
                  <div className="text-xs text-mochi-navy/60 uppercase tracking-widest">
                    Shipped to: <br/>
                    <span className="font-bold text-mochi-navy">{order.shippingFirstName} {order.shippingLastName}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-mochi-navy/60 font-bold mb-1">Total Amount</p>
                    <p className="font-mono text-2xl text-mochi-teal">${order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
