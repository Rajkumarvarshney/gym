import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../../components/AdminNav';
import { Users, TrendingUp, CreditCard, ShieldAlert, Clock, ShoppingCart, UserPlus } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/admin/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gym-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gym-neon"></div>
      </div>
    );
  }

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
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation */}
        <AdminNav />

        {/* Dashboard Title */}
        <h1 className="text-3xl font-extrabold text-white uppercase font-display">
          Overview & <span className="text-gym-neon">Analytics</span>
        </h1>

        {stats && (
          <div className="space-y-8 pt-4">
            
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-card p-6 rounded-2xl border border-gym-border flex items-center space-x-4">
                <div className="p-3 bg-gym-neon/10 border border-gym-neon/20 text-gym-neon rounded-xl shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Total Members</span>
                  <span className="text-2xl font-extrabold text-white leading-tight">{stats.totalMembers}</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-gym-border flex items-center space-x-4">
                <div className="p-3 bg-gym-neon/10 border border-gym-neon/20 text-gym-neon rounded-xl shrink-0">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Active Gym Plans</span>
                  <span className="text-2xl font-extrabold text-gym-neon leading-tight neon-glow">{stats.activeMembers}</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-gym-border flex items-center space-x-4">
                <div className="p-3 bg-gym-accent/10 border border-gym-accent/20 text-gym-accent rounded-xl shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Expired Plans</span>
                  <span className="text-2xl font-extrabold text-white leading-tight">{stats.inactiveMembers}</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-2xl border border-gym-border flex items-center space-x-4">
                <div className="p-3 bg-gym-neon/10 border border-gym-neon/20 text-gym-neon rounded-xl shrink-0">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-gray-500">Total Revenue</span>
                  <span className="text-2xl font-extrabold text-white leading-tight">${stats.totalRevenue.toFixed(2)}</span>
                </div>
              </div>

            </div>

            {/* Lists Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Members */}
              <div className="glass-card rounded-2xl p-6 border border-gym-border">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider pb-4 border-b border-gym-border/40 flex items-center space-x-2">
                  <UserPlus className="h-5 w-5 text-gym-neon" />
                  <span>Recent Joinings</span>
                </h3>
                {stats.recentJoinings.length === 0 ? (
                  <p className="text-xs text-gray-500 py-8 text-center">No recent joinings found.</p>
                ) : (
                  <div className="divide-y divide-gym-border/30 pt-2">
                    {stats.recentJoinings.map((user) => (
                      <div key={user._id} className="flex justify-between items-center py-4 text-xs">
                        <div>
                          <p className="font-bold text-white">{user.name}</p>
                          <p className="text-gray-500 text-[10px]">{user.email}</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2.5 py-0.5 rounded border text-[9px] font-semibold uppercase tracking-wider ${
                            user.membership?.status === 'Active'
                              ? 'text-gym-neon bg-gym-neon/10 border-gym-neon/20'
                              : 'text-gray-400 bg-gray-500/10 border-transparent'
                          }`}>
                            {user.membership?.status === 'Active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Orders */}
              <div className="glass-card rounded-2xl p-6 border border-gym-border">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider pb-4 border-b border-gym-border/40 flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-gym-neon" />
                  <span>Recent Orders</span>
                </h3>
                {stats.recentOrders.length === 0 ? (
                  <p className="text-xs text-gray-500 py-8 text-center">No recent orders placed.</p>
                ) : (
                  <div className="divide-y divide-gym-border/30 pt-2">
                    {stats.recentOrders.map((ord) => (
                      <div key={ord._id} className="flex justify-between items-center py-4 text-xs">
                        <div>
                          <p className="font-bold text-white">Order #{ord._id.substr(-6).toUpperCase()}</p>
                          <p className="text-gray-500 text-[10px]">Client: {ord.user?.name || 'Guest'}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-extrabold text-white">${ord.totalAmount.toFixed(2)}</p>
                          <span className={`px-2 py-0.5 rounded border text-[9px] font-semibold uppercase tracking-wider ${getStatusColor(ord.status)}`}>
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
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
