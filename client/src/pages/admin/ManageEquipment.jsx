import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../../components/AdminNav';
import { Plus, Edit2, Trash2, X, Check, AlertCircle } from 'lucide-react';

const ManageEquipment = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states (Add/Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Cardio');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState('Excellent');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/equipment');
      if (res.data.success) {
        setEquipmentList(res.data.equipment);
      }
    } catch (err) {
      console.error('Error fetching equipment:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setCategory('Cardio');
    setImage('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600');
    setDescription('');
    setQuantity(1);
    setCondition('Excellent');
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item._id);
    setName(item.name);
    setCategory(item.category);
    setImage(item.image);
    setDescription(item.description);
    setQuantity(item.quantity);
    setCondition(item.condition);
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  const handleSaveEquipment = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitLoading(true);

    if (!name || !category || !image) {
      setFormError('Please fill in all required fields.');
      setSubmitLoading(false);
      return;
    }

    const itemData = {
      name,
      category,
      image,
      description,
      quantity: parseInt(quantity),
      condition,
    };

    try {
      let res;
      if (editingId) {
        res = await axios.put(`/api/admin/equipment/${editingId}`, itemData);
      } else {
        res = await axios.post('/api/admin/equipment', itemData);
      }

      if (res.data.success) {
        setFormSuccess(`Equipment ${editingId ? 'updated' : 'added'} successfully!`);
        fetchEquipment();
        setTimeout(() => {
          setModalOpen(false);
        }, 1200);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save equipment configuration.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this equipment item? This changes public listings.')) {
      return;
    }
    try {
      const res = await axios.delete(`/api/admin/equipment/${id}`);
      if (res.data.success) {
        fetchEquipment();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete equipment.');
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
            Manage <span className="text-gym-neon">Equipment</span>
          </h1>
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center space-x-1.5 px-4 py-3 sm:py-2.5 rounded-xl text-xs font-bold uppercase bg-gym-neon text-gym-dark hover:bg-gym-neonHover transition-colors shadow-lg hover:shadow-gym-neon/10 min-h-[44px] sm:min-h-0 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Equipment</span>
          </button>
        </div>

        {/* Equipment List table */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gym-neon mx-auto"></div>
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="text-center py-20 text-gray-500 border border-gym-border rounded-2xl bg-gym-card/20">
            <p className="text-lg">No equipment found. Add some machines to display in the main lobby showcase!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {equipmentList.map((item) => (
              <div key={item._id} className="glass-card rounded-2xl overflow-hidden border border-gym-border hover:border-gym-neon/20 hover:shadow-lg hover:shadow-gym-neon/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between cursor-pointer">
                <div>
                  <div className="h-44 overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute top-3 right-3 bg-gym-dark/90 text-gym-neon text-[10px] uppercase font-bold border border-gym-border px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-lg font-bold text-white leading-tight truncate">{item.name}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 h-8">{item.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-gym-border/30">
                      <div>
                        <span className="text-gray-500 block">Quantity</span>
                        <strong className="text-white text-xs">{item.quantity} units</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Condition</span>
                        <strong className="text-gym-neon text-xs">{item.condition}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="flex-grow py-2.5 rounded-xl border border-gym-border hover:border-gym-neon bg-gym-dark hover:bg-gym-neon/10 text-gray-300 hover:text-gym-neon font-bold text-xs transition-all flex items-center justify-center space-x-1"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteEquipment(item._id)}
                    className="py-2.5 px-3 rounded-xl border border-gym-border hover:border-gym-accent bg-gym-dark hover:bg-gym-accent/10 text-gray-400 hover:text-gym-accent transition-all flex items-center justify-center"
                    title="Delete Machine"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Overlay / Equipment CRUD form */}
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
                {editingId ? 'Edit Equipment Info' : 'Add Gym Equipment'}
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

              <form onSubmit={handleSaveEquipment} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Equipment Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs"
                      placeholder="e.g. Treadmill T80"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs bg-gym-card"
                    >
                      <option value="Cardio" className="bg-gym-dark">Cardio</option>
                      <option value="Strength" className="bg-gym-dark">Strength</option>
                      <option value="Weights" className="bg-gym-dark">Weights</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Quantity</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Condition State</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs bg-gym-card"
                    >
                      <option value="Excellent" className="bg-gym-dark text-gym-neon">Excellent</option>
                      <option value="Good" className="bg-gym-dark text-white">Good</option>
                      <option value="Needs Maintenance" className="bg-gym-dark text-amber-500">Needs Maintenance</option>
                      <option value="Broken" className="bg-gym-dark text-gym-accent">Broken</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs resize-none"
                    placeholder="Technical description and conditioning notes..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full py-3.5 rounded-xl text-gym-dark bg-gym-neon hover:bg-gym-neonHover font-extrabold text-sm transition-all shadow-md focus:outline-none"
                >
                  {submitLoading ? 'Applying configuration...' : 'Save Equipment details'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageEquipment;
