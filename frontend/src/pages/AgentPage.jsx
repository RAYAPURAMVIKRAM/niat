import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Cpu,
  Users,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Code,
  Flame,
  Layers,
  Clock,
  Compass,
  Zap,
  TrendingUp,
  MapPin,
  Calendar,
  Radio,
  Car,
  Train,
  Check,
  Activity,
  Layers3
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ProgressRing from '../components/ui/ProgressRing';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Reveal from '../components/ui/Reveal';
import Confetti from '../components/ui/Confetti';

export default function AgentPage() {
  const [searchParams] = useSearchParams();
  const preSelectedEventId = searchParams.get('eventId');
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(preSelectedEventId || '');
  const [skills, setSkills] = useState(
    user?.skills && user.skills.length > 0
      ? user.skills.join(', ')
      : 'React, Next.js, Python, FastAPI, Supabase, Gemini AI'
  );
  const [goal, setGoal] = useState(
    'Win the Agentic AI track, find an exceptional complementary squad, and coordinate safe outstation travel'
  );

  const [running, setRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [orchestrationResult, setOrchestrationResult] = useState(null);
  const [error, setError] = useState('');
  const [joinedTeams, setJoinedTeams] = useState(new Set());
  const [joinedPods, setJoinedPods] = useState(new Set());
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  // Fetch events for target hackathon dropdown
  useEffect(() => {
    async function loadEvents() {
      try {
        const res = await api.get('/events');
        const evList = res.data?.events || [];
        setEvents(evList);
        if (!selectedEventId && evList.length > 0) {
          setSelectedEventId(evList[0].id);
        }
      } catch (err) {
        console.warn('Failed to load events in agent view:', err);
      }
    }
    loadEvents();
  }, [selectedEventId]);

  // Update skills if user logs in
  useEffect(() => {
    if (user?.skills && user.skills.length > 0) {
      setSkills(user.skills.join(', '));
    }
  }, [user]);

  const handleLaunchAgent = async () => {
    setRunning(true);
    setError('');
    setOrchestrationResult(null);
    setActiveStepIndex(1);

    const timer1 = setTimeout(() => setActiveStepIndex(2), 1200);
    const timer2 = setTimeout(() => setActiveStepIndex(3), 2400);

    try {
      const userProfilePayload = {
        full_name: user?.full_name || 'Rayapuram Vikram',
        college_name: user?.college_name || 'NIAT x Yenepoya University',
        city: user?.city || 'Bengaluru',
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      };

      const res = await api.post('/ai/agent-orchestrate', {
        userProfile: userProfilePayload,
        goal,
        targetEventId: selectedEventId || null,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      setActiveStepIndex(3);

      if (res.data?.success) {
        setOrchestrationResult(res.data);
        toast.success('3-Agent Workflow Completed! Winning strategy synthesized.');
      } else {
        throw new Error(res.data?.error || 'Orchestration failed');
      }
    } catch (err) {
      console.warn('Orchestration fallback trigger:', err);
      const errMsg = err?.response?.data?.message || err.message || 'Execution error';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setRunning(false);
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      const res = await api.post(`/teams/${teamId}/join`, {
        applicant_name: user?.full_name || 'Rayapuram Vikram',
        applicant_college: user?.college_name || 'NIAT University',
        role: 'Autonomous AI Contributor',
      });
      if (res.data?.success) {
        setJoinedTeams((prev) => new Set(prev).add(teamId));
        setConfettiTrigger(true);
        toast.success('Joined complementary squad! Check team chat room.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not join team');
    }
  };

  const handleJoinPod = async (podId) => {
    try {
      const res = await api.post(`/travel/${podId}/join`, {
        passenger_name: user?.full_name || 'Rayapuram Vikram',
      });
      if (res.data?.success) {
        setJoinedPods((prev) => new Set(prev).add(podId));
        setConfettiTrigger(true);
        toast.success('Seat reserved in Outstation Travel Pod!');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not join pod');
    }
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Confetti Trigger */}
      <Confetti trigger={confettiTrigger} onComplete={() => setConfettiTrigger(false)} />

      {/* Executive Command Header */}
      <div className="relative overflow-hidden rounded-3xl bg-surface p-6 sm:p-9 text-fg shadow-elevated border border-border/20">
        <div
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{ backgroundImage: 'var(--grad-mesh)' }}
        />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand/15 px-3 py-1 text-xs font-bold text-brand border border-brand/30 backdrop-blur-sm">
              <Cpu className="h-3.5 w-3.5 animate-pulse" />
              <span>Multi-Agent Autonomous Pipeline (Powered by Gemini AI)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-fg tracking-tight font-display">
              Autonomous 3-Agent AI Command Center
            </h1>
            <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
              Fuses track strategy, database teammate complement-ranking, and door-to-door outstation logistics into a single automated execution.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2.5 bg-surface-2/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-border/20 self-start md:self-auto shadow-2xs">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-emerald-400 font-mono tracking-wide">
              Agents Ready to Deploy
            </span>
          </div>
        </div>
      </div>

      {/* Target Parameters Form */}
      <div className="rounded-3xl border border-border/20 bg-surface p-5 sm:p-7 shadow-subtle relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b border-border/15 pb-3">
          <h2 className="text-sm font-bold text-fg flex items-center gap-2 font-display">
            <div className="p-1.5 rounded-xl bg-brand/15 text-brand border border-brand/30">
              <Compass className="h-4 w-4" />
            </div>
            <span>Mission Objectives & Hacker Profile</span>
          </h2>
          <span className="text-[11px] font-mono font-bold text-brand bg-brand/10 px-2.5 py-0.5 rounded-full border border-brand/20">
            Autonomous Configuration
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* Target Event Dropdown */}
          <div className="space-y-1.5">
            <label className="block font-bold text-fg">Target Hackathon</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full rounded-xl border border-border/20 px-3.5 py-2.5 font-medium text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none bg-surface-2/70 hover:bg-surface-2 transition"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id} className="bg-surface text-fg">
                  {ev.title} ({ev.city} - {ev.prize_pool})
                </option>
              ))}
            </select>
            {selectedEvent && (
              <p className="text-[11px] text-muted truncate flex items-center gap-1 pt-0.5">
                <MapPin className="h-3 w-3 text-brand shrink-0" />
                <span>
                  {selectedEvent.venue}, {selectedEvent.city}
                </span>
              </p>
            )}
          </div>

          {/* Your Skills */}
          <div className="space-y-1.5">
            <label className="block font-bold text-fg">Your Skills & Tech Stack</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Next.js, FastAPI, Python, AI"
              className="w-full rounded-xl border border-border/20 px-3.5 py-2.5 font-medium text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none bg-surface-2/70 hover:bg-surface-2 transition"
            />
            <p className="text-[11px] text-muted pt-0.5">
              Agent 2 uses this to compute complementary squad match percentages.
            </p>
          </div>

          {/* Custom Hackathon Goal */}
          <div className="space-y-1.5">
            <label className="block font-bold text-fg">Mission Goal</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Win 1st place in AI track with strong team"
              className="w-full rounded-xl border border-border/20 px-3.5 py-2.5 font-medium text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none bg-surface-2/70 hover:bg-surface-2 transition"
            />
            <p className="text-[11px] text-muted pt-0.5">
              Agent 1 uses this to align winning architecture.
            </p>
          </div>
        </div>

        {/* Big Launch Trigger Button */}
        <div className="mt-6 pt-4 border-t border-border/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Multi-tier safety checks and live Supabase database queries active</span>
          </div>

          <button
            onClick={handleLaunchAgent}
            disabled={running}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-brand text-brand-fg px-7 py-3.5 text-xs font-bold shadow-glow hover:opacity-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed btn-shine"
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Orchestrating Autonomous Agents...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span className="tracking-wide">Launch Autonomous 3-Agent Workflow</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Agent Execution Pipeline Status */}
      {running && (
        <Reveal>
          <div className="rounded-3xl border border-brand/40 bg-surface p-6 sm:p-7 shadow-elevated relative overflow-hidden glow-border">
            <div className="flex items-center justify-between mb-5 border-b border-border/15 pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-fg flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand" />
                </span>
                <span>Autonomous Agent Pipeline In Progress...</span>
              </h3>
              <span className="text-[11px] font-mono font-bold text-brand bg-brand/15 px-3 py-1 rounded-full border border-brand/30">
                Step {activeStepIndex} of 3
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div
                className={`rounded-2xl p-5 border transition-all duration-300 ${
                  activeStepIndex >= 1
                    ? 'bg-surface-2 border-brand/50 shadow-elevated'
                    : 'bg-surface border-border/15 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-brand-fg text-xs font-extrabold shadow-sm">
                    1
                  </span>
                  {activeStepIndex === 1 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-brand animate-pulse">
                      <Radio className="h-3 w-3" /> Thinking...
                    </span>
                  )}
                  {activeStepIndex > 1 && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                </div>
                <h4 className="text-xs font-bold text-fg mb-1">Track & Blueprint Strategist</h4>
                <p className="text-[11px] text-muted leading-relaxed">
                  Synthesizing highest probability hackathon project track based on skill synergy...
                </p>
              </div>

              {/* Step 2 */}
              <div
                className={`rounded-2xl p-5 border transition-all duration-300 ${
                  activeStepIndex >= 2
                    ? 'bg-surface-2 border-brand/50 shadow-elevated'
                    : 'bg-surface border-border/15 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-accent text-accent-fg text-xs font-extrabold shadow-sm">
                    2
                  </span>
                  {activeStepIndex === 2 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-brand animate-pulse">
                      <Radio className="h-3 w-3" /> Querying DB...
                    </span>
                  )}
                  {activeStepIndex > 2 && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                </div>
                <h4 className="text-xs font-bold text-fg mb-1">Skill-Complement Matcher</h4>
                <p className="text-[11px] text-muted leading-relaxed">
                  Querying live Supabase team posts & calculating skill-overlap percentages...
                </p>
              </div>

              {/* Step 3 */}
              <div
                className={`rounded-2xl p-5 border transition-all duration-300 ${
                  activeStepIndex >= 3
                    ? 'bg-surface-2 border-brand/50 shadow-elevated'
                    : 'bg-surface border-border/15 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-black text-xs font-extrabold shadow-sm">
                    3
                  </span>
                  {activeStepIndex === 3 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 animate-pulse">
                      <Radio className="h-3 w-3" /> Routing Transit...
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-fg mb-1">Transit & Logistics Planner</h4>
                <p className="text-[11px] text-muted leading-relaxed">
                  Routing door-to-door travel pod & estimating per-person split savings...
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-400 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Orchestration Results Display */}
      {orchestrationResult && (
        <div className="space-y-6">
          {/* Agent Pipeline Steps Summary Banner */}
          <Reveal>
            <div className="rounded-3xl border border-border/20 bg-surface p-5 sm:p-6 shadow-subtle">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-border/15 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-fg font-display">
                      Autonomous 3-Agent Workflow Completed
                    </h3>
                    <p className="text-[11px] text-muted">
                      Live synthesis across tracks, squads, and outstation logistics
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-auto rounded-full bg-surface-2 px-3 py-1 text-[11px] font-semibold text-muted border border-border/20 font-mono">
                  Mode: {orchestrationResult.meta?.mode || 'Hybrid Orchestrator'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {orchestrationResult.agentSteps?.map((step) => (
                  <div
                    key={step.step}
                    className="rounded-2xl bg-surface-2/80 p-4 border border-border/15 hover:border-brand/40 transition"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-fg mb-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-brand text-brand-fg text-[10px] font-extrabold">
                        {step.step}
                      </span>
                      <span>{step.agent_name}</span>
                    </div>
                    <p className="text-[11px] text-muted leading-relaxed">{step.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* AGENT 1: WINNING PROJECT BLUEPRINT (BENTO GRID LAYOUT) */}
          {orchestrationResult.hackathonBlueprint && (
            <Reveal delay={100}>
              <div className="rounded-3xl border border-brand/30 bg-surface p-6 sm:p-7 shadow-elevated">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-border/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-brand-fg shadow-glow">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand font-mono">
                        Agent 1: Event & Track Strategist
                      </span>
                      <h3 className="text-lg font-bold text-fg font-display">
                        {orchestrationResult.hackathonBlueprint.project_title}
                      </h3>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto rounded-full bg-brand/15 px-3.5 py-1 text-xs font-extrabold text-brand border border-brand/30 shadow-xs flex items-center gap-1.5 font-mono">
                    <Zap className="h-3.5 w-3.5" />
                    <span>
                      {orchestrationResult.hackathonBlueprint.strategic_fit_score || 95}% Track Fit
                    </span>
                  </div>
                </div>

                {/* Pitch Hook */}
                <div className="rounded-2xl bg-surface-2 p-4 sm:p-5 border border-border/15 shadow-subtle mb-5">
                  <p className="text-[10px] font-bold text-brand uppercase tracking-wider mb-1.5 flex items-center gap-1.5 font-mono">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Winning USP Hook</span>
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-fg leading-relaxed italic">
                    "{orchestrationResult.hackathonBlueprint.project_pitch}"
                  </p>
                </div>

                {/* Bento Grid: Track & Architecture Stack */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Recommended Track Card */}
                  <div className="rounded-2xl border border-border/20 bg-surface-2 p-4 shadow-xs">
                    <p className="font-bold text-muted mb-1">Recommended Track</p>
                    <p className="font-extrabold text-brand text-sm font-display">
                      {orchestrationResult.hackathonBlueprint.recommended_track}
                    </p>
                    <p className="text-[11px] text-muted mt-1 leading-relaxed">
                      Optimized for highest jury score based on current market trends & team skills.
                    </p>
                  </div>

                  {/* Architecture Stack Card */}
                  <div className="rounded-2xl border border-border/20 bg-surface-2 p-4 shadow-xs">
                    <p className="font-bold text-muted mb-2">Suggested Architecture Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {orchestrationResult.hackathonBlueprint.recommended_tech_stack?.map((tech) => (
                        <Badge key={tech} variant="skill">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 36-Hour Sprint Milestones */}
                {orchestrationResult.hackathonBlueprint.milestone_timeline && (
                  <div className="mt-5 pt-5 border-t border-border/15">
                    <p className="text-xs font-bold text-fg mb-3 flex items-center gap-1.5 font-display">
                      <Clock className="h-4 w-4 text-brand" />
                      <span>36-Hour Hackathon Sprint Milestones</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      {orchestrationResult.hackathonBlueprint.milestone_timeline.map((m) => (
                        <div
                          key={m.hours}
                          className="rounded-2xl bg-surface-2 p-3.5 border border-border/20 shadow-xs hover:border-brand/40 transition"
                        >
                          <span className="rounded-md bg-brand text-brand-fg px-2 py-0.5 text-[10px] font-bold font-mono">
                            {m.hours}
                          </span>
                          <p className="font-bold text-fg mt-2 font-display">{m.phase}</p>
                          <p className="text-[11px] text-muted mt-0.5 leading-snug">{m.goal}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          )}

          {/* AGENT 2: SKILL-COMPLEMENTARITY TEAM MATCHER */}
          <Reveal delay={200}>
            <div className="rounded-3xl border border-border/20 bg-surface p-6 sm:p-7 shadow-elevated">
              <div className="flex items-center justify-between mb-5 border-b border-border/15 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                      Agent 2: Skill-Complementarity Matcher
                    </span>
                    <h3 className="text-base font-bold text-fg font-display">
                      Top Complementary Squads Ranked for You
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/teams')}
                  className="text-xs font-bold text-brand hover:opacity-80 flex items-center gap-1.5 hover:underline"
                >
                  <span>View All Bounties</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {orchestrationResult.recommendedTeams?.map((team) => {
                  const isJoined = joinedTeams.has(team.team_id);
                  return (
                    <div
                      key={team.team_id || team.team_name}
                      className="flex flex-col justify-between rounded-3xl border border-border/20 bg-surface-2/60 p-5 hover:border-brand/40 hover:bg-surface-2 transition-all duration-200 card-lift"
                    >
                      <div>
                        {/* Top Bar with Match Score Ring */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={team.author_name} size="md" verified={true} />
                            <div>
                              <h4 className="text-sm font-bold text-fg font-display">{team.team_name}</h4>
                              <p className="text-[11px] text-muted">
                                Lead:{' '}
                                <span className="font-semibold text-fg">{team.author_name}</span> (
                                {team.author_college})
                              </p>
                            </div>
                          </div>

                          <ProgressRing value={team.compatibility_percentage || 85} size={54} strokeWidth={4.5} />
                        </div>

                        {/* Synergy Reasoning */}
                        <div className="my-3 rounded-2xl bg-emerald-500/10 p-3 text-[11px] text-emerald-400 border border-emerald-500/25 leading-relaxed">
                          <span className="font-bold">AI Synergy Insight:</span> {team.synergy_reasoning}
                        </div>

                        <p className="text-xs text-muted italic leading-relaxed">"{team.pitch}"</p>

                        {/* Stack & Role */}
                        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-md bg-brand/15 px-2 py-0.5 text-[10px] font-bold text-brand border border-brand/30">
                            Role: {team.open_role_fit}
                          </span>
                          {team.current_stack?.map((s) => (
                            <Badge key={s} variant="skill">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-border/15 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-muted">
                          <strong className="text-fg font-bold">{team.spots_left}</strong> spots remaining
                        </span>
                        <button
                          onClick={() => handleJoinTeam(team.team_id)}
                          disabled={isJoined}
                          className={`rounded-2xl px-5 py-2 text-xs font-bold transition shadow-xs ${
                            isJoined
                              ? 'bg-emerald-500 text-black cursor-default font-extrabold'
                              : 'bg-brand text-brand-fg hover:opacity-95 shadow-glow btn-shine'
                          }`}
                        >
                          {isJoined ? '✓ Joined Squad' : 'Request to Join'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* AGENT 3: SAFE OUTSTATION TRANSIT & LOGISTICS */}
          {orchestrationResult.travelPlan && (
            <Reveal delay={300}>
              <div className="rounded-3xl border border-border/20 bg-surface p-6 sm:p-7 shadow-elevated">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-border/15 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm">
                      <Navigation className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                        Agent 3: Safe Transit & Logistics Planner
                      </span>
                      <h3 className="text-base font-bold text-fg font-display">
                        Door-to-Door Outstation Travel & Cost Split
                      </h3>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto rounded-full bg-emerald-500/15 px-3.5 py-1 text-xs font-extrabold text-emerald-400 border border-emerald-500/30 shadow-xs font-mono">
                    {orchestrationResult.travelPlan.cost_breakdown?.savings_vs_solo || 'Save ~55% vs Solo Travel'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Route Card */}
                  <div className="rounded-2xl border border-border/20 bg-surface-2 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-fg font-display">Matched Travel Pod</span>
                        <span className="rounded-full bg-brand/15 px-2.5 py-0.5 text-[10px] font-bold text-brand border border-brand/30 uppercase tracking-wide font-mono">
                          {orchestrationResult.travelPlan.transit_mode}
                        </span>
                      </div>

                      {/* Route visualization */}
                      <div className="rounded-xl bg-surface p-3.5 border border-border/20 mb-3.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-brand" />
                            <span className="font-extrabold text-fg">
                              {orchestrationResult.travelPlan.origin}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3">
                            <span className="h-px w-8 border-t border-dashed border-border/40" />
                            <Train className="h-4 w-4 text-brand" />
                            <span className="h-px w-8 border-t border-dashed border-border/40" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-fg">
                              {orchestrationResult.travelPlan.destination}
                            </span>
                            <div className="h-3 w-3 rounded-full bg-emerald-400" />
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-muted">
                        Organizer:{' '}
                        <span className="font-semibold text-fg">
                          {orchestrationResult.travelPlan.pod_organizer}
                        </span>
                      </p>
                      <p className="text-xs text-muted mt-1">
                        Departure: {orchestrationResult.travelPlan.departure_time}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-border/15 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider font-mono">
                          Estimated Split Cost
                        </p>
                        <p className="text-base font-extrabold text-emerald-400 font-mono">
                          {orchestrationResult.travelPlan.cost_breakdown?.total_estimated_pp || '₹1,030 / person'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleJoinPod(orchestrationResult.travelPlan.pod_id)}
                        disabled={joinedPods.has(orchestrationResult.travelPlan.pod_id)}
                        className={`rounded-2xl px-5 py-2.5 text-xs font-bold transition shadow-xs ${
                          joinedPods.has(orchestrationResult.travelPlan.pod_id)
                            ? 'bg-emerald-500 text-black cursor-default font-extrabold'
                            : 'bg-amber-500 text-black hover:opacity-95 font-extrabold shadow-glow btn-shine'
                        }`}
                      >
                        {joinedPods.has(orchestrationResult.travelPlan.pod_id)
                          ? '✓ Seat Booked'
                          : 'Join Travel Pod'}
                      </button>
                    </div>
                  </div>

                  {/* Safety & Protocol Card */}
                  <div className="rounded-2xl border border-border/20 bg-surface-2 p-5 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-fg mb-3 flex items-center gap-2 font-display">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        <span>Campus Safety & Verification Protocols</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs text-muted">
                        {orchestrationResult.travelPlan.safety_guidelines?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400 mt-0.5">
                              ✓
                            </span>
                            <span className="leading-relaxed text-fg">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => navigate('/chat')}
                      className="mt-5 w-full rounded-2xl border border-border/20 bg-surface py-2.5 text-xs font-bold text-fg hover:bg-surface-2 transition shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>Open Transit Coordination Chat Room</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          )}
        </div>
      )}
    </div>
  );
}
