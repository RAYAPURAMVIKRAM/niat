import React, { useState } from 'react';
import { X, Navigation, CheckCircle2, Shield } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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
  const toast = useToast();

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
        toast.success(`Travel pod from ${formData.origin_city} to ${formData.destination_city} created!`);
        setTimeout(() => {
          onPodCreated && onPodCreated(res.data.travel_pod);
          onClose();
          setSuccess(false);
        }, 800);
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || err.message || 'Failed to create travel pod';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl bg-surface p-6 sm:p-7 shadow-elevated border border-border/25 text-fg animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-muted hover:bg-surface-2 hover:text-fg transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30 shadow-2xs">
            <Navigation className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-fg font-display">Create Outstation Travel Pod</h3>
            <p className="text-xs text-muted">Coordinate group train or cab transit & split student travel expenses</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-500/10 p-3 text-xs text-rose-500 border border-rose-500/30">
            {error}
          </div>
        )}

        {success ? (
          <div className="py-8 text-center animate-fade-in">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 animate-bounce" />
            <h4 className="mt-2 text-sm font-bold text-fg font-display">Travel Pod Created!</h4>
            <p className="text-xs text-muted">Fellow student hackers can now view your route and book open seats.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-fg mb-1">Target Hackathon Destination</label>
              <select
                value={formData.event_id}
                onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
              >
                <option value="">Select target event (Optional)</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-fg mb-1">Origin City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune, Bengaluru"
                  value={formData.origin_city}
                  onChange={(e) => setFormData({ ...formData, origin_city: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-fg mb-1">Destination City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chennai, Warangal"
                  value={formData.destination_city}
                  onChange={(e) => setFormData({ ...formData, destination_city: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-fg mb-1">Transport Mode</label>
                <select
                  value={formData.transport_mode}
                  onChange={(e) => setFormData({ ...formData, transport_mode: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                >
                  <option value="Train">Train (Sleeper/3AC)</option>
                  <option value="Bus">Intercity Bus / Volvo</option>
                  <option value="Car">Shared Cab / Carpool</option>
                  <option value="Flight">Flight + Airport Cab</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-fg mb-1">Departure Date & Time *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dec 12, 2026 - 6:30 AM"
                  value={formData.departure_date}
                  onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-fg mb-1">Seats Available</label>
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={formData.seats_available}
                  onChange={(e) => setFormData({ ...formData, seats_available: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-fg mb-1">Estimated Split Cost (Per Person)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹950 / person"
                  value={formData.split_cost_estimate}
                  onChange={(e) => setFormData({ ...formData, split_cost_estimate: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-fg mb-1">Transit & Coordination Details *</label>
              <textarea
                required
                rows={2}
                placeholder="Train number, coach details, pickup landmark, or travel precautions..."
                value={formData.transit_details}
                onChange={(e) => setFormData({ ...formData, transit_details: e.target.value })}
                className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
              />
            </div>

            {/* Women-Only Toggle */}
            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="h-4 w-4 text-purple-400" />
                <div>
                  <span className="font-bold text-fg">🛡️ Women-Only Safe Travel Pod</span>
                  <p className="text-[11px] text-muted">Restrict passenger joining requests to verified female campus hackers.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.women_only}
                onChange={(e) => setFormData({ ...formData, women_only: e.target.checked })}
                className="rounded border-purple-400 text-purple-600 focus:ring-purple-500 h-4 w-4"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2.5 border-t border-border/15">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border/25 px-4 py-2.5 font-semibold text-muted hover:text-fg hover:bg-surface-2 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-amber-500 px-5 py-2.5 font-bold text-black hover:opacity-95 transition disabled:opacity-60 shadow-glow btn-shine"
              >
                {loading ? 'Creating...' : 'Create Travel Pod'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
