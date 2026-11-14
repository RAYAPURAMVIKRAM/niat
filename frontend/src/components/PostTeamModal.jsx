import React, { useState } from 'react';
import { X, Users, CheckCircle2, Sparkles } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function PostTeamModal({ isOpen, onClose, events = [], onTeamCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    event_id: events[0]?.id || '',
    team_name: '',
    looking_for_roles: 'UI/UX Designer, Frontend Developer',
    current_stack: 'Next.js, FastAPI, Supabase, Gemini API',
    pitch: '',
    spots_left: 2,
    author_name: user?.full_name || 'Rayapuram Vikram',
    author_college: user?.college_name || 'NIAT x Yenepoya University',
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
        looking_for_roles: formData.looking_for_roles.split(',').map((r) => r.trim()).filter(Boolean),
        current_stack: formData.current_stack.split(',').map((s) => s.trim()).filter(Boolean),
        spots_left: parseInt(formData.spots_left, 10) || 1,
        author_name: user?.full_name || formData.author_name,
        author_college: user?.college_name || formData.author_college,
        is_verified: user?.is_verified || true,
      };

      const res = await api.post('/teams', payload);
      if (res.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          onTeamCreated && onTeamCreated(res.data.team);
          onClose();
          setSuccess(false);
        }, 800);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to post team bounty');
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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 shadow-2xs">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Post Teammate Bounty (LFT)</h3>
            <p className="text-xs text-slate-500">Find complementary hackers with matching skill synergy</p>
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
            <h4 className="mt-2 text-sm font-bold text-slate-900 font-display">Bounty Published to Matching Board!</h4>
            <p className="text-xs text-slate-500">Autonomous agents will now recommend your team to skilled hackers.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Event</label>
              <select
                value={formData.event_id}
                onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition bg-white"
              >
                <option value="">-- General / Any Hackathon --</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Team Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Team NeuralCrafters"
                  value={formData.team_name}
                  onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Spots Open *</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={formData.spots_left}
                  onChange={(e) => setFormData({ ...formData, spots_left: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Looking For Roles (Comma-separated) *</label>
              <input
                type="text"
                required
                placeholder="UI/UX Designer, Frontend Developer, Smart Contract Dev"
                value={formData.looking_for_roles}
                onChange={(e) => setFormData({ ...formData, looking_for_roles: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Tech Stack (Comma-separated)</label>
              <input
                type="text"
                placeholder="Next.js, Python, FastAPI, Supabase"
                value={formData.current_stack}
                onChange={(e) => setFormData({ ...formData, current_stack: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pitch & Project Vision *</label>
              <textarea
                rows="3"
                required
                placeholder="What are you building? Why should a hacker join your squad?"
                value={formData.pitch}
                onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none transition resize-none"
              />
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
                className="rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700 transition disabled:opacity-60 shadow-subtle btn-shine"
              >
                {loading ? 'Publishing...' : 'Post Bounty'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
