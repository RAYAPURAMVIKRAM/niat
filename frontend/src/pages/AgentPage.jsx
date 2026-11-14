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
  Calendar
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Executive Command Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 p-6 sm:p-8 text-white shadow-elevated border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-300 border border-brand-500/30 mb-2">
              <Cpu className="h-3.5 w-3.5 text-brand-400" />
              <span>Multi-Agent Autonomous Pipeline (Powered by Gemini AI)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Autonomous 3-Agent AI Command Center
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
              Fuses track strategy, database teammate complement-ranking, and door-to-door outstation logistics into a single automated execution.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-300">Agents Ready to Deploy</span>
          </div>
        </div>
      </div>

      {/* Target Parameters Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-subtle">
        <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Compass className="h-4 w-4 text-brand-600" />
          <span>Mission Objectives & Hacker Profile</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Target Event Dropdown */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Hackathon</label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-900 focus:border-brand-600 focus:outline-none bg-white"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title} ({ev.city} - {ev.prize_pool})
                </option>
              ))}
            </select>
            {selectedEvent && (
              <p className="mt-1 text-[11px] text-slate-500 truncate">
                Venue: {selectedEvent.venue}, {selectedEvent.city}
              </p>
            )}
          </div>

          {/* Your Skills */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Your Skills & Tech Stack
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Next.js, FastAPI, Python, AI"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-900 focus:border-brand-600 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Agent 2 uses this to compute complementary squad match percentages.
            </p>
          </div>

          {/* Custom Hackathon Goal */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Mission Goal
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Win 1st place in AI track with strong team"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-900 focus:border-brand-600 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Agent 1 uses this to align winning architecture.
            </p>
          </div>
        </div>

        {/* Big Launch Trigger Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Multi-tier safety checks and live Supabase database queries active</span>
          </div>

          <button
            onClick={handleLaunchAgent}
            disabled={running}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 px-6 py-3 text-xs font-bold text-white shadow-md hover:from-brand-500 hover:to-indigo-500 transition scale-100 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Orchestrating Autonomous Agents...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300" />
                <span>🚀 Launch Autonomous 3-Agent Workflow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Agent Execution Pipeline Status */}
      {running && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-6 shadow-subtle animate-in fade-in">
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900 mb-4 flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
            <span>Agent Orchestration Pipeline In Progress...</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div
              className={`rounded-xl p-4 border transition ${
                activeStepIndex >= 1
                  ? 'bg-white border-brand-300 shadow-sm'
                  : 'bg-white/50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold">
                  1
                </span>
                <span className="text-xs font-bold text-slate-900">Track & Blueprint Strategist</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Synthesizing highest probability hackathon project track based on skill synergy...
              </p>
            </div>

            {/* Step 2 */}
            <div
              className={`rounded-xl p-4 border transition ${
                activeStepIndex >= 2
                  ? 'bg-white border-brand-300 shadow-sm'
                  : 'bg-white/50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold">
                  2
                </span>
                <span className="text-xs font-bold text-slate-900">Skill-Complement Matcher</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Querying live Supabase team posts & calculating skill-overlap percentages...
              </p>
            </div>

            {/* Step 3 */}
            <div
              className={`rounded-xl p-4 border transition ${
                activeStepIndex >= 3
                  ? 'bg-white border-brand-300 shadow-sm'
                  : 'bg-white/50 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold">
                  3
                </span>
                <span className="text-xs font-bold text-slate-900">Transit & Logistics Planner</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Routing door-to-door travel pod & estimating per-person split savings...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Orchestration Results Display */}
      {orchestrationResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3">
          {/* Agent Pipeline Steps Summary Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Autonomous 3-Agent Workflow Execution Completed
                </h3>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                Mode: {orchestrationResult.meta?.mode || 'Hybrid Orchestrator'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {orchestrationResult.agentSteps?.map((step) => (
                <div key={step.step} className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-[10px] text-white">
                      {step.step}
                    </span>
                    <span>{step.agent_name}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{step.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AGENT 1: WINNING PROJECT BLUEPRINT */}
          {orchestrationResult.hackathonBlueprint && (
            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-white p-6 shadow-subtle">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Trophy className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                      Agent 1: Event & Track Strategist
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {orchestrationResult.hackathonBlueprint.project_title}
                    </h3>
                  </div>
                </div>

                <div className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 border border-indigo-200">
                  {orchestrationResult.hackathonBlueprint.strategic_fit_score || 95}% Track Synergy Fit
                </div>
              </div>

              {/* Pitch Hook */}
              <div className="rounded-xl bg-white p-4 border border-indigo-100 shadow-xs mb-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Winning USP Hook</p>
                <p className="text-xs font-medium text-slate-800 leading-relaxed">
                  "{orchestrationResult.hackathonBlueprint.project_pitch}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Recommended Track */}
                <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <p className="font-semibold text-slate-500 mb-1">Recommended Track</p>
                  <p className="font-bold text-brand-700 text-sm">
                    {orchestrationResult.hackathonBlueprint.recommended_track}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Optimized for highest jury score based on current market trends & team skills.
                  </p>
                </div>

                {/* Recommended Tech Stack */}
                <div className="rounded-xl border border-slate-200 bg-white p-3.5">
                  <p className="font-semibold text-slate-500 mb-1.5">Suggested Architecture Stack</p>
                  <div className="flex flex-wrap gap-1.5">
                    {orchestrationResult.hackathonBlueprint.recommended_tech_stack?.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 36-Hour Sprint Milestones */}
              {orchestrationResult.hackathonBlueprint.milestone_timeline && (
                <div className="mt-4 pt-4 border-t border-indigo-100">
                  <p className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-brand-600" />
                    <span>36-Hour Hackathon Sprint Milestones</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    {orchestrationResult.hackathonBlueprint.milestone_timeline.map((m) => (
                      <div key={m.hours} className="rounded-lg bg-white p-2.5 border border-slate-200">
                        <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {m.hours}
                        </span>
                        <p className="font-bold text-slate-900 mt-1">{m.phase}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{m.goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AGENT 2: SKILL-COMPLEMENTARITY TEAM MATCHER */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <Users className="h-4 w-4" />
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
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>View All Bounties</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orchestrationResult.recommendedTeams?.map((team) => {
                const isJoined = joinedTeams.has(team.team_id);
                return (
                  <div
                    key={team.team_id || team.team_name}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-slate-300 hover:bg-white transition shadow-xs"
                  >
                    <div>
                      {/* Top Bar with Match Score Ring */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-slate-900">{team.team_name}</h4>
                        <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-extrabold text-emerald-800 border border-emerald-300">
                          <Zap className="h-3 w-3 text-emerald-600 fill-emerald-600" />
                          <span>{team.compatibility_percentage}% Match</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500">
                        Lead: <span className="font-semibold text-slate-700">{team.author_name}</span> ({team.author_college})
                      </p>

                      {/* Synergy Reasoning */}
                      <div className="my-2.5 rounded-lg bg-emerald-50/70 p-2.5 text-[11px] text-emerald-900 border border-emerald-200/80 leading-relaxed">
                        <span className="font-bold">AI Synergy Insight:</span> {team.synergy_reasoning}
                      </div>

                      <p className="text-xs text-slate-600 italic">"{team.pitch}"</p>

                      {/* Stack & Role */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className="rounded bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 border border-brand-200">
                          Role: {team.open_role_fit}
                        </span>
                        {team.current_stack?.map((s) => (
                          <span
                            key={s}
                            className="rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-slate-500">
                        {team.spots_left} spots remaining
                      </span>
                      <button
                        onClick={() => handleJoinTeam(team.team_id)}
                        disabled={isJoined}
                        className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition shadow-xs ${
                          isJoined
                            ? 'bg-emerald-600 text-white cursor-default'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
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

          {/* AGENT 3: SAFE OUTSTATION TRANSIT & LOGISTICS */}
          {orchestrationResult.travelPlan && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600 text-white">
                    <Navigation className="h-4 w-4" />
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

                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
                  {orchestrationResult.travelPlan.cost_breakdown?.savings_vs_solo || 'Save ~55%'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Route Card */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-900">Matched Travel Pod</span>
                    <span className="rounded bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 border border-brand-200">
                      {orchestrationResult.travelPlan.transit_mode}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs mb-3">
                    <div className="font-bold text-slate-800">{orchestrationResult.travelPlan.origin}</div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    <div className="font-bold text-slate-800">{orchestrationResult.travelPlan.destination}</div>
                  </div>

                  <p className="text-xs text-slate-600">
                    Organizer: <span className="font-semibold text-slate-800">{orchestrationResult.travelPlan.pod_organizer}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Departure: {orchestrationResult.travelPlan.departure_time}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-500">Estimated Split Cost</p>
                      <p className="text-sm font-extrabold text-emerald-700">
                        {orchestrationResult.travelPlan.cost_breakdown?.total_estimated_pp || '₹1,030 / person'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleJoinPod(orchestrationResult.travelPlan.pod_id)}
                      disabled={joinedPods.has(orchestrationResult.travelPlan.pod_id)}
                      className={`rounded-lg px-4 py-1.5 text-xs font-bold transition shadow-xs ${
                        joinedPods.has(orchestrationResult.travelPlan.pod_id)
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-amber-600 text-white hover:bg-amber-700'
                      }`}
                    >
                      {joinedPods.has(orchestrationResult.travelPlan.pod_id) ? '✓ Seat Booked' : 'Join Travel Pod'}
                    </button>
                  </div>
                </div>

                {/* Safety & Protocol Card */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>Campus Safety & Verification Protocols</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {orchestrationResult.travelPlan.safety_guidelines?.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 mt-0.5">
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate('/chat')}
                    className="mt-4 w-full rounded-lg border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Open Transit Coordination Chat Room
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
