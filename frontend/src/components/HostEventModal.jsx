import React, { useState } from 'react';
import { X, Calendar, MapPin, Award, Tag, Users, CheckCircle2 } from 'lucide-react';
import api from '../api/client';
import { useToast } from '../context/ToastContext';

export default function HostEventModal({ isOpen, onClose, onEventCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    event_type: 'Hackathon',
    city: 'Bengaluru',
    venue: '',
    event_date: '',
    prize_pool: '₹1,50,000',
    tags: 'GenAI, Agentic AI, Next.js, Supabase',
    attendees_count: 100,
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
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        attendees_count: parseInt(formData.attendees_count, 10) || 50,
      };

      const res = await api.post('/events', payload);
      if (res.data?.success) {
        setSuccess(true);
        toast.success(`Event "${formData.title}" published successfully!`);
        setTimeout(() => {
          onEventCreated && onEventCreated(res.data.event);
          onClose();
          setSuccess(false);
        }, 800);
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || err.message || 'Failed to create event';
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
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/15 text-brand border border-brand/30 shadow-2xs">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-fg font-display">Host / Post a Hackathon</h3>
            <p className="text-xs text-muted">Publish a new event to HackSphere AI and invite hackers</p>
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
            <h4 className="mt-2 text-sm font-bold text-fg font-display">Event Published Successfully!</h4>
            <p className="text-xs text-muted">Hackers can now run the AI Agent, post bounties, and join travel pods.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-fg mb-1">Event Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. SIH 2026 - Smart India Hackathon"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-fg mb-1">Organizer / University *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIAT x Yenepoya University"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-fg mb-1">Event Type</label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="National Hackathon">National Hackathon</option>
                  <option value="Tech Fest">Tech Fest</option>
                  <option value="Datathon">Datathon</option>
                  <option value="Sprint">Sprint</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-fg mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru, Chennai, Hyderabad"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-fg mb-1">Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Auditorium / Convention Hall"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-fg mb-1">Event Date(s) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dec 12 - Dec 14, 2026"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-fg mb-1">Prize Pool</label>
                <input
                  type="text"
                  placeholder="e.g. ₹2,50,000"
                  value={formData.prize_pool}
                  onChange={(e) => setFormData({ ...formData, prize_pool: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-fg mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                placeholder="Agentic AI, GenAI, Next.js, Python, Hardware"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
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
                className="rounded-xl bg-brand px-5 py-2.5 font-bold text-brand-fg hover:opacity-95 transition disabled:opacity-60 shadow-glow btn-shine"
              >
                {loading ? 'Publishing...' : 'Publish Event'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
