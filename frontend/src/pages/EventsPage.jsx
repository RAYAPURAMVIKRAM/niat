import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Calendar,
  MapPin,
  Trophy,
  Users,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Filter,
  CheckCircle,
  Navigation
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

const CITIES = ['All', 'Bengaluru', 'Chennai', 'Warangal', 'Hyderabad', 'New Delhi', 'Mumbai'];
const CATEGORIES = ['All', 'Hackathon', 'National Hackathon', 'Tech Fest', 'Datathon', 'Sprint'];

export default function EventsPage({ onOpenHostEvent }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      setEvents(res.data?.events || []);
    } catch (err) {
      console.warn('Events fetch fallback:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.organizer.toLowerCase().includes(search.toLowerCase()) ||
      ev.city.toLowerCase().includes(search.toLowerCase()) ||
      (ev.tags && ev.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));

    const matchesCity = selectedCity === 'All' || ev.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesCategory = selectedCategory === 'All' || ev.event_type === selectedCategory;

    return matchesSearch && matchesCity && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Hero Banner with Executive Gradient & Metrics */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 p-6 sm:p-8 text-white shadow-elevated border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-300 border border-brand-500/30 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-brand-400" />
            <span>Autonomous Hackathon Copilot & Student Mobility</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Discover Verified Hackathons, Form Complementary Squads & Travel Safe
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Match with verified teammates via skill-complementarity reasoning, split outstation transit costs, and simulate multi-agent winning project blueprints.
          </p>

          {/* Quick Action Button Group inside Hero */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/agent')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-brand-500 hover:to-indigo-500 transition scale-100 hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Launch 3-Agent AI Command Center</span>
            </button>

            <button
              onClick={onOpenHostEvent}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
            >
              <PlusCircle className="h-4 w-4 text-slate-400" />
              <span>Host / Post Event</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-brand-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hackathons, topics (GenAI, Web3, Agents), colleges or cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-900 focus:border-brand-600 focus:outline-none"
            />
          </div>

          {/* City Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 shrink-0">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full sm:w-40 rounded-lg border border-slate-200 px-2.5 py-2 text-xs font-medium text-slate-800 focus:border-brand-600 focus:outline-none bg-white"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
          <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0">Type:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse">
              <div className="h-6 w-3/4 rounded bg-slate-200 mb-3" />
              <div className="h-4 w-1/2 rounded bg-slate-100 mb-6" />
              <div className="h-10 w-full rounded bg-slate-100 mb-4" />
              <div className="h-8 w-full rounded bg-slate-200 mt-auto" />
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-slate-400 mb-2" />
          <h3 className="text-sm font-bold text-slate-900">No events matched your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or city filters, or host a new hackathon event directly.
          </p>
          <button
            onClick={onOpenHostEvent}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-brand-700 transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Post a Hackathon</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle hover:border-slate-300 hover:shadow-elevated transition-all"
            >
              <div>
                {/* Event Type & Prize Pool Badge */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center rounded-md bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-700 border border-brand-200">
                    {event.event_type || 'Hackathon'}
                  </span>
                  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
                    <Trophy className="h-3.5 w-3.5 text-amber-600" />
                    <span>{event.prize_pool || '₹1,50,000'}</span>
                  </div>
                </div>

                {/* Event Title & Organizer */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition leading-snug">
                  {event.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  By <span className="text-slate-700 font-semibold">{event.organizer}</span>
                </p>

                {/* Date & Location */}
                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700">{event.event_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span className="truncate">{event.venue}, {event.city}</span>
                  </div>
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {event.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200/60"
                      >
                        #{tag}
                      </span>
                    ))}
                    {event.tags.length > 4 && (
                      <span className="rounded-md bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                        +{event.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons: AI Orchestrator, Teams, Travel */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => navigate(`/agent?eventId=${event.id}`)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 to-indigo-600 py-2.5 px-3 text-xs font-bold text-white shadow-xs hover:from-brand-600 hover:to-indigo-500 transition"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Run Agentic AI Planner</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate(`/teams?eventId=${event.id}`)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition"
                  >
                    <Users className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Find Teammates</span>
                  </button>

                  <button
                    onClick={() => navigate(`/travel?eventId=${event.id}`)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/70 py-2 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-100 transition"
                  >
                    <Navigation className="h-3.5 w-3.5 text-amber-600" />
                    <span>Travel Pods</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
