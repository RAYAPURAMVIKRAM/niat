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
  ShieldCheck,
  Navigation
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import CoverImage from '../components/ui/CoverImage';
import Badge from '../components/ui/Badge';
import { EventCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Reveal from '../components/ui/Reveal';

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
    <div className="space-y-7">
      {/* Hero Banner with Executive Gradient & Metrics */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 sm:p-9 text-white shadow-elevated border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/20 px-3 py-1 text-xs font-semibold text-brand-300 border border-brand-500/30 mb-3.5 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-brand-400 animate-pulse" />
            <span className="font-tech uppercase tracking-wider text-[11px]">Autonomous Hackathon Copilot & Mobility</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display leading-tight">
            Discover Verified Hackathons, Form Complementary Squads & Travel Safe
          </h1>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Match with verified campus teammates via skill-complementarity reasoning, split outstation transit costs, and simulate multi-agent winning project blueprints.
          </p>

          {/* Quick Action Button Group inside Hero */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/agent')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 px-5 py-3 text-xs font-bold text-white shadow-glow hover:shadow-glow-lg transition-all scale-100 hover:scale-[1.02] btn-shine"
            >
              <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300" />
              <span>Launch 3-Agent AI Command Center</span>
            </button>

            <button
              onClick={onOpenHostEvent}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-800/80 px-4 py-3 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition shadow-subtle btn-shine"
            >
              <PlusCircle className="h-4 w-4 text-slate-400" />
              <span>Host / Post Event</span>
            </button>
          </div>
        </div>

        {/* Ambient subtle glow background */}
        <div className="absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl pointer-events-none animate-pulse-glow" />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white/80 backdrop-blur-md p-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search hackathons, topics (GenAI, Web3, Agents), colleges or cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition bg-white"
            />
          </div>

          {/* City Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 shrink-0 font-display">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full sm:w-44 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-800 focus:border-brand-600 focus:outline-none bg-white shadow-2xs"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
          <span className="text-xs font-bold text-slate-400 mr-1 shrink-0 font-tech">Type:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all shrink-0 font-display ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-subtle scale-102'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No events matched your search"
          description="Try broadening your city or category filter, or post a new campus hackathon directly to the board."
          actionLabel="Host / Post a Hackathon"
          onAction={onOpenHostEvent}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event, index) => (
            <Reveal
              key={event.id}
              delay={index * 60}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-subtle card-lift overflow-hidden"
            >
              <div>
                {/* Hero Cover Banner with Visual Mesh & Badges */}
                <CoverImage
                  seedKey={event.id || event.title}
                  title={event.title}
                  category={event.event_type}
                  className="mb-4 shadow-subtle"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="event-type">{event.event_type || 'Hackathon'}</Badge>
                    <Badge variant="prize">{event.prize_pool || '₹1,50,000'}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-white text-[11px] font-semibold drop-shadow-md">
                    <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                      <Calendar className="h-3 w-3 text-brand-300" />
                      {event.event_date}
                    </span>
                    <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                      <Users className="h-3 w-3 text-emerald-300" />
                      {event.attendees_count || 120}+ registered
                    </span>
                  </div>
                </CoverImage>

                {/* Event Title & Organizer */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition leading-snug font-display">
                  {event.title}
                </h3>

                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-1">
                  <span>By</span>
                  <span className="text-slate-800 font-semibold">{event.organizer}</span>
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 inline" title="Verified Campus Host" />
                </div>

                {/* Venue & Location */}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{event.venue}, <strong className="text-slate-800">{event.city}</strong></span>
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {event.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="skill">
                        #{tag}
                      </Badge>
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
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 via-indigo-600 to-violet-600 py-2.5 px-3.5 text-xs font-bold text-white shadow-subtle hover:shadow-glow transition-all btn-shine"
                >
                  <Sparkles className="h-4 w-4 text-amber-300 fill-amber-300" />
                  <span>Run Agentic AI Planner</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate(`/teams?eventId=${event.id}`)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50/80 py-2 text-xs font-bold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-900 transition btn-shine"
                  >
                    <Users className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Find Teammates</span>
                  </button>

                  <button
                    onClick={() => navigate(`/travel?eventId=${event.id}`)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/90 bg-slate-50/80 py-2 text-xs font-bold text-slate-700 hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-900 transition btn-shine"
                  >
                    <Navigation className="h-3.5 w-3.5 text-amber-600" />
                    <span>Travel Pods</span>
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
