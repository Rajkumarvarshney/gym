import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../../components/AdminNav';
import { Plus, Edit2, Trash2, X, Check, AlertCircle, ShoppingBag, ListOrdered, CheckCircle2 } from 'lucide-react';

const ManageProducts = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states (Product Add/Edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(19.99);
  const [stock, setStock] = useState(10);
  const [category, setCategory] = useState('Supplements');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'products') {
        const res = await axios.get('/api/products');
        if (res.data.success) setProducts(res.data.products);
      } else {
        const res = await axios.get('/api/admin/orders');
        if (res.data.success) setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Error fetching admin product/order data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName('');
    setPrice(19.99);
    setStock(10);
    setCategory('Supplements');
    setImage('https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=600');
    setDescription('');
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingId(prod._id);
    setName(prod.name);
    setPrice(prod.price);
    setStock(prod.stock);
    setCategory(prod.category);
    setImage(prod.images[0] || '');
    setDescription(prod.description);
    setFormError('');
    setFormSuccess('');
    setModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitLoading(true);

    if (!name || !price || !category || !image) {
      setFormError('Please fill in all required fields.');
      setSubmitLoading(false);
      return;
    }

    const prodData = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: [image],
      description,
    };

    try {
      let res;
      if (editingId) {
        res = await axios.put(`/api/admin/products/${editingId}`, prodData);
      } else {
        res = await axios.post('/api/admin/products', prodData);
      }

      if (res.data.success) {
        setFormSuccess(`Product ${editingId ? 'updated' : 'added'} successfully!`);
        fetchData();
        setTimeout(() => {
          setModalOpen(false);
        }, 1200);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save product configurations.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This removes it from store shelves.')) {
      return;
    }
    try {
      const res = await axios.delete(`/api/admin/products/${id}`);
      if (res.data.success) {
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await axios.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status.');
    }
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
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation */}
        <AdminNav />

        {/* Tab Controls and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gym-border/40 pb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all flex items-center space-x-2 ${
                activeTab === 'products'
                  ? 'bg-gym-neon text-gym-dark shadow-md'
                  : 'text-gray-400 hover:text-white bg-gym-card/40'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Products Catalog</span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all flex items-center space-x-2 ${
                activeTab === 'orders'
                  ? 'bg-gym-neon text-gym-dark shadow-md'
                  : 'text-gray-400 hover:text-white bg-gym-card/40'
              }`}
            >
              <ListOrdered className="h-4 w-4" />
              <span>Fulfillment Orders</span>
            </button>
          </div>

          {activeTab === 'products' && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase bg-gym-neon text-gym-dark hover:bg-gym-neonHover transition-colors shadow-lg"
            >
              <Plus className="h-4 w-4" />
              <span>Create Product</span>
            </button>
          )}
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gym-neon mx-auto"></div>
          </div>
        ) : activeTab === 'products' ? (
          
          /* Tab 1: Products Catalog Grid */
          products.length === 0 ? (
            <div className="text-center py-20 text-gray-500 border border-gym-border rounded-2xl bg-gym-card/20">
              <p className="text-lg">No products catalogued. Add some gear to stock shelves!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {products.map((prod) => (
                <div key={prod._id} className="glass-card rounded-2xl overflow-hidden border border-gym-border flex flex-col justify-between hover:border-gym-neon/15 hover:shadow-lg hover:shadow-gym-neon/5 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                  <div>
                    <div className="h-40 overflow-hidden bg-gym-dark">
                      <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[9px] uppercase font-bold text-gray-500">{prod.category}</span>
                      <h3 className="text-base font-bold text-white leading-tight truncate">{prod.name}</h3>
                      <p className="text-[11px] text-gray-400 line-clamp-2 h-8">{prod.description}</p>
                      
                      <div className="flex justify-between items-baseline pt-2 border-t border-gym-border/30">
                        <span className="text-lg font-extrabold text-white">${prod.price}</span>
                        <span className={`text-[10px] font-bold uppercase ${prod.stock > 5 ? 'text-gray-500' : 'text-gym-accent'}`}>
                          Stock: {prod.stock} left
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="flex-grow py-2 rounded-xl border border-gym-border hover:border-gym-neon bg-gym-dark hover:bg-gym-neon/10 text-gray-300 hover:text-gym-neon font-bold text-xs transition-all flex items-center justify-center space-x-1"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(prod._id)}
                      className="py-2 px-3 rounded-xl border border-gym-border hover:border-gym-accent bg-gym-dark hover:bg-gym-accent/10 text-gray-400 hover:text-gym-accent transition-all flex items-center justify-center"
                      title="Delete Product"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          
          /* Tab 2: Orders Fulfillment logs */
          orders.length === 0 ? (
            <div className="text-center py-20 text-gray-500 border border-gym-border rounded-2xl bg-gym-card/20">
              <p className="text-lg">No orders recorded in database ledger.</p>
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {orders.map((ord) => (
                <div key={ord._id} className="glass-card rounded-2xl p-6 border border-gym-border hover:border-gym-border/80 hover:shadow-md hover:shadow-black/30 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer">
                  
                  {/* Order Meta details */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-extrabold text-white text-sm">Order Ref: #{ord._id.substr(-6).toUpperCase()}</span>
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${getStatusColor(ord.status)}`}>
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-gray-400">Recipient: <strong className="text-white">{ord.user?.name || 'Guest'}</strong> ({ord.user?.email || 'N/A'})</p>
                    <p className="text-gray-500 text-[10px]">Date Ordered: {new Date(ord.createdAt).toLocaleString()}</p>
                    
                    {/* Item breakdown */}
                    <div className="pt-2">
                      <span className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Products Ordered</span>
                      <div className="flex flex-wrap gap-2">
                        {ord.items.map((it, idx) => (
                          <span key={idx} className="bg-gym-dark border border-gym-border px-2 py-1 rounded text-[10px] text-gray-300">
                            {it.product?.name || 'Product'} <strong className="text-white">x{it.quantity}</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Value and Status override trigger */}
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-gym-border/30 pt-4 md:pt-0">
                    <div className="text-right">
                      <span className="block text-[10px] uppercase text-gray-500">Total Collected</span>
                      <span className="text-xl font-extrabold text-gym-neon neon-glow">${ord.totalAmount.toFixed(2)}</span>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <span className="block text-[10px] uppercase text-gray-500 text-left md:text-right">Fulfill State</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleOrderStatusUpdate(ord._id, e.target.value)}
                        className="glass-input px-3 py-2 rounded-xl text-xs text-white bg-gym-card border border-gym-border"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )
        )}

        {/* Modal Overlay / Product Add/Edit CRUD form */}
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
                {editingId ? 'Edit Product Details' : 'Create Store Product'}
              </h2>

              {formError && (
                <div className="bg-gym-accent/10 border border-gym-accent/30 text-gym-accent px-4 py-3 rounded-lg flex items-center space-x-2 text-xs">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="bg-gym-neon/10 border border-gym-neon/30 text-gym-neon px-4 py-3 rounded-lg flex items-center space-x-2 text-xs font-semibold">
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <form onSubmit={handleSaveProduct} className="space-y-4">
                
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs"
                    placeholder="e.g. Whey Protein Isolate"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Stock Level</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs bg-gym-card"
                    >
                      <option value="Supplements" className="bg-gym-dark">Supplements</option>
                      <option value="Accessories" className="bg-gym-dark">Accessories</option>
                      <option value="Apparel" className="bg-gym-dark">Apparel</option>
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
                    placeholder="https://example.com/image.png"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs resize-none"
                    placeholder="Technical specifications, flavor ratings, size breakdowns..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full py-3.5 rounded-xl text-gym-dark bg-gym-neon hover:bg-gym-neonHover font-extrabold text-sm transition-all shadow-md focus:outline-none"
                >
                  {submitLoading ? 'Applying product configuration...' : 'Save Product specifications'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageProducts;
