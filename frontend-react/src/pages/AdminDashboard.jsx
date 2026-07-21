import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, AlertTriangle, LogOut, Paperclip, FileText, CheckCircle, Clock, Truck, Package } from 'lucide-react';
import API from '../api/axiosConfig';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  
  // Form Data State
  const [formData, setFormData] = useState({
    id: '', title: '', description: '', price: '', stockQuantity: '', maxQuantityPerUser: '', majorImageUrl: '', minorImageUrl1: '', minorImageUrl2: '', minorImageUrl3: '', minorImageUrl4: '', documentUrl: ''
  });

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchOrders();
    }
  }, [navigate, activeTab]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/Product');
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/Order/all');
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/Order/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('token');
      navigate('/login');
    }, 2000);
  };

  const openCreateModal = () => {
    setFormMode('create');
    setFormData({ id: '', title: '', description: '', price: '', stockQuantity: '', maxQuantityPerUser: '', majorImageUrl: '', minorImageUrl1: '', minorImageUrl2: '', minorImageUrl3: '', minorImageUrl4: '', documentUrl: '' });
    setIsFormOpen(true);
  };

  const openEditModal = (product) => {
    setFormMode('edit');
    setFormData(product);
    setIsFormOpen(true);
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        maxQuantityPerUser: parseInt(formData.maxQuantityPerUser, 10)
      };

      if (formMode === 'create') {
        delete payload.id;
        await API.post('/Product', payload);
      } else {
        await API.put(`/Product/${formData.id}`, payload);
      }
      setIsFormOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Form submission failed:", err);
      alert("Failed to save product.");
    }
  };

  const handleDeleteExecute = async () => {
    try {
      await API.delete(`/Product/${productToDelete.id}`);
      setIsDeleteOpen(false);
      fetchProducts();
    } catch (err) {
      console.error("Deletion failed:", err);
      setIsDeleteOpen(false);
      fetchProducts();
    }
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      
      const response = await API.post('/Upload', formDataUpload, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });
      const downloadURL = response.data.url;

      setFormData(prev => ({ ...prev, [fieldName]: downloadURL }));
    } catch (err) {
      console.error("Image upload failed", err);
      alert("Failed to upload image. Please try again.");
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'processing': return <Clock className="text-amber-500" size={16} />;
      case 'shipped': return <Truck className="text-mochi-teal" size={16} />;
      case 'delivered': return <CheckCircle className="text-green-500" size={16} />;
      default: return <Package className="text-mochi-navy/50" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-mochi-cream text-mochi-navy font-sans selection:bg-mochi-teal selection:text-white p-6 md:p-10">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-mochi-navy">Admin Portal</h1>
          <p className="text-sm text-mochi-ocean">Mochi Store Management</p>
        </div>
        <div className="flex items-center gap-4">
          {activeTab === 'products' && (
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-mochi-teal hover:bg-mochi-ocean text-white px-5 py-2.5 rounded-sm text-sm font-bold uppercase tracking-widest transition-colors shadow-sm"
            >
              <Plus size={16} /> Add New Product
            </button>
          )}
          <button onClick={handleLogout} className="text-mochi-ocean hover:text-mochi-navy transition-colors" title="Log Out">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-mochi-sky/30">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-6 py-3 font-bold uppercase tracking-widest text-xs transition-colors ${activeTab === 'products' ? 'border-b-2 border-mochi-teal text-mochi-teal' : 'text-mochi-ocean hover:text-mochi-navy'}`}
        >
          Inventory
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 font-bold uppercase tracking-widest text-xs transition-colors ${activeTab === 'orders' ? 'border-b-2 border-mochi-teal text-mochi-teal' : 'text-mochi-ocean hover:text-mochi-navy'}`}
        >
          Orders
        </button>
      </div>

      {activeTab === 'products' ? (
        <>
          {/* Data Table */}
          <div className="bg-white/60 border border-mochi-sky rounded-lg shadow-sm overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-mochi-navy text-mochi-cream text-xs uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4 font-medium w-16">Image</th>
                    <th className="px-6 py-4 font-medium">ID</th>
                    <th className="px-6 py-4 font-medium">Title</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Stock</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                {isLoading ? (
                  <tbody>
                    <tr><td colSpan="6" className="text-center py-20"><div className="inline-block w-6 h-6 border-2 border-mochi-ocean border-t-transparent rounded-full animate-spin"></div></td></tr>
                  </tbody>
                ) : (
                  <tbody className="divide-y divide-mochi-sky/50">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-white/80 transition-colors">
                        <td className="px-6 py-4">
                          {product.majorImageUrl ? (
                            <img src={product.majorImageUrl} alt={product.title} className="w-10 h-10 object-cover rounded shadow-sm" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 text-gray-500 font-bold flex items-center justify-center rounded shadow-sm">M</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-mochi-ocean font-mono text-xs">{product.id}</td>
                        <td className="px-6 py-4 font-medium">{product.title}</td>
                        <td className="px-6 py-4 font-mono">${Number(product.price).toFixed(2)}</td>
                        <td className="px-6 py-4">{product.stockQuantity}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => openEditModal(product)} className="text-mochi-ocean hover:text-mochi-teal transition-colors" title="Edit"><Edit2 size={16} /></button>
                            <button onClick={() => confirmDelete(product)} className="text-red-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Orders View */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-20"><div className="inline-block w-6 h-6 border-2 border-mochi-ocean border-t-transparent rounded-full animate-spin"></div></div>
            ) : orders.length === 0 ? (
              <p className="text-center text-mochi-navy/50 py-20 font-bold">No orders found.</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-mochi-sky/50">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-mochi-navy/60 font-bold">Order {order.orderNumber}</p>
                      <p className="text-xs text-mochi-navy/50">{new Date(order.orderDate).toLocaleString()}</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                      <div className="flex items-center gap-2 border px-3 py-1 rounded-sm border-mochi-sky text-sm">
                        {getStatusIcon(order.status)}
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-transparent focus:outline-none uppercase text-xs font-bold tracking-widest text-mochi-navy"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-mochi-sky/30 pt-4 mb-4">
                    <p className="text-xs text-mochi-navy/70 mb-2 font-bold uppercase tracking-widest">Customer</p>
                    <p className="text-sm font-medium">{order.shippingFirstName} {order.shippingLastName}</p>
                    <p className="text-sm">{order.shippingStreet}, {order.shippingCity} {order.shippingZipCode}</p>
                  </div>

                  <div className="border-t border-mochi-sky/30 pt-4">
                    <p className="text-xs text-mochi-navy/70 mb-2 font-bold uppercase tracking-widest">Items</p>
                    {order.orderItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm py-1">
                        <span>{item.quantity}x {item.productName}</span>
                        <span className="font-mono">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-lg font-bold pt-4 mt-2 border-t border-mochi-sky/30">
                      <span>Total</span>
                      <span className="font-mono text-mochi-teal">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Modals for Create/Edit/Delete omitted for brevity, logic remains from original */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-mochi-navy/80 backdrop-blur-sm"
          >
            <div className="bg-mochi-cream p-8 rounded-xl flex flex-col items-center shadow-2xl border border-mochi-sky">
              <div className="w-10 h-10 border-4 border-mochi-teal border-t-transparent rounded-full animate-spin mb-4"></div>
              <h2 className="text-xl font-bold text-mochi-navy uppercase tracking-widest">Logging Out...</h2>
              <p className="text-sm text-mochi-ocean mt-2">See you next time!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-mochi-navy/60 backdrop-blur-sm"
              onClick={() => setIsFormOpen(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-mochi-cream rounded-xl shadow-2xl p-8 border border-mochi-sky max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setIsFormOpen(false)} className="absolute top-6 right-6 text-mochi-ocean hover:text-mochi-navy transition-colors">
                <X size={20} />
              </button>
              
              <h2 className="text-2xl font-bold mb-6 text-mochi-navy">
                {formMode === 'create' ? 'Add New Product' : 'Edit Product'}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-mochi-ocean mb-1">Product Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-transparent border-b border-mochi-sky focus:outline-none focus:border-mochi-teal py-2" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-mochi-ocean mb-1">Product Image</label>
                  <div className="flex items-center gap-4">
                    {formData.majorImageUrl && <img src={formData.majorImageUrl} alt="Preview" className="w-12 h-12 object-cover rounded shadow" />}
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, 'majorImageUrl')} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-mochi-teal file:text-white hover:file:bg-mochi-ocean transition-colors cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-mochi-ocean mb-1">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-transparent border-b border-mochi-sky focus:outline-none focus:border-mochi-teal py-2 h-20" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-mochi-ocean mb-1">Price (USD)</label>
                    <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-transparent border-b border-mochi-sky focus:outline-none focus:border-mochi-teal py-2" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-mochi-ocean mb-1">Stock Qty</label>
                    <input type="number" required value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: e.target.value})} className="w-full bg-transparent border-b border-mochi-sky focus:outline-none focus:border-mochi-teal py-2" />
                  </div>
                </div>
                <div className="pt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-mochi-ocean">Cancel</button>
                  <button type="submit" className="bg-mochi-teal hover:bg-mochi-ocean text-white px-8 py-3 rounded-sm text-sm font-bold uppercase tracking-widest shadow-sm">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-mochi-navy/60 backdrop-blur-sm" onClick={() => setIsDeleteOpen(false)} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-sm bg-mochi-cream rounded-xl shadow-2xl p-8 border border-mochi-sky text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6"><AlertTriangle size={32} /></div>
              <h3 className="text-xl font-bold mb-2">Confirm Deletion</h3>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setIsDeleteOpen(false)} className="flex-1 py-3 bg-white border border-mochi-sky font-bold uppercase text-xs">Cancel</button>
                <button onClick={handleDeleteExecute} className="flex-1 py-3 bg-red-600 text-white font-bold uppercase text-xs">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
