import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Dumbbell, Calendar, ShieldCheck, Heart, Award, ArrowRight, Clock } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [timings, setTimings] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [timingsRes, equipmentRes, plansRes] = await Promise.all([
          axios.get('/api/timings'),
          axios.get('/api/equipment'),
          axios.get('/api/plans'),
        ]);

        if (timingsRes.data.success) setTimings(timingsRes.data.timings);
        if (equipmentRes.data.success) setEquipment(equipmentRes.data.equipment);
        if (plansRes.data.success) setPlans(plansRes.data.plans);
      } catch (err) {
        console.error('Error fetching landing data:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectPlan = (planId) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout', { state: { planId } });
    }
  };

  // Order timings properly Mon-Sun
  const orderedTimings = [...timings]
    .filter((t) => t && t.day)
    .sort((a, b) => {
      const order = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7 };
      return (order[a.day] || 0) - (order[b.day] || 0);
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gym-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gym-neon"></div>
      </div>
    );
  }

  return (
    <div className="bg-gym-dark min-h-screen pb-16">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1920"
            alt="Gym interior background"
            className="w-full h-full object-cover object-center opacity-25 filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-dark via-gym-dark/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <span className="inline-block bg-gym-neon/10 border border-gym-neon/30 text-gym-neon px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse">
            Forge Your Legacy
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight uppercase leading-tight font-display">
            NO EXCUSES.<br />
            JUST <span className="text-gym-neon neon-glow">RESULTS.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300 text-sm sm:text-base lg:text-lg px-2 sm:px-0">
            Welcome to FitZone Gym. Premium equipment, elite personal trainers, recovery zones, and customizable workout schedules designed to optimize your peak performance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#plans"
              className="w-full sm:w-auto bg-gym-neon hover:bg-gym-neonHover text-gym-dark font-extrabold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-gym-neon/30 flex items-center justify-center space-x-2"
            >
              <span>Explore Memberships</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/store"
              className="w-full sm:w-auto border border-gym-border hover:bg-gym-border/40 text-white font-bold px-8 py-4 rounded-xl transition-colors flex items-center justify-center"
            >
              Browse Supplements Store
            </Link>
          </div>
        </div>

        {/* Decorative Grid Accent */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-gym-dark to-transparent"></div>
      </section>

      {/* 2. Core Pillars / Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase font-display">
            Why Train With <span className="text-gym-neon">Us?</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-sm">
            We offer premium services and amenities designed to optimize your workout cycles and results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl border border-gym-border text-center space-y-4 hover:border-gym-neon/30 transition-colors">
            <div className="mx-auto w-12 h-12 bg-gym-neon/10 rounded-xl flex items-center justify-center border border-gym-neon/20">
              <Award className="h-6 w-6 text-gym-neon" />
            </div>
            <h3 className="text-xl font-bold text-white">Elite Machinery</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Equipped with commercial-grade plates, Olympic racks, and high-tech smart treadmills.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-gym-border text-center space-y-4 hover:border-gym-neon/30 transition-colors">
            <div className="mx-auto w-12 h-12 bg-gym-neon/10 rounded-xl flex items-center justify-center border border-gym-neon/20">
              <ShieldCheck className="h-6 w-6 text-gym-neon" />
            </div>
            <h3 className="text-xl font-bold text-white">Expert Guidance</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Certified conditioning coaches and nutritionist staff available to map out your progress.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-gym-border text-center space-y-4 hover:border-gym-neon/30 transition-colors">
            <div className="mx-auto w-12 h-12 bg-gym-neon/10 rounded-xl flex items-center justify-center border border-gym-neon/20">
              <Clock className="h-6 w-6 text-gym-neon" />
            </div>
            <h3 className="text-xl font-bold text-white">Flexible Scheduling</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Convenient operational timelines fitting morning lifters and late-night enthusiasts alike.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Timings & Contact Info Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gym-card/50 rounded-3xl p-8 sm:p-12 border border-gym-border">
          <div className="lg:col-span-6 space-y-6">
            <span className="bg-gym-neon/10 text-gym-neon px-3 py-1 rounded-full text-xs font-semibold border border-gym-neon/20">
              Operational Schedule
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase font-display">
              Open Hours & <span className="text-gym-neon">Info</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Find our operational schedule below. Please check timing adjustments during holidays directly through our admin notifications. Our facility is closed on Sundays for routine machinery maintenance.
            </p>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📍 **Location:** 100 Powerhouse Boulevard, Fitness District, NY 10001</p>
              <p>📞 **Call Desk:** +1 (555) 987-6543</p>
              <p>✉️ **Support:** support@fitzone.com</p>
            </div>
          </div>

          {/* Timings Card Grid */}
          <div className="lg:col-span-6 glass-card p-6 rounded-2xl border border-gym-border divide-y divide-gym-border/40">
            {orderedTimings.map((t) => (
              <div key={t.day} className="flex justify-between py-3 items-center">
                <span className="font-semibold text-gray-200 flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gym-neon" />
                  <span>{t.day}</span>
                </span>
                {t.isClosed ? (
                  <span className="text-gym-accent font-extrabold text-xs bg-gym-accent/10 px-2.5 py-1 rounded border border-gym-accent/20">CLOSED</span>
                ) : (
                  <span className="text-gray-300 text-sm font-medium">
                    {t.openTime} — {t.closeTime}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Equipment Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase font-display">
            Equipment <span className="text-gym-neon">Gallery</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-sm">
            Take a look at the commercial-grade gear waiting for you inside. High quality, safe, and heavily loaded.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {equipment.filter(Boolean).map((item) => (
            <div key={item._id} className="glass-card rounded-2xl overflow-hidden border border-gym-border hover:border-gym-neon/20 transition-all duration-300 group">
              <div className="h-56 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-4 right-4 bg-gym-dark/80 text-gym-neon border border-gym-neon/30 px-3 py-1 rounded-full text-xs font-semibold">
                  {item.category}
                </span>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-bold text-white group-hover:text-gym-neon transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
                <div className="flex justify-between items-center pt-2 text-xs border-t border-gym-border/40 text-gray-500">
                  <span>Quantity: <strong className="text-gray-300">{item.quantity}</strong></span>
                  <span>Condition: <strong className="text-gym-neon">{item.condition}</strong></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Membership Pricing Section */}
      <section id="plans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 border-t border-gym-border/40">
        <div className="text-center space-y-3 mb-16">
          <span className="text-gym-neon uppercase font-bold text-xs tracking-wider">Pricing Structures</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white uppercase font-display">
            Select Your <span className="text-gym-neon">Membership</span>
          </h2>
          <p className="max-w-xl mx-auto text-gray-400 text-sm">
            Sign up for monthly, quarterly, or yearly billing cycles to lock in your discount. No hidden signup fees.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {plans.filter(Boolean).map((plan) => (
            <div
              key={plan._id}
              onClick={() => handleSelectPlan(plan._id)}
              className={`glass-card rounded-2xl p-8 border border-gym-border flex flex-col justify-between hover:border-gym-neon/30 hover:shadow-xl hover:shadow-gym-neon/5 hover:-translate-y-1 transition-all duration-300 relative cursor-pointer ${
                plan.name?.includes('Silver') ? 'neon-border-glow border-gym-neon/40' : ''
              }`}
            >
              {plan.name?.includes('Silver') && (
                <span className="absolute -top-3 right-6 bg-gym-neon text-gym-dark font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                  Best Seller
                </span>
              )}
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">{plan.name || 'Membership Plan'}</h3>
                  <p className="text-xs text-gray-400 min-h-[32px]">{plan.description}</p>
                </div>
                
                <div className="flex items-baseline space-x-1">
                  <span className="text-4xl font-extrabold text-white">${plan.price}</span>
                  <span className="text-xs text-gray-500 font-medium">/ {plan.duration} Month{plan.duration > 1 ? 's' : ''}</span>
                </div>

                <ul className="space-y-3 text-xs text-gray-300 pt-4 border-t border-gym-border/40">
                  {plan.benefits?.map((benefit, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <ShieldCheck className="h-4 w-4 text-gym-neon shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => handleSelectPlan(plan._id)}
                  className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm transition-all duration-200 ${
                    plan.name?.includes('Silver')
                      ? 'bg-gym-neon text-gym-dark hover:bg-gym-neonHover shadow-lg hover:shadow-gym-neon/20'
                      : 'border border-gym-border hover:bg-gym-border/40 text-white'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
