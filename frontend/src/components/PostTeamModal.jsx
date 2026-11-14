import React, { useState } from 'react';
import { X, Users, CheckCircle2, Sparkles } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

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
        toast.success(`Team bounty for "${formData.team_name}" posted!`);
        setTimeout(() => {
          onTeamCreated && onTeamCreated(res.data.team);
          onClose();
          setSuccess(false);
        }, 800);
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || err.message || 'Failed to post team bounty';
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
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-fg font-display">Post Teammate Bounty (LFT)</h3>
            <p className="text-xs text-muted">Recruit hackers with complementary skills for your target hackathon</p>
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
            <h4 className="mt-2 text-sm font-bold text-fg font-display">Teammate Bounty Published!</h4>
            <p className="text-xs text-muted">Hackers can now discover your pitch and request to join.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-fg mb-1">Target Hackathon</label>
              <select
                value={formData.event_id}
                onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
                className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
              >
                <option value="">Select an event (Optional)</option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-fg mb-1">Squad / Team Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Team NeuralNomads"
                  value={formData.team_name}
                  onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-fg mb-1">Open Spots Available</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={formData.spots_left}
                  onChange={(e) => setFormData({ ...formData, spots_left: e.target.value })}
                  className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-fg mb-1">Looking for Roles (Comma-separated) *</label>
              <input
                type="text"
                required
                placeholder="Frontend Developer, Agentic AI Engineer, Pitch Lead"
                value={formData.looking_for_roles}
                onChange={(e) => setFormData({ ...formData, looking_for_roles: e.target.value })}
                className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-fg mb-1">Current Tech Stack (Comma-separated)</label>
              <input
                type="text"
                placeholder="React, Next.js, FastAPI, Python, Supabase"
                value={formData.current_stack}
                onChange={(e) => setFormData({ ...formData, current_stack: e.target.value })}
                className="w-full rounded-xl border border-border/25 bg-surface-2/70 px-3.5 py-2.5 text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-fg mb-1">Project Idea & Pitch *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe what you plan to build, your track target, and what makes your team winning..."
                value={formData.pitch}
                onChange={(e) => setFormData({ ...formData, pitch: e.target.value })}
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
                {loading ? 'Posting...' : 'Post Bounty'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
