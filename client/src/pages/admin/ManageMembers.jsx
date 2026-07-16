import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../../components/AdminNav';
import { Search, UserCheck, ShieldAlert, Sparkles, Check, X, AlertCircle } from 'lucide-react';

const ManageMembers = () => {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit State Modal
  const [editingMember, setEditingMember] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [durationMonths, setDurationMonths] = useState(1);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchMembersAndPlans();
  }, [search]);

  const fetchMembersAndPlans = async () => {
    try {
      setLoading(true);
      const [membersRes, plansRes] = await Promise.all([
        axios.get(`/api/admin/members?search=${search}`),
        axios.get('/api/plans'),
      ]);

      if (membersRes.data.success) setMembers(membersRes.data.members);
      if (plansRes.data.success) {
        setPlans(plansRes.data.plans);
      }
    } catch (err) {
      console.error('Error fetching members/plans:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (member) => {
    setEditingMember(member);
    setSelectedPlanId(member.membership?.planId?._id || (plans[0]?._id || ''));
    setSelectedStatus(member.membership?.status || 'Active');
    setDurationMonths(member.membership?.planId?.duration || 1);
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSaveMembership = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');
    setSubmitLoading(true);

    if (!selectedPlanId) {
      setSubmitError('Please select a membership plan.');
      setSubmitLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/admin/members/membership', {
        userId: editingMember._id,
        planId: selectedPlanId,
        status: selectedStatus,
        durationMonths,
      });

      if (res.data.success) {
        setSubmitSuccess('Membership updated successfully!');
        // Refresh local listings
        fetchMembersAndPlans();
        setTimeout(() => {
          setEditingMember(null);
        }, 1200);
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to update membership.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-gym-dark min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation */}
        <AdminNav />

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-extrabold text-white uppercase font-display">
            Manage <span className="text-gym-neon">Members</span>
          </h1>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search members by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input pl-9 pr-4 py-2.5 block w-full rounded-xl text-xs text-white"
            />
          </div>
        </div>

        {/* Members Directory */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gym-neon mx-auto"></div>
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20 text-gray-500 border border-gym-border rounded-2xl bg-gym-card/20">
            <p className="text-lg">No gym members found matching search parameters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Desktop Table (Visible >= 768px) */}
            <div className="hidden md:block glass-card rounded-2xl border border-gym-border overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gym-border bg-gym-dark/60 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <th className="p-4 sm:p-5">Name & Email</th>
                    <th className="p-4 sm:p-5">Phone</th>
                    <th className="p-4 sm:p-5">Membership Plan</th>
                    <th className="p-4 sm:p-5">Status</th>
                    <th className="p-4 sm:p-5">Expiry Date</th>
                    <th className="p-4 sm:p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gym-border/30 text-xs text-gray-300">
                  {members.map((member) => (
                    <tr key={member._id} onClick={() => handleOpenEditModal(member)} className="hover:bg-gym-border/25 transition-colors cursor-pointer">
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center space-x-3">
                          {member.profileImage ? (
                            <img src={member.profileImage} alt={member.name} className="h-8 w-8 rounded-full object-cover border border-gym-neon" />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gym-border flex items-center justify-center font-bold text-white uppercase border border-gym-border">
                              {member.name ? member.name.charAt(0) : '?'}
                            </div>
                          )}
                          <div>
                            <span className="font-semibold text-white block">{member.name}</span>
                            <span className="text-[10px] text-gray-500 block">{member.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 sm:p-5 font-mono">{member.phone || 'N/A'}</td>
                      <td className="p-4 sm:p-5 font-semibold text-white">
                        {member.membership?.planId?.name || 'No Plan Active'}
                      </td>
                      <td className="p-4 sm:p-5">
                        <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${
                          member.membership?.status === 'Active'
                            ? 'text-gym-neon bg-gym-neon/10 border-gym-neon/20'
                            : 'text-gray-500 bg-gray-500/10 border-transparent'
                        }`}>
                          {member.membership?.status || 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 sm:p-5 font-mono">
                        {member.membership?.expiryDate
                          ? new Date(member.membership.expiryDate).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="p-4 sm:p-5 text-right">
                        <button
                          onClick={() => handleOpenEditModal(member)}
                          className="text-xs font-bold text-gym-neon border border-gym-neon/30 hover:border-gym-neon bg-gym-neon/5 hover:bg-gym-neon/10 px-3 py-1.5 rounded-xl transition-all"
                        >
                          Alter Plan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards (Visible < 768px) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {members.map((member) => (
                <div key={member._id} onClick={() => handleOpenEditModal(member)} className="glass-card rounded-2xl p-5 border border-gym-border space-y-4 hover:border-gym-neon/25 hover:shadow-lg hover:shadow-gym-neon/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center space-x-3 pb-3 border-b border-gym-border/30">
                    {member.profileImage ? (
                      <img src={member.profileImage} alt={member.name} className="h-10 w-10 rounded-full object-cover border border-gym-neon" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gym-border flex items-center justify-center font-bold text-white uppercase">
                        {member.name ? member.name.charAt(0) : '?'}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-white">{member.name}</h4>
                      <p className="text-[10px] text-gray-500">{member.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <div>
                      <span className="text-gray-500 block">Phone</span>
                      <span className="font-mono text-gray-300">{member.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Membership</span>
                      <span className="font-semibold text-white">{member.membership?.planId?.name || 'No Active Plan'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Status</span>
                      <span className={`inline-block px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${
                        member.membership?.status === 'Active'
                          ? 'text-gym-neon bg-gym-neon/10 border-gym-neon/20'
                          : 'text-gray-500 bg-gray-500/10 border-transparent'
                      }`}>
                        {member.membership?.status || 'Inactive'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Expiry</span>
                      <span className="font-mono text-gray-300">
                        {member.membership?.expiryDate
                          ? new Date(member.membership.expiryDate).toLocaleDateString()
                          : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenEditModal(member)}
                    className="w-full text-center py-2.5 rounded-xl text-xs font-bold bg-gym-neon/10 border border-gym-neon/30 text-gym-neon hover:border-gym-neon hover:bg-gym-neon/15 transition-all"
                  >
                    Alter Plan Settings
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Modal Overlay / Plan Editor Block */}
        {editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
            <div className="glass-card max-w-md w-full rounded-2xl border border-gym-border p-6 sm:p-8 space-y-6 relative overflow-hidden animate-fade-in">
              <button
                onClick={() => setEditingMember(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-1">
                <span className="text-gym-neon text-[10px] uppercase font-bold tracking-widest flex items-center space-x-1">
                  <UserCheck className="h-4 w-4" />
                  <span>Manual Adjust Plan</span>
                </span>
                <h2 className="text-xl font-bold text-white uppercase font-display truncate">
                  {editingMember.name}
                </h2>
              </div>

              {submitError && (
                <div className="bg-gym-accent/10 border border-gym-accent/30 text-gym-accent px-4 py-3 rounded-lg flex items-center space-x-2 text-xs">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="bg-gym-neon/10 border border-gym-neon/30 text-gym-neon px-4 py-3 rounded-lg flex items-center space-x-2 text-xs font-semibold">
                  <Check className="h-4.5 w-4.5 shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveMembership} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Select plan</label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => {
                      setSelectedPlanId(e.target.value);
                      const targetPlan = plans.find(p => p._id === e.target.value);
                      if (targetPlan) setDurationMonths(targetPlan.duration);
                    }}
                    className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs bg-gym-card"
                  >
                    {plans.map((p) => (
                      <option key={p._id} value={p._id} className="bg-gym-dark">
                        {p.name} (${p.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Status</label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs bg-gym-card"
                    >
                      <option value="Active" className="bg-gym-dark text-gym-neon">Active</option>
                      <option value="Inactive" className="bg-gym-dark text-gym-accent">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Duration (Months)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={60}
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(e.target.value)}
                      className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full py-3.5 rounded-xl text-gym-dark bg-gym-neon hover:bg-gym-neonHover font-extrabold text-sm transition-all shadow-md focus:outline-none"
                >
                  {submitLoading ? 'Applying Overrides...' : 'Confirm Overrides'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageMembers;
