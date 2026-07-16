import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Dumbbell, Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer = () => {
  const [timings, setTimings] = useState([]);

  useEffect(() => {
    const fetchTimings = async () => {
      try {
        const res = await axios.get('/api/timings');
        if (res.data.success) {
          setTimings(res.data.timings);
        }
      } catch (err) {
        console.error('Error fetching timings for footer:', err.message);
        // Fallback static timings
        setTimings([
          { day: 'Monday', openTime: '06:00', closeTime: '22:00', isClosed: false },
          { day: 'Tuesday', openTime: '06:00', closeTime: '22:00', isClosed: false },
          { day: 'Wednesday', openTime: '06:00', closeTime: '22:00', isClosed: false },
          { day: 'Thursday', openTime: '06:00', closeTime: '22:00', isClosed: false },
          { day: 'Friday', openTime: '06:00', closeTime: '22:00', isClosed: false },
          { day: 'Saturday', openTime: '08:00', closeTime: '20:00', isClosed: false },
          { day: 'Sunday', openTime: '09:00', closeTime: '17:00', isClosed: true },
        ]);
      }
    };
    fetchTimings();
  }, []);

  // Organize timings (keep Sunday at the end)
  const orderedTimings = [...timings]
    .filter((t) => t && t.day)
    .sort((a, b) => {
      const order = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7 };
      return (order[a.day] || 0) - (order[b.day] || 0);
    });

  return (
    <footer className="bg-[#07080a] border-t border-gym-border pt-16 pb-8 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Gym Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white font-display font-extrabold text-2xl tracking-wider">
              <Dumbbell className="h-7 w-7 text-gym-neon" />
              <span>FIT<span className="text-gym-neon">ZONE</span></span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              FitZone is a state-of-the-art strength and conditioning facility designed to push you beyond your limits. Join the movement and rewrite your fitness story today.
            </p>
            <div className="flex space-x-4 pt-2">
              <span className="w-8 h-8 rounded-full bg-gym-border flex items-center justify-center hover:bg-gym-neon hover:text-gym-dark transition-colors cursor-pointer text-gray-300">fb</span>
              <span className="w-8 h-8 rounded-full bg-gym-border flex items-center justify-center hover:bg-gym-neon hover:text-gym-dark transition-colors cursor-pointer text-gray-300">tw</span>
              <span className="w-8 h-8 rounded-full bg-gym-border flex items-center justify-center hover:bg-gym-neon hover:text-gym-dark transition-colors cursor-pointer text-gray-300">ig</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-gym-neon transition-colors">Home & Facilities</Link></li>
              <li><Link to="/store" className="hover:text-gym-neon transition-colors">Supplements Store</Link></li>
              <li><Link to="/register" className="hover:text-gym-neon transition-colors">Become a Member</Link></li>
              <li><Link to="/profile" className="hover:text-gym-neon transition-colors">Member Portal</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gym-neon shrink-0 mt-0.5" />
                <span>100 Powerhouse Boulevard, Fitness District, NY 10001</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gym-neon shrink-0" />
                <span>+1 (555) 987-6543</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gym-neon shrink-0" />
                <span>support@fitzone.com</span>
              </li>
            </ul>
          </div>

          {/* Operational Hours */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gym-neon" />
              <span>Gym Timings</span>
            </h3>
            <div className="space-y-1.5 text-xs">
              {orderedTimings.map((t) => (
                <div key={t.day} className="flex justify-between border-b border-gym-border/40 pb-1">
                  <span className="font-medium text-gray-300">{t.day}</span>
                  {t.isClosed ? (
                    <span className="text-gym-accent font-bold">CLOSED</span>
                  ) : (
                    <span className="text-gray-400">
                      {t.openTime} - {t.closeTime}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legal Copyright Footer */}
        <div className="border-t border-gym-border pt-8 text-center text-xs text-gray-600">
          <p>© {new Date().getFullYear()} FitZone Gym. All rights reserved. Premium Design by Rajkumar Varshney and Yash Garg.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
