import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../../context/CartContext';
import { ChevronLeft, ShoppingCart, Plus, Minus, Check, CornerDownLeft } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (err) {
        console.error('Error fetching product detail:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gym-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gym-neon"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] bg-gym-dark flex flex-col items-center justify-center space-y-4">
        <p className="text-gray-400">Product not found.</p>
        <Link to="/store" className="text-gym-neon flex items-center space-x-1">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Store</span>
        </Link>
      </div>
    );
  }

  // Calculate available stock after factoring in items already in cart
  const cartItem = cartItems.find((item) => item.product._id === product._id);
  const cartQty = cartItem ? cartItem.quantity : 0;
  const remainingStock = product.stock - cartQty;

  const handleIncrement = () => {
    if (quantity < remainingStock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="bg-gym-dark min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Link */}
        <div>
          <Link to="/store" className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gym-neon transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1 text-gym-neon" />
            <span>Back to Shop</span>
          </Link>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-gym-card/40 rounded-3xl p-6 sm:p-10 border border-gym-border relative overflow-hidden">
          
          {/* Left: Product Image */}
          <div className="h-96 sm:h-[450px] rounded-2xl overflow-hidden bg-gym-dark border border-gym-border flex items-center justify-center">
            <img
              src={product.images[0] || 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=600'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right: Specifications & CTA */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="bg-gym-neon/10 text-gym-neon text-[10px] uppercase font-bold tracking-widest border border-gym-neon/20 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 leading-tight uppercase font-display">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center space-x-4 pt-1">
                <span className="text-3xl font-extrabold text-white">${product.price}</span>
                {product.stock === 0 ? (
                  <span className="text-xs font-bold text-gym-accent uppercase bg-gym-accent/10 px-3 py-1 rounded border border-gym-accent/20">
                    Out of Stock
                  </span>
                ) : remainingStock === 0 ? (
                  <span className="text-xs font-bold text-gym-accent uppercase bg-gym-accent/10 px-3 py-1 rounded border border-gym-accent/20">
                    Cart Limit Reached
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 bg-gym-border px-3 py-1 rounded border border-gym-border/30">
                    Available Stock: <strong className="text-white">{remainingStock}</strong>
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-gym-border/40">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Description</h3>
                <p className="text-sm text-gray-300 leading-relaxed font-sans">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Actions Block */}
            {product.stock > 0 && remainingStock > 0 && (
              <div className="space-y-4 pt-6 border-t border-gym-border/40">
                <div className="flex items-center space-x-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Select Quantity</span>
                  <div className="flex items-center bg-gym-dark border border-gym-border rounded-xl px-2 py-1">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="p-2 text-gray-400 hover:text-white disabled:text-gray-700 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-white w-10 text-center">{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= remainingStock}
                      className="p-2 text-gray-400 hover:text-white disabled:text-gray-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-grow flex items-center justify-center space-x-2 py-4 rounded-xl font-extrabold text-sm transition-all duration-200 ${
                      added
                        ? 'bg-gym-neon text-gym-dark shadow-md shadow-gym-neon/15'
                        : 'bg-gym-neon text-gym-dark hover:bg-gym-neonHover shadow-md shadow-gym-neon/15'
                    }`}
                  >
                    {added ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        <span>Add {quantity} to Cart</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {remainingStock === 0 && product.stock > 0 && (
              <div className="bg-gym-neon/5 border border-gym-neon/20 rounded-xl p-4 text-xs text-gym-neon flex items-center space-x-2">
                <span>You already have the entire remaining stock of this product in your cart!</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
