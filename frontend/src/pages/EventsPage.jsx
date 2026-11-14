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
  Navigation,
  Heart,
  Flame,
  Clock,
  Compass,
  Radio
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CoverImage from '../components/ui/CoverImage';
import Badge from '../components/ui/Badge';
import { EventCardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Reveal from '../components/ui/Reveal';
import Marquee from '../components/ui/Marquee';
import CountUp from '../components/ui/CountUp';

const CITIES = ['All', 'Bengaluru', 'Chennai', 'Warangal', 'Hyderabad', 'New Delhi', 'Mumbai'];
const CATEGORIES = ['All', 'Hackathon', 'National Hackathon', 'Tech Fest', 'Datathon', 'Sprint'];

const ROTATING_WORDS = ['Hackathons', 'Teammates', 'Travel Pods', 'Campus Trust'];

export default function EventsPage({ onOpenHostEvent }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wordIndex, setWordIndex] = useState(0);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('hacksphere_bookmarked_events');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  // Rotating headline word timer
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

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

  const toggleBookmark = (id, title) => {
    let next;
    if (bookmarkedIds.includes(id)) {
      next = bookmarkedIds.filter((item) => item !== id);
      toast.info(`Removed "${title}" from saved`);
    } else {
      next = [...bookmarkedIds, id];
      toast.success(`Saved "${title}" to your favorites!`);
    }
    setBookmarkedIds(next);
    try {
      localStorage.setItem('hacksphere_bookmarked_events', JSON.stringify(next));
    } catch (e) {}
  };

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

  // Derived live stats from existing events data
  const totalAttendees = events.reduce((acc, ev) => acc + (ev.attendees_count || 100), 0);
  const distinctCities = new Set(events.map((e) => e.city)).size;

  return (
    <div className="space-y-7">
      {/* Hero Banner with Executive Themed Gradient & Metrics */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 text-fg shadow-elevated border border-border/20 bg-surface">
        {/* Themed mesh & ambient glows */}
        <div
          className="absolute inset-0 pointer-events-none opacity-80"
          style={{ backgroundImage: 'var(--grad-mesh)' }}
        />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-brand/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/15 px-3.5 py-1 text-xs font-bold text-brand border border-brand/30 backdrop-blur-md shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span className="font-mono uppercase tracking-wider text-[11px]">
              Autonomous Hackathon Copilot & Mobility
            </span>
          </div>

          <h1 className="text-hero font-extrabold tracking-tight text-fg font-display leading-[1.1]">
            Find Verified{' '}
            <span className="inline-block text-brand underline decoration-brand/30 decoration-wavy transition-all duration-300">
              {ROTATING_WORDS[wordIndex]}
            </span>
            <br />
            Form Squads & Travel Safe.
          </h1>

          <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-2xl font-sans">
            Match with verified campus teammates via skill-complementarity reasoning, split outstation transit costs, and simulate multi-agent winning project blueprints.
          </p>

          {/* Quick Action Button Group inside Hero */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/agent')}
              className="inline-flex items-center gap-2.5 rounded-2xl bg-brand text-brand-fg px-6 py-3.5 text-xs font-bold shadow-glow hover:opacity-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 btn-shine"
            >
              <Sparkles className="h-4 w-4" />
              <span>Launch 3-Agent AI Command Center</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenHostEvent}
              className="inline-flex items-center gap-2 rounded-2xl border border-border/25 bg-surface-2/80 px-5 py-3.5 text-xs font-bold text-fg hover:border-brand/40 hover:bg-surface-2 transition shadow-subtle btn-shine"
            >
              <PlusCircle className="h-4 w-4 text-brand" />
              <span>Host / Post Event</span>
            </button>
          </div>
        </div>

        {/* Live Stats Strip Banner */}
        <div className="relative z-10 mt-8 pt-6 border-t border-border/15 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-fg font-display">
              <CountUp end={events.length || 5} suffix="+" />
            </p>
            <p className="text-[11px] text-muted font-medium">National Hackathons</p>
          </div>

          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-brand font-display">
              ₹<CountUp end={850000} duration={1500} suffix="+" />
            </p>
            <p className="text-[11px] text-muted font-medium">Active Prize Pool</p>
          </div>

          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-emerald-400 font-display">
              <CountUp end={totalAttendees || 1420} suffix="+" />
            </p>
            <p className="text-[11px] text-muted font-medium">Student Hackers</p>
          </div>

          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-accent font-display">
              <CountUp end={distinctCities || 6} suffix=" Hubs" />
            </p>
            <p className="text-[11px] text-muted font-medium">Campus Transit Nodes</p>
          </div>
        </div>
      </div>

      {/* Marquee Ticker of Upcoming Hackathons */}
      <Marquee items={events} />

      {/* Filter and Search Bar (Sticky Glass) */}
      <div className="sticky top-20 z-30 flex flex-col gap-3 rounded-2xl border border-border/20 bg-surface/90 backdrop-blur-xl p-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search hackathons, topics (GenAI, Web3, Agents), colleges or cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/20 pl-10 pr-3.5 py-2.5 text-xs text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none transition bg-surface-2/60"
            />
          </div>

          {/* City Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-muted shrink-0 font-display">City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full sm:w-44 rounded-xl border border-border/20 px-3 py-2.5 text-xs font-semibold text-fg focus:border-brand focus:outline-none bg-surface-2/60 shadow-2xs"
            >
              {CITIES.map((c) => (
                <option key={c} value={c} className="bg-surface text-fg">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
          <span className="text-xs font-bold text-muted mr-1 shrink-0 font-mono">Type:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3.5 py-1 text-xs font-bold transition-all shrink-0 font-display ${
                selectedCategory === cat
                  ? 'bg-brand text-brand-fg shadow-subtle'
                  : 'bg-surface-2 text-muted hover:bg-surface-2/80 hover:text-fg'
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
          {filteredEvents.map((event, index) => {
            const isBookmarked = bookmarkedIds.includes(event.id);
            const isTopPrize = index === 0;

            return (
              <Reveal
                key={event.id}
                delay={index * 60}
                className="group flex flex-col justify-between rounded-3xl border border-border/20 bg-surface p-4 sm:p-5 shadow-subtle card-lift overflow-hidden relative"
              >
                <div>
                  {/* Hero Cover Banner with Visual Mesh & Badges */}
                  <CoverImage
                    seedKey={event.id || event.title}
                    title={event.title}
                    category={event.event_type}
                    className="mb-4 shadow-subtle relative"
                  >
                    {/* Top Row: Type & Prize Badges + Bookmark Toggle */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Badge variant="event-type">{event.event_type || 'Hackathon'}</Badge>
                        {isTopPrize && (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-[10px] font-bold">
                            <Flame className="h-3 w-3 fill-amber-400" /> Trending
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="prize">{event.prize_pool || '₹1,50,000'}</Badge>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(event.id, event.title);
                          }}
                          className={`p-1.5 rounded-full backdrop-blur-md border transition ${
                            isBookmarked
                              ? 'bg-rose-500/30 text-rose-300 border-rose-500/50'
                              : 'bg-black/40 text-white/80 border-white/20 hover:text-white'
                          }`}
                          title={isBookmarked ? 'Saved' : 'Save event'}
                        >
                          <Heart className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-rose-400' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Bottom Row on Cover */}
                    <div className="flex items-center justify-between text-white text-[11px] font-semibold drop-shadow-md">
                      <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10 font-mono">
                        <Calendar className="h-3 w-3 text-brand" />
                        {event.event_date}
                      </span>
                      <span className="flex items-center gap-1 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/10 font-mono">
                        <Users className="h-3 w-3 text-emerald-300" />
                        {event.attendees_count || 120}+ registered
                      </span>
                    </div>
                  </CoverImage>

                  {/* Event Title & Organizer */}
                  <h3 className="text-base font-bold text-fg group-hover:text-brand transition leading-snug font-display">
                    {event.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted mt-1">
                    <span>By</span>
                    <span className="text-fg font-semibold">{event.organizer}</span>
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 inline" title="Verified Campus Host" />
                  </div>

                  {/* Venue & Location */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                    <MapPin className="h-3.5 w-3.5 text-muted shrink-0" />
                    <span className="truncate">
                      {event.venue}, <strong className="text-fg">{event.city}</strong>
                    </span>
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
                        <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted">
                          +{event.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons: AI Orchestrator, Teams, Travel */}
                <div className="mt-5 pt-4 border-t border-border/15 space-y-2">
                  <button
                    onClick={() => navigate(`/agent?eventId=${event.id}`)}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand text-brand-fg py-2.5 px-3.5 text-xs font-bold shadow-glow hover:opacity-95 transition-all btn-shine"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Run Agentic AI Planner</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => navigate(`/teams?eventId=${event.id}`)}
                      className="flex items-center justify-center gap-1.5 rounded-2xl border border-border/20 bg-surface-2 py-2 text-xs font-bold text-fg hover:border-emerald-500/50 hover:bg-emerald-500/10 transition btn-shine"
                    >
                      <Users className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Find Teammates</span>
                    </button>

                    <button
                      onClick={() => navigate(`/travel?eventId=${event.id}`)}
                      className="flex items-center justify-center gap-1.5 rounded-2xl border border-border/20 bg-surface-2 py-2 text-xs font-bold text-fg hover:border-amber-500/50 hover:bg-amber-500/10 transition btn-shine"
                    >
                      <Navigation className="h-3.5 w-3.5 text-amber-400" />
                      <span>Travel Pods</span>
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
