import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gym-dark flex flex-col items-center justify-center space-y-6 px-4">
        <div className="h-20 w-20 bg-gym-card rounded-3xl flex items-center justify-center border border-gym-border">
          <ShoppingBag className="h-10 w-10 text-gray-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white uppercase font-display">Your Cart is Empty</h2>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            Browse our supplement store to find vitamins, shakers, straps, and more.
          </p>
        </div>
        <Link
          to="/store"
          className="bg-gym-neon hover:bg-gym-neonHover text-gym-dark font-extrabold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-gym-neon/15 text-sm"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gym-dark min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-extrabold text-white uppercase font-display">
          Your Shopping <span className="text-gym-neon">Cart</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="glass-card rounded-2xl p-4 sm:p-6 border border-gym-border flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-gym-border/80 transition-colors"
              >
                {/* Product Detail */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="h-20 w-20 rounded-xl overflow-hidden bg-gym-dark shrink-0 border border-gym-border">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base line-clamp-1">{item.product.name}</h3>
                    <span className="text-xs text-gray-400 capitalize">{item.product.category}</span>
                    <span className="block text-sm font-semibold text-gym-neon mt-1 sm:hidden">
                      ${item.product.price}
                    </span>
                  </div>
                </div>

                {/* Controls (Qty & Total) */}
                <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 border-gym-border/30 pt-4 sm:pt-0">
                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-semibold text-gray-500 uppercase sm:hidden">Qty</span>
                    <div className="flex items-center bg-gym-dark border border-gym-border rounded-lg px-1.5 py-0.5">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        className="p-1.5 text-gray-400 hover:text-white transition-colors"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-sm font-bold text-white w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1.5 text-gray-400 hover:text-white disabled:text-gray-700 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  <span className="hidden sm:inline-block font-extrabold text-white text-lg w-20 text-right">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.product._id)}
                    className="p-2 text-gray-400 hover:text-gym-accent transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Aggregations */}
          <div className="lg:col-span-4 glass-card rounded-2xl p-6 border border-gym-border space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Order Summary</h3>

            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-white">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gym-neon font-bold">FREE</span>
              </div>
              <div className="flex justify-between border-b border-gym-border/40 pb-3">
                <span>Taxes (Estimated)</span>
                <span className="font-semibold text-white">$0.00</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-1">
                <span className="text-white">Estimated Total</span>
                <span className="text-gym-neon text-lg">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-gym-dark bg-gym-neon hover:bg-gym-neonHover font-extrabold text-sm transition-all duration-200 shadow-lg hover:shadow-gym-neon/15 focus:outline-none"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-[10px] text-center text-gray-500 leading-relaxed pt-2">
              By checking out, you agree to our Terms of Sale. Taxes and payment options can be adjusted in the next screen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
