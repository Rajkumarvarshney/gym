import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { Search, ShoppingCart, Info, CheckCircle2 } from 'lucide-react';

const Store = () => {
  const { addToCart, cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [addedItem, setAddedItem] = useState(null); // Track quick notification

  const categories = ['All', 'Supplements', 'Accessories', 'Apparel'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // We filter categories locally or can fetch with query params
        const res = await axios.get('/api/products');
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Error loading products:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedItem(product._id);
    setTimeout(() => {
      setAddedItem(null);
    }, 1500);
  };

  // Filtered Products List
  const filteredProducts = products.filter((p) => {
    const matchesSearch = (p.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gym-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gym-neon"></div>
      </div>
    );
  }

  return (
    <div className="bg-gym-dark min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="text-center space-y-3 px-2">
          <span className="text-gym-neon uppercase font-bold text-xs tracking-wider">FitZone Gear &amp; Nutrition</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white uppercase font-display">
            The Supplement <span className="text-gym-neon">Store</span>
          </h1>
          <p className="max-w-md mx-auto text-gray-400 text-sm">
            Fuel your gains with our curated collection of professional supplements, straps, shaker bottles, and workout apparel.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 sm:py-6 border-y border-gym-border/40">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all duration-200 min-h-[36px] ${
                  category === cat
                    ? 'bg-gym-neon text-gym-dark shadow-md shadow-gym-neon/10'
                    : 'bg-gym-card text-gray-300 hover:bg-gym-border border border-gym-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input pl-9 pr-4 py-2.5 block w-full rounded-xl text-xs text-white"
            />
          </div>
        </div>

        {/* E-Commerce Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No products match your filters.</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => {
              const inCartItem = cartItems.find((item) => item.product._id === product._id);
              const remainingStock = product.stock - (inCartItem?.quantity || 0);

              return (
                <div
                  key={product._id}
                  className="glass-card rounded-2xl overflow-hidden border border-gym-border flex flex-col justify-between hover:border-gym-neon/30 hover:shadow-xl hover:shadow-gym-neon/5 hover:-translate-y-0.5 transition-all duration-300 group relative cursor-pointer"
                >
                  <div>
                    {/* Image Box */}
                    <div className="h-56 overflow-hidden relative bg-gym-dark flex items-center justify-center">
                      <img
                        src={product.images[0] || 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=600'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute top-3 left-3 bg-gym-dark/80 text-gray-300 text-[10px] uppercase font-bold border border-gym-border px-2.5 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>

                    {/* Content Box */}
                    <div className="p-5 space-y-3">
                      <Link
                        to={`/store/product/${product._id}`}
                        className="text-lg font-bold text-white hover:text-gym-neon transition-colors block line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed h-8">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-extrabold text-white">${product.price}</span>
                      {product.stock === 0 ? (
                        <span className="text-[10px] font-bold text-gym-accent uppercase bg-gym-accent/10 px-2 py-0.5 rounded border border-gym-accent/20">
                          Out of Stock
                        </span>
                      ) : remainingStock === 0 ? (
                        <span className="text-[10px] font-bold text-gym-accent uppercase bg-gym-accent/10 px-2 py-0.5 rounded border border-gym-accent/20">
                          Max Limit
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-gray-500">
                          In Stock: <strong className="text-gray-300">{remainingStock}</strong>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      <button
                        disabled={product.stock === 0 || remainingStock === 0}
                        onClick={() => handleAddToCart(product)}
                        className={`col-span-4 flex items-center justify-center space-x-2 py-3 rounded-xl font-extrabold text-xs transition-all duration-200 ${
                          product.stock === 0 || remainingStock === 0
                            ? 'bg-gym-border text-gray-500 cursor-not-allowed border border-transparent'
                            : addedItem === product._id
                            ? 'bg-gym-neon text-gym-dark shadow-md shadow-gym-neon/10'
                            : 'bg-gym-neon text-gym-dark hover:bg-gym-neonHover shadow-md shadow-gym-neon/10'
                        }`}
                      >
                        {addedItem === product._id ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Added!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4" />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </button>

                      <Link
                        to={`/store/product/${product._id}`}
                        className="col-span-1 border border-gym-border hover:bg-gym-border/40 text-gray-300 hover:text-white rounded-xl flex items-center justify-center transition-colors"
                        title="View Details"
                      >
                        <Info className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
