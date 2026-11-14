import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Layers,
  Zap
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const ROLE_FILTERS = ['All', 'Frontend', 'Backend', 'AI/ML', 'UI/UX', 'Pitch', 'Smart Contract'];

export default function TeamsPage({ onOpenPostTeam }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [searchParams] = useSearchParams();
  const eventIdFilter = searchParams.get('eventId');
  const [joiningId, setJoiningId] = useState(null);
  const [joinedSet, setJoinedSet] = useState(new Set());

  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const url = eventIdFilter ? `/teams?event_id=${eventIdFilter}` : '/teams';
      const res = await api.get(url);
      setTeams(res.data?.teams || []);
    } catch (err) {
      console.warn('Failed to load teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [eventIdFilter]);

  const handleJoinTeam = async (team) => {
    setJoiningId(team.id);
    try {
      const res = await api.post(`/teams/${team.id}/join`, {
        applicant_name: user?.full_name || 'Rayapuram Vikram',
        applicant_college: user?.college_name || 'NIAT University',
        role: team.looking_for_roles?.[0] || 'Teammate',
      });

      if (res.data?.success) {
        setJoinedSet((prev) => new Set(prev).add(team.id));
        // Update spots_left in state
        setTeams((prev) =>
          prev.map((t) => (t.id === team.id ? { ...t, spots_left: res.data.spots_left } : t))
        );
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to join team');
    } finally {
      setJoiningId(null);
    }
  };

  const filteredTeams = teams.filter((t) => {
    const matchesSearch =
      t.team_name.toLowerCase().includes(search.toLowerCase()) ||
      t.author_name.toLowerCase().includes(search.toLowerCase()) ||
      t.author_college.toLowerCase().includes(search.toLowerCase()) ||
      (t.looking_for_roles && t.looking_for_roles.some((r) => r.toLowerCase().includes(search.toLowerCase()))) ||
      (t.current_stack && t.current_stack.some((s) => s.toLowerCase().includes(search.toLowerCase())));

    const matchesRole =
      selectedRole === 'All' ||
      (t.looking_for_roles && t.looking_for_roles.some((r) => r.toLowerCase().includes(selectedRole.toLowerCase())));

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200 mb-1.5">
            <Users className="h-3.5 w-3.5" />
            <span>Skill-Based Teammate Matching Board</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Find Your Winning Hackathon Squad
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified campus hackers looking for complementary skills across frontend, AI agents, UI/UX, and smart contracts.
          </p>
        </div>

        <button
          onClick={onOpenPostTeam}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Post Teammate Bounty (LFT)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams, roles, tech stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:border-brand-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
          <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0">Role:</span>
          {ROLE_FILTERS.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition shrink-0 ${
                selectedRole === role
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse" />
          ))}
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-slate-400 mb-2" />
          <h3 className="text-sm font-bold text-slate-900">No teams matched your role search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Be the first to create a squad bounty for this hackathon!
          </p>
          <button
            onClick={onOpenPostTeam}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Post a Bounty</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTeams.map((team) => {
            const isJoined = joinedSet.has(team.id);
            const isFull = team.spots_left <= 0;

            return (
              <div
                key={team.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle hover:border-slate-300 hover:shadow-elevated transition-all"
              >
                <div>
                  {/* Team Name and Spots Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {team.team_name}
                      </h3>
                      {team.event_title && (
                        <p className="text-[11px] font-semibold text-brand-600">
                          Target: {team.event_title}
                        </p>
                      )}
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold shrink-0 ${
                        isFull
                          ? 'bg-slate-100 text-slate-600 border border-slate-300'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {isFull ? 'Squad Full' : `${team.spots_left} spots open`}
                    </span>
                  </div>

                  {/* Author & College */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3">
                    <span className="font-semibold text-slate-800">{team.author_name}</span>
                    <span className="text-slate-400">•</span>
                    <span>{team.author_college}</span>
                    {team.is_verified && (
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" title="Verified College ID" />
                    )}
                  </div>

                  {/* Pitch */}
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100 mb-3.5">
                    "{team.pitch}"
                  </p>

                  {/* Looking For Roles */}
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Looking For Roles:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {team.looking_for_roles?.map((role) => (
                          <span
                            key={role}
                            className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200"
                          >
                            + {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Current Stack */}
                    {team.current_stack && team.current_stack.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Current Tech Stack:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {team.current_stack.map((stk) => (
                            <span
                              key={stk}
                              className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
                            >
                              {stk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate('/chat')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                    <span>Open Team Chat</span>
                  </button>

                  <button
                    onClick={() => handleJoinTeam(team)}
                    disabled={isFull || isJoined || joiningId === team.id}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition shadow-xs ${
                      isJoined
                        ? 'bg-emerald-600 text-white cursor-default'
                        : isFull
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Joined Team</span>
                      </>
                    ) : joiningId === team.id ? (
                      'Joining...'
                    ) : (
                      'Request / Join Team'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
