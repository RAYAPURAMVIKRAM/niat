import React, { useState } from 'react';
import { X, Calendar, MapPin, Award, Tag, Users, CheckCircle2 } from 'lucide-react';
import api from '../api/client';

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
        setTimeout(() => {
          onEventCreated && onEventCreated(res.data.event);
          onClose();
          setSuccess(false);
        }, 800);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-elevated border border-slate-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Host / Post a Hackathon</h3>
            <p className="text-xs text-slate-500">Publish a new event to HackSphere AI and invite hackers</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500 animate-bounce" />
            <h4 className="mt-2 text-sm font-bold text-slate-900">Event Published Successfully!</h4>
            <p className="text-xs text-slate-500">Hackers can now run the AI Agent, post bounties, and join travel pods.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. SIH 2026 - Smart India Hackathon"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Organizer / University *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NIAT x Yenepoya University"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Type</label>
                <select
                  value={formData.event_type}
                  onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="National Hackathon">National Hackathon</option>
                  <option value="Tech Fest">Tech Fest</option>
                  <option value="Datathon">Datathon</option>
                  <option value="Sprint">Sprint</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bengaluru, Chennai, Hyderabad"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venue *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Main Auditorium / Convention Hall"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Date(s) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dec 12 - Dec 14, 2026"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Prize Pool</label>
                <input
                  type="text"
                  placeholder="e.g. ₹2,50,000"
                  value={formData.prize_pool}
                  onChange={(e) => setFormData({ ...formData, prize_pool: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                placeholder="Agentic AI, GenAI, Next.js, Python, Hardware"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700 transition disabled:opacity-60"
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
