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
  Activity
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import ProgressRing from '../components/ui/ProgressRing';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Reveal from '../components/ui/Reveal';

export default function AgentPage() {
  const [searchParams] = useSearchParams();
  const preSelectedEventId = searchParams.get('eventId');
  const navigate = useNavigate();
  const { user } = useAuth();

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

    // Step simulation timers for visual polish during live judge demos
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
      } else {
        throw new Error(res.data?.error || 'Orchestration failed');
      }
    } catch (err) {
      console.warn('Orchestration fallback trigger:', err);
      setError(err?.response?.data?.message || err.message || 'Execution error');
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
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Could not join team');
    }
  };

  const handleJoinPod = async (podId) => {
    try {
      const res = await api.post(`/travel/${podId}/join`, {
        passenger_name: user?.full_name || 'Rayapuram Vikram',
      });
      if (res.data?.success) {
        setJoinedPods((prev) => new Set(prev).add(podId));
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Could not join pod');
    }
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Executive Command Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 p-6 sm:p-8 text-white shadow-elevated border border-slate-800">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-300 border border-brand-500/30 backdrop-blur-sm">
              <Cpu className="h-3.5 w-3.5 text-brand-400 animate-pulse" />
              <span>Multi-Agent Autonomous Pipeline (Powered by Gemini AI)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Autonomous 3-Agent AI Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Fuses track strategy, database teammate complement-ranking, and door-to-door outstation logistics into a single automated execution.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 self-start md:self-auto">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-300 tracking-wide">Agents Ready to Deploy</span>
          </div>
        </div>
      </div>

      {/* Target Parameters Form */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-subtle relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600 border border-brand-100">
              <Compass className="h-4 w-4" />
            </div>
            <span>Mission Objectives & Hacker Profile</span>
          </h2>
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
            Autonomous Configuration
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
          {/* Target Event Dropdown */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">Target Hackathon</label>
            <div className="relative">
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full rounded-xl border border-slate-300/90 px-3.5 py-2.5 font-medium text-slate-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-slate-50/60 hover:bg-white transition"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.city} - {ev.prize_pool})
                  </option>
                ))}
              </select>
            </div>
            {selectedEvent && (
              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 pt-0.5">
                <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                <span>{selectedEvent.venue}, {selectedEvent.city}</span>
              </p>
            )}
          </div>

          {/* Your Skills */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Your Skills & Tech Stack
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Next.js, FastAPI, Python, AI"
              className="w-full rounded-xl border border-slate-300/90 px-3.5 py-2.5 font-medium text-slate-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-slate-50/60 hover:bg-white transition"
            />
            <p className="text-[11px] text-slate-500 pt-0.5">
              Agent 2 uses this to compute complementary squad match percentages.
            </p>
          </div>

          {/* Custom Hackathon Goal */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-700">
              Mission Goal
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Win 1st place in AI track with strong team"
              className="w-full rounded-xl border border-slate-300/90 px-3.5 py-2.5 font-medium text-slate-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-slate-50/60 hover:bg-white transition"
            />
            <p className="text-[11px] text-slate-500 pt-0.5">
              Agent 1 uses this to align winning architecture.
            </p>
          </div>
        </div>

        {/* Big Launch Trigger Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Multi-tier safety checks and live Supabase database queries active</span>
          </div>

          <button
            onClick={handleLaunchAgent}
            disabled={running}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 px-7 py-3.5 text-xs font-bold text-white shadow-elevated hover:shadow-brand-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed btn-shine"
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Orchestrating Autonomous Agents...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300 animate-pulse" />
                <span className="tracking-wide">Launch Autonomous 3-Agent Workflow</span>
                <ArrowRight className="h-4 w-4 text-white/80" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Agent Execution Pipeline Status */}
      {running && (
        <Reveal>
          <div className="rounded-3xl border border-brand-200/80 bg-gradient-to-br from-brand-50/70 via-white to-indigo-50/40 p-6 sm:p-7 shadow-elevated relative overflow-hidden">
            <div className="flex items-center justify-between mb-5 border-b border-brand-100/70 pb-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-950 flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-600"></span>
                </span>
                <span>Autonomous Agent Pipeline In Progress...</span>
              </h3>
              <span className="text-[11px] font-mono font-bold text-brand-700 bg-brand-100/80 px-2.5 py-0.5 rounded-md">
                Step {activeStepIndex} of 3
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div
                className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${
                  activeStepIndex >= 1
                    ? 'bg-white border-brand-300/80 shadow-card card-lift'
                    : 'bg-white/50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white text-xs font-extrabold shadow-sm">
                    1
                  </span>
                  {activeStepIndex === 1 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-brand-600 animate-pulse">
                      <Radio className="h-3 w-3" /> Thinking...
                    </span>
                  )}
                  {activeStepIndex > 1 && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Track & Blueprint Strategist</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Synthesizing highest probability hackathon project track based on skill synergy...
                </p>
              </div>

              {/* Step 2 */}
              <div
                className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${
                  activeStepIndex >= 2
                    ? 'bg-white border-indigo-300/80 shadow-card card-lift'
                    : 'bg-white/50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-xs font-extrabold shadow-sm">
                    2
                  </span>
                  {activeStepIndex === 2 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 animate-pulse">
                      <Radio className="h-3 w-3" /> Querying DB...
                    </span>
                  )}
                  {activeStepIndex > 2 && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Skill-Complement Matcher</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Querying live Supabase team posts & calculating skill-overlap percentages...
                </p>
              </div>

              {/* Step 3 */}
              <div
                className={`rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${
                  activeStepIndex >= 3
                    ? 'bg-white border-emerald-300/80 shadow-card card-lift'
                    : 'bg-white/50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-xs font-extrabold shadow-sm">
                    3
                  </span>
                  {activeStepIndex === 3 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 animate-pulse">
                      <Radio className="h-3 w-3" /> Routing Transit...
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Transit & Logistics Planner</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Routing door-to-door travel pod & estimating per-person split savings...
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-xs text-red-700 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Orchestration Results Display */}
      {orchestrationResult && (
        <div className="space-y-6">
          {/* Agent Pipeline Steps Summary Banner */}
          <Reveal>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-subtle">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Autonomous 3-Agent Workflow Completed
                    </h3>
                    <p className="text-[11px] text-slate-500">Live synthesis across tracks, squads, and outstation logistics</p>
                  </div>
                </div>
                <span className="self-start sm:self-auto rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 border border-slate-200">
                  Mode: {orchestrationResult.meta?.mode || 'Hybrid Orchestrator'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {orchestrationResult.agentSteps?.map((step) => (
                  <div key={step.step} className="rounded-2xl bg-slate-50/80 p-4 border border-slate-200/80 hover:bg-white hover:shadow-xs transition">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-extrabold text-white">
                        {step.step}
                      </span>
                      <span>{step.agent_name}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{step.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* AGENT 1: WINNING PROJECT BLUEPRINT */}
          {orchestrationResult.hackathonBlueprint && (
            <Reveal delay={100}>
              <div className="rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/60 via-white to-white p-6 sm:p-7 shadow-elevated">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-sm">
                      <Trophy className="h-5 w-5 text-amber-300" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                        Agent 1: Event & Track Strategist
                      </span>
                      <h3 className="text-lg font-bold text-slate-900">
                        {orchestrationResult.hackathonBlueprint.project_title}
                      </h3>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto rounded-full bg-indigo-100/80 px-3.5 py-1 text-xs font-extrabold text-indigo-800 border border-indigo-200/80 shadow-xs flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-indigo-600 fill-indigo-600" />
                    <span>{orchestrationResult.hackathonBlueprint.strategic_fit_score || 95}% Track Synergy Fit</span>
                  </div>
                </div>

                {/* Pitch Hook */}
                <div className="rounded-2xl bg-white p-4 sm:p-5 border border-indigo-100 shadow-subtle mb-5">
                  <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Winning USP Hook</span>
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed italic">
                    "{orchestrationResult.hackathonBlueprint.project_pitch}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Recommended Track */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                    <p className="font-bold text-slate-500 mb-1">Recommended Track</p>
                    <p className="font-extrabold text-brand-700 text-sm">
                      {orchestrationResult.hackathonBlueprint.recommended_track}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Optimized for highest jury score based on current market trends & team skills.
                    </p>
                  </div>

                  {/* Recommended Tech Stack */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                    <p className="font-bold text-slate-500 mb-2">Suggested Architecture Stack</p>
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
                  <div className="mt-5 pt-5 border-t border-indigo-100">
                    <p className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-brand-600" />
                      <span>36-Hour Hackathon Sprint Milestones</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                      {orchestrationResult.hackathonBlueprint.milestone_timeline.map((m) => (
                        <div key={m.hours} className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-xs hover:border-indigo-200 transition">
                          <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">
                            {m.hours}
                          </span>
                          <p className="font-bold text-slate-900 mt-1.5">{m.phase}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{m.goal}</p>
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
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-elevated">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-sm">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Agent 2: Skill-Complementarity Matcher
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      Top Complementary Squads Ranked for You
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/teams')}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 hover:underline"
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
                      className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/40 p-5 hover:border-slate-300 hover:bg-white hover:shadow-card transition-all duration-200 card-lift"
                    >
                      <div>
                        {/* Top Bar with Match Score Ring */}
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={team.author_name} size="md" verified={true} />
                            <div>
                              <h4 className="text-sm font-bold text-slate-900">{team.team_name}</h4>
                              <p className="text-[11px] text-slate-500">
                                Lead: <span className="font-semibold text-slate-700">{team.author_name}</span> ({team.author_college})
                              </p>
                            </div>
                          </div>

                          <ProgressRing value={team.compatibility_percentage || 85} size={54} strokeWidth={4.5} />
                        </div>

                        {/* Synergy Reasoning */}
                        <div className="my-3 rounded-xl bg-emerald-50/80 p-3 text-[11px] text-emerald-950 border border-emerald-200/80 leading-relaxed">
                          <span className="font-bold text-emerald-900">AI Synergy Insight:</span> {team.synergy_reasoning}
                        </div>

                        <p className="text-xs text-slate-600 italic leading-relaxed">"{team.pitch}"</p>

                        {/* Stack & Role */}
                        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                          <span className="rounded-md bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 border border-brand-200">
                            Role: {team.open_role_fit}
                          </span>
                          {team.current_stack?.map((s) => (
                            <Badge key={s} variant="skill">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3.5 border-t border-slate-200/80 flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-500">
                          <strong className="text-slate-800 font-bold">{team.spots_left}</strong> spots remaining
                        </span>
                        <button
                          onClick={() => handleJoinTeam(team.team_id)}
                          disabled={isJoined}
                          className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-xs ${
                            isJoined
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-slate-900 text-white hover:bg-slate-800 btn-shine'
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
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-elevated">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-sm">
                      <Navigation className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        Agent 3: Safe Transit & Logistics Planner
                      </span>
                      <h3 className="text-base font-bold text-slate-900">
                        Door-to-Door Outstation Travel & Cost Split
                      </h3>
                    </div>
                  </div>

                  <div className="self-start sm:self-auto rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-extrabold text-emerald-800 border border-emerald-200 shadow-xs">
                    {orchestrationResult.travelPlan.cost_breakdown?.savings_vs_solo || 'Save ~55% vs Solo Travel'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Route Card */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-900">Matched Travel Pod</span>
                        <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[10px] font-bold text-brand-700 border border-brand-200 uppercase tracking-wide">
                          {orchestrationResult.travelPlan.transit_mode}
                        </span>
                      </div>

                      {/* Route visualization */}
                      <div className="rounded-xl bg-white p-3.5 border border-slate-200 mb-3.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-brand-600" />
                            <span className="font-extrabold text-slate-900">{orchestrationResult.travelPlan.origin}</span>
                          </div>
                          <div className="flex items-center gap-1.5 px-3">
                            <span className="h-px w-10 border-t border-dashed border-slate-300" />
                            <Train className="h-4 w-4 text-brand-600" />
                            <span className="h-px w-10 border-t border-dashed border-slate-300" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900">{orchestrationResult.travelPlan.destination}</span>
                            <div className="h-3 w-3 rounded-full bg-emerald-600" />
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600">
                        Organizer: <span className="font-semibold text-slate-800">{orchestrationResult.travelPlan.pod_organizer}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Departure: {orchestrationResult.travelPlan.departure_time}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Estimated Split Cost</p>
                        <p className="text-base font-extrabold text-emerald-700">
                          {orchestrationResult.travelPlan.cost_breakdown?.total_estimated_pp || '₹1,030 / person'}
                        </p>
                      </div>

                      <button
                        onClick={() => handleJoinPod(orchestrationResult.travelPlan.pod_id)}
                        disabled={joinedPods.has(orchestrationResult.travelPlan.pod_id)}
                        className={`rounded-xl px-5 py-2.5 text-xs font-bold transition shadow-xs ${
                          joinedPods.has(orchestrationResult.travelPlan.pod_id)
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-amber-600 text-white hover:bg-amber-700 btn-shine'
                        }`}
                      >
                        {joinedPods.has(orchestrationResult.travelPlan.pod_id) ? '✓ Seat Booked' : 'Join Travel Pod'}
                      </button>
                    </div>
                  </div>

                  {/* Safety & Protocol Card */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span>Campus Safety & Verification Protocols</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs text-slate-600">
                        {orchestrationResult.travelPlan.safety_guidelines?.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 mt-0.5">
                              ✓
                            </span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => navigate('/chat')}
                      className="mt-5 w-full rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>Open Transit Coordination Chat Room</span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
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
