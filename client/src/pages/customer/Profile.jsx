import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { User, Dumbbell, Calendar, FileText, ShoppingBag, ShieldCheck, Mail, Phone, Lock, Edit3 } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  // Edit profile states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [editSuccess, setEditSuccess] = useState('');
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Sync user profile state on load
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const [ordersRes, paymentsRes] = await Promise.all([
          axios.get('/api/orders/my-orders'),
          axios.get('/api/payments/my-payments'),
        ]);

        if (ordersRes.data.success) setOrders(ordersRes.data.orders);
        if (paymentsRes.data.success) setPayments(paymentsRes.data.payments);
      } catch (err) {
        console.error('Error fetching profile history:', err.message);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditSuccess('');
    setEditError('');

    if (password && password.length < 6) {
      setEditError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setEditError('Passwords do not match');
      return;
    }

    try {
      setEditLoading(true);
      const res = await updateProfile({ name, phone, password });
      if (res.success) {
        setEditSuccess('Profile details updated successfully!');
        setPassword('');
        setConfirmPassword('');
      } else {
        setEditError(res.message);
      }
    } catch (err) {
      setEditError('Failed to save profile changes.');
    } finally {
      setEditLoading(false);
    }
  };

  const calculateDaysLeft = (expiryDate) => {
    if (!expiryDate) return 0;
    const diff = new Date(expiryDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Shipped': return 'text-sky-500 bg-sky-500/10 border-sky-500/20';
      case 'Delivered': return 'text-gym-neon bg-gym-neon/10 border-gym-neon/20';
      case 'Cancelled': return 'text-gym-accent bg-gym-accent/10 border-gym-accent/20';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className="bg-gym-dark min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Profile Title Banner */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-gym-border/40">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="h-20 w-20 rounded-full object-cover border-4 border-gym-neon shadow-lg shadow-gym-neon/10" />
          ) : (
            <div className="h-20 w-20 rounded-full bg-gym-card border-2 border-gym-neon flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-gym-neon/10">
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-white uppercase tracking-tight font-display">{user?.name}</h1>
            <p className="text-sm text-gray-400">FITNESS MEMBER PORTAL</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Membership details + Profile update */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Membership Details */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-gym-border relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-gym-neon/5 rounded-full blur-2xl"></div>

              <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-4 border-b border-gym-border/40">
                <Dumbbell className="h-5 w-5 text-gym-neon" />
                <span>Gym Membership Status</span>
              </h2>

              <div className="pt-6">
                {user?.membership && user.membership.status === 'Active' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                    <div className="space-y-3">
                      <div className="inline-flex bg-gym-neon/10 border border-gym-neon/30 text-gym-neon text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Active Membership
                      </div>
                      <h3 className="text-2xl font-extrabold text-white uppercase leading-tight font-display">
                        {user.membership.planId?.name || 'Standard Plan'}
                      </h3>
                      <div className="space-y-1.5 text-xs text-gray-400">
                        <p className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
                          <span>Started: **{new Date(user.membership.startDate).toLocaleDateString()}**</span>
                        </p>
                        <p className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
                          <span>Expires: **{new Date(user.membership.expiryDate).toLocaleDateString()}**</span>
                        </p>
                      </div>
                    </div>

                    {/* Progress Circle Visual */}
                    <div className="bg-gym-card/50 rounded-2xl p-6 border border-gym-border/60 text-center space-y-1">
                      <span className="block text-4xl font-extrabold text-gym-neon neon-glow">
                        {calculateDaysLeft(user.membership.expiryDate)}
                      </span>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        Days Remaining
                      </span>
                      <div className="pt-4">
                        <Link
                          to="/#plans"
                          className="text-[10px] font-bold text-white hover:text-gym-neon border border-gym-border/85 hover:border-gym-neon bg-gym-dark px-4 py-2 rounded-xl transition-all block"
                        >
                          Extend or Renew Plan
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-4">
                    <p className="text-gray-400 text-sm">
                      You do not have an active membership subscription at the moment.
                    </p>
                    <a
                      href="/#plans"
                      className="inline-block bg-gym-neon hover:bg-gym-neonHover text-gym-dark font-extrabold px-6 py-3 rounded-xl transition-all duration-200 text-xs uppercase tracking-wider shadow-lg"
                    >
                      Join Membership Plan
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Profile update form */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-gym-border">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-4 border-b border-gym-border/40">
                <Edit3 className="h-5 w-5 text-gym-neon" />
                <span>Account Information</span>
              </h2>

              {editError && (
                <div className="mt-4 bg-gym-accent/10 border border-gym-accent/30 text-gym-accent px-4 py-3 rounded-lg text-xs">
                  {editError}
                </div>
              )}

              {editSuccess && (
                <div className="mt-4 bg-gym-neon/10 border border-gym-neon/30 text-gym-neon px-4 py-3 rounded-lg text-xs font-semibold">
                  {editSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <User className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="glass-input pl-9 block w-full px-4 py-3 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="glass-input pl-9 block w-full px-4 py-3 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">New Password (Optional)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="glass-input pl-9 block w-full px-4 py-3 rounded-xl text-white text-xs"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="glass-input pl-9 block w-full px-4 py-3 rounded-xl text-white text-xs"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gym-border/40 flex flex-col sm:flex-row sm:justify-end gap-3">
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="w-full sm:w-auto bg-gym-neon hover:bg-gym-neonHover text-gym-dark font-extrabold px-6 py-3 rounded-xl transition-all duration-200 text-xs uppercase tracking-wider min-h-[44px]"
                  >
                    {editLoading ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Right Column: Invoices / Orders list */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Payment Transactions ledger */}
            <div className="glass-card rounded-2xl p-6 border border-gym-border">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-4 border-b border-gym-border/40">
                <FileText className="h-4.5 w-4.5 text-gym-neon" />
                <span>Transaction History</span>
              </h2>

              {loadingHistory ? (
                <div className="py-10 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gym-neon mx-auto"></div>
                </div>
              ) : payments.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">No payment transactions recorded.</p>
              ) : (
                <div className="space-y-4 pt-4 max-h-[300px] overflow-y-auto pr-1">
                  {payments.map((pmt) => (
                    <div key={pmt._id} className="text-xs space-y-1.5 border-b border-gym-border/30 pb-3 last:border-b-0">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold uppercase text-gray-300">
                          {pmt.type === 'membership' ? 'Gym Plan Fee' : 'Store Gear Purchase'}
                        </span>
                        <span className="text-gym-neon font-extrabold">${pmt.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-500">
                        <span>{new Date(pmt.date).toLocaleDateString()}</span>
                        <span className="font-mono text-gray-600 truncate max-w-[120px]">{pmt.transactionId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Store Orders logs */}
            <div className="glass-card rounded-2xl p-6 border border-gym-border">
              <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-4 border-b border-gym-border/40">
                <ShoppingBag className="h-4.5 w-4.5 text-gym-neon" />
                <span>Store Orders</span>
              </h2>

              {loadingHistory ? (
                <div className="py-10 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-gym-neon mx-auto"></div>
                </div>
              ) : orders.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">No storefront orders found.</p>
              ) : (
                <div className="space-y-4 pt-4 max-h-[300px] overflow-y-auto pr-1">
                  {orders.map((ord) => (
                    <div key={ord._id} className="text-xs space-y-1.5 border-b border-gym-border/30 pb-3 last:border-b-0">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-gray-300">Order Ref #{ord._id.substr(-6).toUpperCase()}</span>
                        <span className="font-extrabold text-white">${ord.totalAmount.toFixed(2)}</span>
                      </div>
                      
                      {/* Sub-item names */}
                      <div className="text-[10px] text-gray-500 line-clamp-1 truncate max-w-full">
                        {ord.items.map(i => `${i.product?.name || 'Product'} (x${i.quantity})`).join(', ')}
                      </div>

                      <div className="flex justify-between items-center text-[10px] pt-1">
                        <span className="text-gray-500">{new Date(ord.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-0.5 rounded border font-semibold text-[9px] uppercase tracking-wider ${getStatusColor(ord.status)}`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
