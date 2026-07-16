import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const origin = location.state?.from?.pathname || (user.role === 'admin' ? '/admin' : '/');
      navigate(origin, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (!res.success) {
        setError(res.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gym-dark">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-2xl border border-gym-border shadow-2xl relative overflow-hidden">
        {/* Glow Element */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gym-neon/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gym-accent/5 rounded-full blur-3xl"></div>

        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-gym-neon/10 rounded-2xl flex items-center justify-center border border-gym-neon/20">
              <Dumbbell className="h-8 w-8 text-gym-neon" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Log in to your FitZone member dashboard
          </p>
        </div>

        {error && (
          <div className="bg-gym-accent/10 border border-gym-accent/30 text-gym-accent px-4 py-3 rounded-lg flex items-center space-x-2 text-sm animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input pl-10 block w-full px-4 py-3.5 rounded-xl text-white text-sm"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input pl-10 block w-full px-4 py-3.5 rounded-xl text-white text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-gym-dark bg-gym-neon hover:bg-gym-neonHover font-extrabold text-sm transition-all duration-200 shadow-lg hover:shadow-gym-neon/20 focus:outline-none"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-gym-dark border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-gym-border text-xs">
          <p className="text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-gym-neon hover:underline font-bold">
              Register Here
            </Link>
          </p>
          <div className="mt-4 p-3 bg-gym-border/30 rounded-lg text-left text-gray-400">
            <span className="font-bold text-gray-300 block mb-1">Demo Credentials:</span>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <div><span className="text-gray-500">Admin Email:</span> admin@fitzone.com</div>
              <div><span className="text-gray-500">Password:</span> AdminPassword123!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
