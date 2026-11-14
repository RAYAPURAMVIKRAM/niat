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
import { useToast } from '../context/ToastContext';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { TeamCardSkeleton } from '../components/ui/Skeleton';
import Reveal from '../components/ui/Reveal';
import Confetti from '../components/ui/Confetti';

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
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

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
        setTeams((prev) =>
          prev.map((t) => (t.id === team.id ? { ...t, spots_left: res.data.spots_left } : t))
        );
        setConfettiTrigger(true);
        toast.success(`You joined ${team.team_name}! Head to the team chat to collaborate.`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to join team');
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
      {/* Confetti Trigger */}
      <Confetti trigger={confettiTrigger} onComplete={() => setConfettiTrigger(false)} />

      {/* Top Header */}
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-border/20 p-6 sm:p-7 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
            <Users className="h-3.5 w-3.5" />
            <span>Skill-Based Teammate Matching Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight font-display">
            Find Your Winning Hackathon Squad
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
            Verified campus hackers looking for complementary skills across frontend, AI agents, UI/UX, and smart contracts.
          </p>
        </div>

        <button
          onClick={onOpenPostTeam}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand text-brand-fg px-5 py-3 text-xs font-bold shadow-glow hover:opacity-95 transition transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 btn-shine"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Post Teammate Bounty (LFT)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 rounded-2xl border border-border/20 bg-surface p-3.5 sm:p-4 shadow-subtle">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search teams, roles, tech stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-border/20 pl-10 pr-4 py-2 text-xs text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none bg-surface-2/60 hover:bg-surface-2 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
          <span className="text-xs font-bold text-muted mr-1 shrink-0 font-mono">Role:</span>
          {ROLE_FILTERS.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all shrink-0 font-display ${
                selectedRole === role
                  ? 'bg-brand text-brand-fg shadow-xs'
                  : 'bg-surface-2 text-muted hover:bg-surface-2/80 hover:text-fg'
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
                <div className="flex flex-col justify-between h-full rounded-3xl border border-border/20 bg-surface p-5 sm:p-6 shadow-subtle hover:border-brand/40 hover:shadow-elevated transition-all duration-200 card-lift">
                  <div>
                    {/* Team Name and Spots Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-base font-extrabold text-fg leading-snug font-display">
                          {team.team_name}
                        </h3>
                        {team.event_title && (
                          <p className="text-[11px] font-bold text-brand flex items-center gap-1 mt-0.5">
                            <Target className="h-3 w-3" />
                            <span>Target: {team.event_title}</span>
                          </p>
                        )}
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-extrabold shrink-0 border font-mono ${
                          isFull
                            ? 'bg-surface-2 text-muted border-border/20'
                            : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {isFull ? 'Squad Full' : `${team.spots_left} spots open`}
                      </span>
                    </div>

                    {/* Author & College */}
                    <div className="flex items-center gap-2.5 text-xs text-muted mb-3.5">
                      <Avatar name={team.author_name} size="sm" verified={team.is_verified} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 font-bold text-fg">
                          <span className="truncate">{team.author_name}</span>
                          {team.is_verified && (
                            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" title="Verified College ID" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted truncate">{team.author_college}</p>
                      </div>
                    </div>

                    {/* Pitch */}
                    <p className="text-xs text-fg leading-relaxed bg-surface-2/80 p-3.5 rounded-2xl border border-border/15 mb-4 italic">
                      "{team.pitch}"
                    </p>

                    {/* Looking For Roles */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted block mb-1.5 font-mono">
                          Looking For Roles:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {team.looking_for_roles?.map((role) => (
                            <span
                              key={role}
                              className="rounded-xl bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-400 border border-emerald-500/30"
                            >
                              + {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Current Stack */}
                      {team.current_stack && team.current_stack.length > 0 && (
                        <div className="pt-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted block mb-1.5 font-mono">
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
                  <div className="mt-5 pt-4 border-t border-border/15 flex items-center justify-between gap-3">
                    <button
                      onClick={() => navigate('/chat')}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border/20 px-3.5 py-2 text-xs font-bold text-fg hover:bg-surface-2 transition shadow-xs"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-muted" />
                      <span>Team Chat</span>
                    </button>

                    <button
                      onClick={() => handleJoinTeam(team)}
                      disabled={isFull || isJoined || joiningId === team.id}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold transition-all shadow-xs ${
                        isJoined
                          ? 'bg-emerald-500 text-black cursor-default font-extrabold'
                          : isFull
                          ? 'bg-surface-2 text-muted cursor-not-allowed'
                          : 'bg-brand text-brand-fg hover:opacity-95 shadow-glow btn-shine'
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
