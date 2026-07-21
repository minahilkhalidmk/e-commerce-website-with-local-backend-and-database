import { useState, useEffect } from 'react';
import API from './api/axiosConfig';

function App() {
  // --- CORE STATE ---
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('storefront'); // 'storefront', 'login', 'register', 'dashboard', 'forgot-password'
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- E-COMMERCE & CART STATE ---
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // --- ADMIN & AUTH STATE ---
  const [adminProducts, setAdminProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [adminForm, setAdminForm] = useState({ title: '', description: '', price: '', stockQuantity: '', maxQuantityPerUser: '' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    if (view === 'storefront') fetchProducts();
    if (view === 'dashboard' && token) fetchAdminProducts();
  }, [view, token]);

  const fetchProducts = async () => {
    try {
      const response = await API.get('/Product');
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load products", error);
    }
  };

  // ==========================================
  // SHOPPING CART LOGIC
  // ==========================================
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);
      const currentQtyInCart = existingItem ? existingItem.quantity : 0;
      const maxAllowed = Math.min(product.stockQuantity, product.maxQuantityPerUser);

      if (currentQtyInCart >= maxAllowed) {
        alert(`Limit reached! You can only buy up to ${maxAllowed} of this item.`);
        return prevCart;
      }

      setIsCartOpen(true);

      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(prev => prev.filter(item => item.id !== productId));
      return;
    }
    const product = products.find(p => p.id === productId);
    const maxAllowed = Math.min(product.stockQuantity, product.maxQuantityPerUser);
    
    if (newQuantity > maxAllowed) {
      alert(`Limit reached! You can only buy up to ${maxAllowed} of this item.`);
      return;
    }

    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      alert(`Success! Order placed for $${cartTotal.toFixed(2)}.`);
      setCart([]); 
      setIsCartOpen(false); 
      setIsLoading(false);
    }, 1500);
  };

  // ==========================================
  // ADMIN LOGIC
  // ==========================================
  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const fetchAdminProducts = async () => {
    try {
      const response = await API.get('/Product');
      setAdminProducts(response.data);
    } catch (error) { console.error("Failed to load admin products", error); }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        title: adminForm.title,
        description: adminForm.description,
        price: parseFloat(adminForm.price),
        stockQuantity: parseInt(adminForm.stockQuantity),
        maxQuantityPerUser: parseInt(adminForm.maxQuantityPerUser)
      };

      if (editingId) {
        await API.put(`/Product/${editingId}`, payload, getAuthHeaders());
        setMessage('Product updated successfully!');
      } else {
        await API.post('/Product', payload, getAuthHeaders());
        setMessage('Product created successfully!');
      }
      
      setAdminForm({ title: '', description: '', price: '', stockQuantity: '', maxQuantityPerUser: '' });
      setEditingId(null);
      fetchAdminProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving product.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/Product/${id}`, getAuthHeaders());
      fetchAdminProducts();
    } catch (error) { alert('Failed to delete product.'); }
  };

  // ==========================================
  // AUTHENTICATION & FORGOT PASSWORD LOGIC
  // ==========================================
  const handleAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const response = await API.post('/Auth/login', { email, password });
      const jwtToken = response.data.token;
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setView('dashboard');
    } catch (error) {
      setMessage('Login failed. Check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      // Calls your existing .NET Forgot Password endpoint
      await API.post('/Auth/forgot-password', { email });
      setMessage('If an account exists, a reset link has been sent to your email.');
    } catch (error) {
      setMessage('Error processing request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // RENDER: 1. PUBLIC STOREFRONT
  // ==========================================
  if (view === 'storefront') {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased relative">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">M</div>
            <span className="text-xl font-medium tracking-tight text-gray-900">Mochi Store</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
            {token ? (
              <button onClick={() => setView('dashboard')} className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full transition-colors">Console</button>
            ) : (
              <button onClick={() => setView('login')} className="text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-full transition-colors">Admin Login</button>
            )}
          </div>
        </header>

        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
            <div className="w-full max-w-md bg-white h-full shadow-2xl relative flex flex-col z-10 animate-slide-in-right">
              <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-medium">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
              </div>
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-400 mt-10">Your cart is empty.</p>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-100 rounded-md p-1">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="px-2 text-gray-600 hover:text-black font-bold">-</button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="px-2 text-gray-600 hover:text-black font-bold">+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cart.length > 0 && (
                <div className="p-6 border-t bg-gray-50">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium text-gray-600">Subtotal</span>
                    <span className="font-bold text-xl">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50">
                    {isLoading ? 'Processing...' : 'Secure Checkout'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-8 py-12">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-normal text-gray-900 mb-4 tracking-tight">Featured Products</h1>
            <p className="text-gray-500">Browse our latest inventory securely managed by the Mochi platform.</p>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No products available yet. Admins must add inventory.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => {
                const borderColors = ['border-blue-500', 'border-red-500', 'border-yellow-500', 'border-green-500'];
                const isOutOfStock = product.stockQuantity <= 0;
                return (
                  <div key={product.id} className={`bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 ${borderColors[index % 4]} flex flex-col`}>
                    <div className="p-6 flex-grow">
                      <div className="flex justify-between mb-4">
                        <h2 className="text-lg font-medium line-clamp-2">{product.title}</h2>
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded font-mono">${product.price.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-3 mb-4">{product.description}</p>
                      <div className="text-xs text-gray-400 font-medium">Limit: {product.maxQuantityPerUser} per customer</div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center">
                      <span className={`text-xs font-semibold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                        {isOutOfStock ? 'Out of stock' : `${product.stockQuantity} in stock`}
                      </span>
                      <button onClick={() => addToCart(product)} disabled={isOutOfStock} className="text-sm font-medium bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    );
  }

  // ==========================================
  // RENDER: 2. SECURE ADMIN DASHBOARD
  // ==========================================
  if (view === 'dashboard' && token) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased pb-20">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium tracking-tight"><span className="text-blue-600 font-bold">M</span>ochi Admin Console</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => { setView('storefront'); fetchProducts(); }} className="text-sm font-medium text-blue-600 hover:text-blue-700">View Storefront</button>
            <button onClick={() => { localStorage.removeItem('token'); setToken(null); setView('storefront'); }} className="text-sm font-medium text-red-600 hover:text-red-700">Sign out</button>
          </div>
        </header>

        <main className="max-w-5xl mx-auto mt-10 px-6">
          {/* Admin Form */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-10">
            <h2 className="text-2xl font-normal mb-6">{editingId ? 'Edit Product' : 'Create New Product'}</h2>
            {message && <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded text-sm">{message}</div>}
            
            <form onSubmit={handleAdminSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Product Title</label>
                <input required type="text" value={adminForm.title} onChange={e => setAdminForm({...adminForm, title: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Description</label>
                <textarea required rows="2" value={adminForm.description} onChange={e => setAdminForm({...adminForm, description: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Price ($)</label>
                <input required type="number" step="0.01" value={adminForm.price} onChange={e => setAdminForm({...adminForm, price: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Stock Quantity</label>
                <input required type="number" value={adminForm.stockQuantity} onChange={e => setAdminForm({...adminForm, stockQuantity: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Max Per User</label>
                <input required type="number" value={adminForm.maxQuantityPerUser} onChange={e => setAdminForm({...adminForm, maxQuantityPerUser: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500" />
              </div>
              <div className="md:col-span-2 mt-4 flex justify-end gap-3">
                {editingId && <button type="button" onClick={() => { setEditingId(null); setAdminForm({title:'', description:'', price:'', stockQuantity:'', maxQuantityPerUser:''})}} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md">Cancel</button>}
                <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">
                  {isLoading ? 'Saving...' : (editingId ? 'Update Product' : 'Save Product')}
                </button>
              </div>
            </form>
          </div>

          {/* Admin Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50"><h3 className="text-lg font-medium">Current Inventory</h3></div>
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
                <tr><th className="px-6 py-3">Title</th><th className="px-6 py-3">Price</th><th className="px-6 py-3">Stock</th><th className="px-6 py-3 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {adminProducts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{p.title}</td>
                    <td className="px-6 py-4">${p.price.toFixed(2)}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${p.stockQuantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{p.stockQuantity}</span></td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => { setEditingId(p.id); setAdminForm(p); window.scrollTo(0,0); }} className="text-blue-600 hover:text-blue-800 font-medium mr-4">Edit</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // RENDER: 3. FORGOT PASSWORD VIEW
  // ==========================================
  if (view === 'forgot-password') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans p-4 antialiased">
        <div className="w-full max-w-[450px] bg-white border border-gray-200 shadow-sm rounded-xl px-10 py-12 flex flex-col">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-medium text-gray-900 tracking-tight">Reset Password</h2>
            <p className="text-sm text-gray-500 mt-2">Enter your email to receive a secure recovery link.</p>
          </div>
          <form onSubmit={handleForgotPassword} className="space-y-5">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 text-sm text-gray-900 rounded-md border border-gray-300 outline-none focus:border-blue-500" placeholder="Email address" required />
            
            {message && (
              <div className={`p-3 rounded-md text-xs font-medium ${message.includes('sent') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message}
              </div>
            )}
            
            <div className="flex justify-between items-center pt-4">
              <button type="button" onClick={() => { setView('login'); setMessage(''); }} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Back to Login</button>
              <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md text-sm transition-colors disabled:opacity-50">
                {isLoading ? 'Sending...' : 'Send Link'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: 4. LOGIN / REGISTER VIEW
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans p-4 antialiased">
      <div className="w-full max-w-[450px] bg-white border border-gray-200 shadow-sm rounded-xl px-10 py-12 flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-gray-900 tracking-tight">Sign in to Console</h2>
        </div>
        <form onSubmit={handleAuth} className="space-y-5">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 text-sm text-gray-900 rounded-md border border-gray-300 outline-none focus:border-blue-500" placeholder="Email address" required />
          
          <div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 text-sm text-gray-900 rounded-md border border-gray-300 outline-none focus:border-blue-500" placeholder="Password" required />
            <div className="text-right mt-2">
               <button type="button" onClick={() => { setView('forgot-password'); setMessage(''); }} className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">Forgot password?</button>
            </div>
          </div>
          
          {message && <div className="p-3 rounded-md text-xs font-medium bg-red-50 text-red-800 border border-red-200">{message}</div>}
          
          <div className="flex justify-between items-center pt-4">
            <button type="button" onClick={() => setView('storefront')} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Back to Store</button>
            <button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-md text-sm transition-colors disabled:opacity-50">
              {isLoading ? '...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;