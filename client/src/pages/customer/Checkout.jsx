import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { CreditCard, ShoppingBag, ShieldCheck, MapPin, AlertCircle, Sparkles } from 'lucide-react';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user, setUser } = useAuth();

  const planId = location.state?.planId || null;
  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const [shippingName, setShippingName] = useState(user?.name || '');
  const [shippingEmail, setShippingEmail] = useState(user?.email || '');
  const [shippingPhone, setShippingPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (planId) {
      const fetchPlan = async () => {
        try {
          setLoadingPlan(true);
          const res = await axios.get('/api/plans');
          if (res.data.success) {
            const foundPlan = res.data.plans.find((p) => p._id === planId);
            setPlan(foundPlan);
          }
        } catch (err) {
          console.error('Error fetching plan for checkout:', err.message);
        } finally {
          setLoadingPlan(false);
        }
      };
      fetchPlan();
    }
  }, [planId]);

  const handleAutofillCard = () => {
    setCardName(user?.name || 'John Doe');
    setCardNumber('4242424242424242');
    setCardExpiry('12/28');
    setCardCvv('123');
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    if (planId && !plan) { setError('Membership plan not loaded.'); return; }
    if (!planId && cartItems.length === 0) { setError('Your shopping cart is empty.'); return; }
    if (!address || !city || !zip) { setError('Please fill in shipping/billing address.'); return; }
    if (!cardNumber || !cardExpiry || !cardCvv) { setError('Please complete the credit card form details.'); return; }

    try {
      setLoading(true);
      const paymentToken = 'sim_success';

      if (planId) {
        const res = await axios.post('/api/membership/join', { planId: plan._id, token: paymentToken });
        if (res.data.success) {
          setSuccessMsg('Membership activated successfully! Redirecting...');
          setUser(res.data.user);
          setTimeout(() => navigate('/profile'), 2000);
        }
      } else {
        const res = await axios.post('/api/orders', {
          items: cartItems.map((item) => ({ product: item.product._id, quantity: item.quantity })),
          token: paymentToken,
          shippingAddress: { address, city, zip, shippingName, shippingPhone },
        });
        if (res.data.success) {
          setSuccessMsg('Order placed successfully! Redirecting...');
          clearCart();
          setTimeout(() => navigate('/profile'), 2000);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingPlan) {
    return (
      <div className="min-h-screen bg-gym-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gym-neon"></div>
      </div>
    );
  }

  const billTotal = plan ? plan.price : totalAmount;

  return (
    <div className="bg-gym-dark min-h-[85vh] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase font-display">
          Secure <span className="text-gym-neon">Checkout</span>
        </h1>

        {error && (
          <div className="bg-gym-accent/10 border border-gym-accent/30 text-gym-accent px-4 py-3 rounded-lg flex items-center space-x-2 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-gym-neon/10 border border-gym-neon/30 text-gym-neon px-4 py-3 rounded-lg flex items-center space-x-2 text-sm font-semibold animate-pulse">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Order Summary — appears FIRST on mobile, pushed to right on desktop */}
          <div className="lg:col-span-4 lg:order-last glass-card rounded-2xl p-5 sm:p-6 border border-gym-border space-y-5">
            {plan ? (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-gym-border/40">
                  <ShieldCheck className="h-4 w-4 text-gym-neon shrink-0" />
                  <span>Selected Membership</span>
                </h3>
                <h4 className="font-bold text-white text-lg">{plan.name}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{plan.description}</p>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-gray-500">Plan Duration:</span>
                  <span className="font-bold text-white">{plan.duration} Month{plan.duration > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs border-b border-gym-border/40 pb-3">
                  <span className="text-gray-500">Joining Fee:</span>
                  <span className="font-bold text-gym-neon">FREE</span>
                </div>
                <div className="flex justify-between items-baseline pt-1">
                  <span className="font-bold text-white text-sm">Amount Due:</span>
                  <span className="font-extrabold text-gym-neon text-xl">${plan.price.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2 pb-3 border-b border-gym-border/40">
                  <ShoppingBag className="h-4 w-4 text-gym-neon shrink-0" />
                  <span>Summary ({cartItems.length} items)</span>
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="flex justify-between items-center text-xs">
                      <div className="truncate flex-1 pr-3 text-gray-300">
                        {item.product.name} <span className="text-gray-500">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold text-white shrink-0">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-xs border-t border-gym-border/40 pt-3">
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping:</span>
                    <span className="text-gym-neon font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-500 border-b border-gym-border/40 pb-3">
                    <span>Taxes:</span>
                    <span className="text-white">$0.00</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="font-bold text-white text-sm">Order Total:</span>
                    <span className="font-extrabold text-gym-neon text-xl">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-gym-border/30 rounded-xl p-4 text-[10px] text-gray-400 space-y-1.5">
              <span className="font-semibold text-gray-300 block uppercase tracking-wider">🔒 Safe Transactions</span>
              <p className="leading-relaxed">FitZone utilizes bank-grade SSL encryption. No real charges — demo simulation mode active.</p>
            </div>
          </div>

          {/* Billing & Shipping Form */}
          <form onSubmit={handlePay} className="lg:col-span-8 space-y-5 sm:space-y-6">

            {/* Address Block */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 border border-gym-border space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-gym-neon shrink-0" />
                <span>Shipping &amp; Billing</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Recipient Name</label>
                  <input type="text" required value={shippingName} onChange={(e) => setShippingName(e.target.value)}
                    className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs min-h-[44px]" placeholder="Recipient Name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Contact Phone</label>
                  <input type="tel" required value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)}
                    className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs min-h-[44px]" placeholder="+1 (555) 123-4567" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Street Address</label>
                <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                  className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs min-h-[44px]" placeholder="123 Main St, Apt 4B" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">City</label>
                  <input type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                    className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs min-h-[44px]" placeholder="New York" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">ZIP Code</label>
                  <input type="text" required value={zip} onChange={(e) => setZip(e.target.value)}
                    className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs min-h-[44px]" placeholder="10001" />
                </div>
              </div>
            </div>

            {/* Payment Block */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 border border-gym-border space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-gym-neon shrink-0" />
                  <span>Card Details</span>
                </h3>
                <button type="button" onClick={handleAutofillCard}
                  className="text-xs font-bold text-gym-neon border border-gym-neon/30 hover:border-gym-neon bg-gym-neon/10 px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors self-start sm:self-auto">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Fill Demo Card</span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Cardholder Name</label>
                  <input type="text" required value={cardName} onChange={(e) => setCardName(e.target.value)}
                    className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs min-h-[44px]" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Card Number</label>
                  <input type="text" required maxLength={19} value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}
                    className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs min-h-[44px]" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Expiry Date</label>
                    <input type="text" required maxLength={5} value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)}
                      className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs min-h-[44px]" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">CVV</label>
                    <input type="password" required maxLength={4} value={cardCvv} onChange={(e) => setCardCvv(e.target.value)}
                      className="glass-input block w-full px-4 py-3 rounded-xl text-white text-xs min-h-[44px]" placeholder="123" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-gym-dark bg-gym-neon hover:bg-gym-neonHover font-extrabold text-sm transition-all duration-200 shadow-lg hover:shadow-gym-neon/15 focus:outline-none min-h-[52px]">
              {loading ? (
                <div className="h-5 w-5 border-2 border-gym-dark border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" />
                  <span>Authorize &amp; Pay ${billTotal.toFixed(2)}</span>
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
