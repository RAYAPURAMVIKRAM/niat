import React, { useState } from 'react';
import { X, Navigation, CheckCircle2, Shield } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function CreateTravelModal({ isOpen, onClose, events = [], onPodCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    event_id: events[0]?.id || '',
    organizer_name: user?.full_name || 'Rayapuram Vikram',
    origin_city: 'Bengaluru',
    destination_city: 'Chennai',
    departure_date: 'Nov 21, 2026 - 6:00 AM',
    transport_mode: 'Train',
    transit_details: 'Shatabdi Express (Coach C4). Safe verified group travel.',
    seats_available: 3,
    women_only: false,
    split_cost_estimate: '₹850 / person',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        event_id: formData.event_id || null,
        seats_available: parseInt(formData.seats_available, 10) || 2,
        organizer_name: user?.full_name || formData.organizer_name,
      };

      const res = await api.post('/travel', payload);
      if (res.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          onPodCreated && onPodCreated(res.data.travel_pod);
          onClose();
          setSuccess(false);
        }, 800);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create travel pod');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 sm:p-7 shadow-elevated border border-slate-200/90 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200/70 shadow-2xs">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Create Outstation Travel Pod</h3>
            <p className="text-xs text-slate-500">Coordinate safe group transit, split cab/train fares & travel together</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        {success ? (
          <div className="py-8 text-center animate-fade-in">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 animate-bounce" />
            <h4 className="mt-2 text-sm font-bold text-slate-900 font-display">Travel Pod Created!</h4>
            <p className="text-xs text-slate-500">Fellow hackers traveling to this hackathon can now join your pod.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Hackathon</label>
              <select
                value={formData.event_id}
                onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition bg-white"
              >
                <option value="">-- General Intercity Travel --</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Origin City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune, Mumbai, Bengaluru"
                  value={formData.origin_city}
                  onChange={(e) => setFormData({ ...formData, origin_city: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Destination City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai, New Delhi, Bengaluru"
                  value={formData.destination_city}
                  onChange={(e) => setFormData({ ...formData, destination_city: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Transport Mode</label>
                <select
                  value={formData.transport_mode}
                  onChange={(e) => setFormData({ ...formData, transport_mode: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition bg-white"
                >
                  <option value="Train">Train (AC 3T / CC)</option>
                  <option value="Bus">Sleeper Bus</option>
                  <option value="Flight">Flight + Cab Share</option>
                  <option value="Carpool">Carpool / Roadtrip</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Departure Date/Time *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dec 17 @ 06:30 AM"
                  value={formData.departure_date}
                  onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Seats Available *</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  required
                  value={formData.seats_available}
                  onChange={(e) => setFormData({ ...formData, seats_available: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Transit Details & Boarding Point</label>
              <input
                type="text"
                required
                placeholder="e.g. Train 12640 Brindavan Express from KSR Bengaluru to Chennai Central"
                value={formData.transit_details}
                onChange={(e) => setFormData({ ...formData, transit_details: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-center">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Estimated Split Cost</label>
                <input
                  type="text"
                  placeholder="e.g. ₹850 / person"
                  value={formData.split_cost_estimate}
                  onChange={(e) => setFormData({ ...formData, split_cost_estimate: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition"
                />
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-2.5 cursor-pointer rounded-xl border border-rose-200 bg-rose-50/60 p-2.5 hover:bg-rose-100/60 transition">
                  <input
                    type="checkbox"
                    checked={formData.women_only}
                    onChange={(e) => setFormData({ ...formData, women_only: e.target.checked })}
                    className="rounded border-rose-300 text-rose-600 focus:ring-rose-500 h-4 w-4"
                  />
                  <Shield className="h-4 w-4 text-rose-600 shrink-0" />
                  <span className="font-bold text-rose-900 text-xs font-display">Women-Only Safe Pod</span>
                </label>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-amber-600 px-5 py-2.5 font-bold text-white hover:bg-amber-700 transition disabled:opacity-60 shadow-subtle btn-shine"
              >
                {loading ? 'Publishing...' : 'Create Travel Pod'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
