import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, User, MapPin, CheckCircle, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axiosConfig';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('account');
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();


  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    zipCode: '',
    newPassword: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes] = await Promise.all([
          API.get('/Profile')
        ]);
        
        setProfile({
          firstName: profileRes.data.firstName || '',
          lastName: profileRes.data.lastName || '',
          email: profileRes.data.email || '',
          street: profileRes.data.street || '',
          city: profileRes.data.city || '',
          zipCode: profileRes.data.zipCode || '',
          newPassword: ''
        });
        

      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleSaveAccount = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await API.put('/Profile', {
        firstName: profile.firstName,
        lastName: profile.lastName,
        street: profile.street,
        city: profile.city,
        zipCode: profile.zipCode,
        newPassword: profile.newPassword
      });
      
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setProfile(prev => ({ ...prev, newPassword: '' })); // clear password field
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-8 h-8 border-t-2 border-black rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-gray-200">
      <Navbar />

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24 flex flex-col md:flex-row gap-12 lg:gap-20">
        
        {/* Left Side Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="mb-10">
            <h1 className="text-3xl font-medium tracking-tight mb-2">My Account</h1>
            <p className="text-gray-500 text-sm">Welcome back, {profile.firstName || 'User'}.</p>
          </div>

          <nav className="flex flex-col space-y-1">

            <button 
              onClick={() => setActiveTab('account')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-md ${activeTab === 'account' ? 'bg-gray-50 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50/50'}`}
            >
              <User size={18} /> Account Details
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-md ${activeTab === 'addresses' ? 'bg-gray-50 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50/50'}`}
            >
              <MapPin size={18} /> Saved Address
            </button>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-md mt-8"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Right Content Area */}
        <div className="flex-1 min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* ORDERS TAB */}


            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <motion.div key="account" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="max-w-2xl">
                <h2 className="text-xl font-medium mb-8">Account Details</h2>
                
                <form onSubmit={handleSaveAccount} className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">First Name</label>
                      <input 
                        type="text" 
                        value={profile.firstName} 
                        onChange={e => setProfile({...profile, firstName: e.target.value})} 
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Last Name</label>
                      <input 
                        type="text" 
                        value={profile.lastName} 
                        onChange={e => setProfile({...profile, lastName: e.target.value})} 
                        className="w-full px-4 py-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      disabled 
                      value={profile.email} 
                      className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-md text-gray-500 cursor-not-allowed" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">New Password (Optional)</label>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      value={profile.newPassword} 
                      onChange={e => setProfile({...profile, newPassword: e.target.value})} 
                      className="w-full px-4 py-3 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors" 
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="bg-black text-white px-8 py-3 rounded-md text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-70 flex items-center justify-center min-w-[150px]"
                    >
                      {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <motion.div key="addresses" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="max-w-2xl">
                <h2 className="text-xl font-medium mb-8">Saved Address</h2>

                <form onSubmit={handleSaveAccount} className="bg-white border border-black rounded-xl shadow-sm p-6 relative">
                  <div className="absolute top-6 right-6 text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1 rounded-sm">Default</div>
                  <h3 className="font-medium text-lg mb-4">Home Delivery</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Street Address</label>
                      <input 
                        type="text" 
                        value={profile.street} 
                        onChange={e => setProfile({...profile, street: e.target.value})} 
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black" 
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">City</label>
                        <input 
                          type="text" 
                          value={profile.city} 
                          onChange={e => setProfile({...profile, city: e.target.value})} 
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Zip Code</label>
                        <input 
                          type="text" 
                          value={profile.zipCode} 
                          onChange={e => setProfile({...profile, zipCode: e.target.value})} 
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-black" 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="text-sm font-medium bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                      {isSaving ? 'Saving...' : 'Update Address'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Success Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 bg-black text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 z-50"
          >
            <CheckCircle size={20} className="text-green-400" />
            <span className="text-sm font-medium tracking-wide">Updated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
