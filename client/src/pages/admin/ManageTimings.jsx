import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNav from '../../components/AdminNav';
import { Clock, ShieldCheck, AlertCircle } from 'lucide-react';

const ManageTimings = () => {
  const [timings, setTimings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingDay, setSavingDay] = useState(null); // Track which day is saving
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchTimings();
  }, []);

  const fetchTimings = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/timings');
      if (res.data.success) {
        setTimings(res.data.timings);
      }
    } catch (err) {
      console.error('Error fetching timings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTimingChange = (day, field, value) => {
    setTimings((prev) =>
      prev.map((t) => (t.day === day ? { ...t, [field]: value } : t))
    );
  };

  const handleSaveTiming = async (dayTiming) => {
    setErrorMsg('');
    setSuccessMsg('');
    setSavingDay(dayTiming.day);

    try {
      const res = await axios.put(`/api/admin/timings/${dayTiming.day}`, {
        openTime: dayTiming.openTime,
        closeTime: dayTiming.closeTime,
        isClosed: dayTiming.isClosed,
      });

      if (res.data.success) {
        setSuccessMsg(`Hours for ${dayTiming.day} updated successfully!`);
        fetchTimings();
      }
    } catch (err) {
      setErrorMsg(`Failed to save timings for ${dayTiming.day}.`);
    } finally {
      setSavingDay(null);
    }
  };

  // Order timings Monday -> Sunday
  const orderedTimings = [...timings].sort((a, b) => {
    const order = { Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6, Sunday: 7 };
    return order[a.day] - order[b.day];
  });

  return (
    <div className="bg-gym-dark min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation */}
        <AdminNav />

        {/* Header Block */}
        <h1 className="text-3xl font-extrabold text-white uppercase font-display">
          Manage Gym <span className="text-gym-neon">Hours</span>
        </h1>

        {errorMsg && (
          <div className="bg-gym-accent/10 border border-gym-accent/30 text-gym-accent px-4 py-3 rounded-lg flex items-center space-x-2 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-gym-neon/10 border border-gym-neon/30 text-gym-neon px-4 py-3 rounded-lg flex items-center space-x-2 text-sm font-semibold">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Schedule grid list */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-gym-neon mx-auto"></div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-gym-border overflow-hidden pt-2">
            <div className="divide-y divide-gym-border/30 text-xs text-gray-300">
              
              {orderedTimings.map((dayTiming) => (
                <div
                  key={dayTiming.day}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-5 gap-3 hover:bg-gym-border/10 transition-colors"
                >
                  {/* Left: Day info */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gym-neon animate-pulse" />
                    <span className="font-extrabold text-white text-sm uppercase tracking-wide">{dayTiming.day}</span>
                  </div>

                  {/* Middle: Config inputs */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 text-[10px] uppercase tracking-wider">Open</span>
                      <input
                        type="time"
                        disabled={dayTiming.isClosed}
                        value={dayTiming.openTime}
                        onChange={(e) => handleTimingChange(dayTiming.day, 'openTime', e.target.value)}
                        className="glass-input px-2.5 py-1.5 rounded-xl text-white text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 text-[10px] uppercase tracking-wider">Close</span>
                      <input
                        type="time"
                        disabled={dayTiming.isClosed}
                        value={dayTiming.closeTime}
                        onChange={(e) => handleTimingChange(dayTiming.day, 'closeTime', e.target.value)}
                        className="glass-input px-2.5 py-1.5 rounded-xl text-white text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </div>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dayTiming.isClosed}
                        onChange={(e) => handleTimingChange(dayTiming.day, 'isClosed', e.target.checked)}
                        className="rounded border-gym-border text-gym-neon focus:ring-gym-neon bg-gym-dark cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-gray-400">Closed</span>
                    </label>
                  </div>

                  {/* Right: Action */}
                  <div className="shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => handleSaveTiming(dayTiming)}
                      disabled={savingDay === dayTiming.day}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase bg-gym-neon text-gym-dark hover:bg-gym-neonHover disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md min-h-[40px]"
                    >
                      {savingDay === dayTiming.day ? 'Saving...' : 'Apply Hours'}
                    </button>
                  </div>

                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageTimings;
