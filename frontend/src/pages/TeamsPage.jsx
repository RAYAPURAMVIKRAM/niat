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
  Zap,
  Target,
  Code2
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { TeamCardSkeleton } from '../components/ui/Skeleton';
import Reveal from '../components/ui/Reveal';

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
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Top Header */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200/80">
            <Users className="h-3.5 w-3.5 text-emerald-600" />
            <span>Skill-Based Teammate Matching Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Your Winning Hackathon Squad
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Verified campus hackers looking for complementary skills across frontend, AI agents, UI/UX, and smart contracts.
          </p>
        </div>

        <button
          onClick={onOpenPostTeam}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-elevated hover:bg-slate-800 transition transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 btn-shine"
        >
          <PlusCircle className="h-4 w-4 text-emerald-400" />
          <span>Post Teammate Bounty (LFT)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams, roles, tech stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200/90 pl-10 pr-4 py-2 text-xs text-slate-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-slate-50/60 hover:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
          <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">Role:</span>
          {ROLE_FILTERS.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all shrink-0 ${
                selectedRole === role
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Teams Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TeamCardSkeleton />
          <TeamCardSkeleton />
          <TeamCardSkeleton />
          <TeamCardSkeleton />
        </div>
      ) : filteredTeams.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No teams matched your role search"
          description="Be the first to create a squad bounty for this hackathon track!"
          actionLabel="Post a Bounty"
          onAction={onOpenPostTeam}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTeams.map((team, idx) => {
            const isJoined = joinedSet.has(team.id);
            const isFull = team.spots_left <= 0;

            return (
              <Reveal key={team.id} delay={Math.min(idx * 60, 360)}>
                <div className="flex flex-col justify-between h-full rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-subtle hover:border-slate-300 hover:shadow-card transition-all duration-200 card-lift">
                  <div>
                    {/* Team Name and Spots Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                          {team.team_name}
                        </h3>
                        {team.event_title && (
                          <p className="text-[11px] font-bold text-brand-600 flex items-center gap-1 mt-0.5">
                            <Target className="h-3 w-3" />
                            <span>Target: {team.event_title}</span>
                          </p>
                        )}
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-extrabold shrink-0 border ${
                          isFull
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200/90'
                        }`}
                      >
                        {isFull ? 'Squad Full' : `${team.spots_left} spots open`}
                      </span>
                    </div>

                    {/* Author & College */}
                    <div className="flex items-center gap-2.5 text-xs text-slate-600 mb-3.5">
                      <Avatar name={team.author_name} size="sm" verified={team.is_verified} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 font-bold text-slate-800">
                          <span className="truncate">{team.author_name}</span>
                          {team.is_verified && (
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" title="Verified College ID" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{team.author_college}</p>
                      </div>
                    </div>

                    {/* Pitch */}
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100 mb-4 italic">
                      "{team.pitch}"
                    </p>

                    {/* Looking For Roles */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                          Looking For Roles:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {team.looking_for_roles?.map((role) => (
                            <span
                              key={role}
                              className="rounded-lg bg-emerald-50/90 px-2.5 py-1 text-[11px] font-bold text-emerald-800 border border-emerald-200"
                            >
                              + {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Current Stack */}
                      {team.current_stack && team.current_stack.length > 0 && (
                        <div className="pt-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                            Current Tech Stack:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {team.current_stack.map((stk) => (
                              <Badge key={stk} variant="skill">
                                {stk}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      onClick={() => navigate('/chat')}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-xs"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
                      <span>Team Chat</span>
                    </button>

                    <button
                      onClick={() => handleJoinTeam(team)}
                      disabled={isFull || isJoined || joiningId === team.id}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition-all shadow-xs ${
                        isJoined
                          ? 'bg-emerald-600 text-white cursor-default'
                          : isFull
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-slate-900 text-white hover:bg-slate-800 btn-shine'
                      }`}
                    >
                      {isJoined ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Joined Squad</span>
                        </>
                      ) : joiningId === team.id ? (
                        'Joining...'
                      ) : (
                        'Request / Join'
                      )}
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      )}
    </div>
  );
}
