import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../../components/AdminNav';
import { Plus, Edit2, Trash2, X, PlusCircle, Check, AlertCircle } from 'lucide-react';

const ManagePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states (Add/Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(1);
  const [price, setPrice] = useState(29.99);
  const [description, setDescription] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [benefits, setBenefits] = useState([]);

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/plans');
      if (res.data.success) {
        setPlans(res.data.plans);
      }
    } catch (err) {
      console.error('Error fetching plans:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingPlanId(null);
    setName('');
    setDuration(1);
    setPrice(29.99);
    setDescription('');
    setBenefits([]);
    setBenefitInput('');
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlanId(plan._id);
    setName(plan.name);
    setDuration(plan.duration);
    setPrice(plan.price);
    setDescription(plan.description);
    setBenefits(plan.benefits || []);
    setBenefitInput('');
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim() && !benefits.includes(benefitInput.trim())) {
      setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput('');
    }
  };

  const handleRemoveBenefit = (idx) => {
    setBenefits(benefits.filter((_, i) => i !== idx));
  };

  const handleSavePlan = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitLoading(true);

    if (!name || !description || benefits.length === 0) {
      setFormError('Please fill in all fields and add at least one benefit.');
      setSubmitLoading(false);
      return;
    }

    const planData = { name, duration, price: parseFloat(price), description, benefits };

    try {
      let res;
      if (editingPlanId) {
        // Edit Plan
        res = await axios.put(`/api/admin/plans/${editingPlanId}`, planData);
      } else {
        // Create Plan
        res = await axios.post('/api/admin/plans', planData);
      }

      if (res.data.success) {
        setFormSuccess(`Plan ${editingPlanId ? 'updated' : 'created'} successfully!`);
        fetchPlans();
        setTimeout(() => {
          setModalOpen(false);
        }, 1200);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save plan configuration.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this membership plan? This action cannot be undone.')) {
      return;
    }
    try {
      const res = await axios.delete(`/api/admin/plans/${id}`);
      if (res.data.success) {
        fetchPlans();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete plan.');
    }
  };

  return (
    <div className="bg-gym-dark min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation */}
        <AdminNav />

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-display">
            Manage <span className="text-gym-neon">Plans</span>
          </h1>
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center space-x-1.5 px-4 py-3 sm:py-2.5 rounded-xl text-xs font-bold uppercase bg-gym-neon text-gym-dark hover:bg-gym-neonHover transition-colors shadow-lg hover:shadow-gym-neon/10 min-h-[44px] sm:min-h-0 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Create Plan</span>
          </button>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gym-neon mx-auto"></div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20 text-gray-500 border border-gym-border rounded-2xl bg-gym-card/20">
            <p className="text-lg">No membership plans active inside the system. Create one to begin!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {plans.map((plan) => (
              <div key={plan._id} className="glass-card rounded-2xl p-6 border border-gym-border flex flex-col justify-between hover:border-gym-neon/25 hover:shadow-lg hover:shadow-gym-neon/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b border-gym-border/30 pb-3">
                    <h3 className="text-lg font-bold text-white uppercase">{plan.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOpenEdit(plan)}
                        className="p-2 text-gray-400 hover:text-gym-neon bg-gym-dark rounded-lg border border-gym-border hover:border-gym-neon/30 transition-all"
                        title="Edit Plan"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePlan(plan._id)}
                        className="p-2 text-gray-400 hover:text-gym-accent bg-gym-dark rounded-lg border border-gym-border hover:border-gym-accent/30 transition-all"
                        title="Delete Plan"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-extrabold text-white">${plan.price}</span>
                    <span className="text-xs text-gray-500">/ {plan.duration} Month{plan.duration > 1 ? 's' : ''}</span>
                  </div>

                  <p className="text-xs text-gray-400 h-10 overflow-y-auto leading-relaxed">{plan.description}</p>

                  <ul className="space-y-2 text-[11px] text-gray-300 pt-3 border-t border-gym-border/30 max-h-40 overflow-y-auto">
                    {plan.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-gym-neon"></span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Overlay / Form CRUD Editor */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
            <div className="glass-card max-w-lg w-full rounded-2xl border border-gym-border p-6 sm:p-8 space-y-6 relative overflow-hidden animate-fade-in">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-bold text-white uppercase font-display border-b border-gym-border/30 pb-3">
                {editingPlanId ? 'Edit Plan Settings' : 'Create Membership Plan'}
              </h2>

              {formError && (
                <div className="bg-gym-accent/10 border border-gym-accent/30 text-gym-accent px-4 py-3 rounded-lg flex items-center space-x-2 text-xs">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="bg-gym-neon/10 border border-gym-neon/30 text-gym-neon px-4 py-3 rounded-lg flex items-center space-x-2 text-xs font-semibold">
                  <Check className="h-4.5 w-4.5 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSavePlan} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Plan Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs"
                      placeholder="e.g. Silver Plan"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Price ($)</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Duration (Months)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={60}
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Add Benefit</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={benefitInput}
                        onChange={(e) => setBenefitInput(e.target.value)}
                        className="glass-input flex-grow px-3 py-2 rounded-xl text-white text-xs"
                        placeholder="e.g. Free Towel"
                      />
                      <button
                        type="button"
                        onClick={handleAddBenefit}
                        className="bg-gym-neon/15 hover:bg-gym-neon text-gym-neon hover:text-gym-dark border border-gym-neon/20 px-3 rounded-xl text-xs font-bold transition-all"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Benefits List Display */}
                {benefits.length > 0 && (
                  <div className="space-y-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-500">Plan Benefits Checklist</span>
                    <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-gym-dark/50 border border-gym-border/40 rounded-xl">
                      {benefits.map((b, idx) => (
                        <span key={idx} className="inline-flex items-center space-x-1 bg-gym-border px-2.5 py-1 rounded-lg text-[10px] text-white">
                          <span>{b}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(idx)}
                            className="text-gym-accent hover:text-white transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs resize-none"
                    placeholder="Short description of plan tier features..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full py-3.5 rounded-xl text-gym-dark bg-gym-neon hover:bg-gym-neonHover font-extrabold text-sm transition-all shadow-md focus:outline-none"
                >
                  {submitLoading ? 'Applying configurations...' : 'Save Plan settings'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManagePlans;
