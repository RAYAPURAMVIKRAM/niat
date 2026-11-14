import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Navigation,
  MapPin,
  Calendar,
  Users,
  Shield,
  PlusCircle,
  Search,
  CheckCircle2,
  Train,
  Bus,
  Plane,
  Car,
  ArrowRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { TravelCardSkeleton } from '../components/ui/Skeleton';
import Reveal from '../components/ui/Reveal';
import Confetti from '../components/ui/Confetti';

export default function TravelPage({ onOpenCreateTravel }) {
  const [pods, setPods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [originSearch, setOriginSearch] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [womenOnlyFilter, setWomenOnlyFilter] = useState(false);
  const [searchParams] = useSearchParams();
  const eventIdFilter = searchParams.get('eventId');
  const [joiningId, setJoiningId] = useState(null);
  const [joinedSet, setJoinedSet] = useState(new Set());
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const fetchPods = async () => {
    setLoading(true);
    try {
      let url = '/travel';
      const params = [];
      if (eventIdFilter) params.push(`event_id=${eventIdFilter}`);
      if (womenOnlyFilter) params.push(`women_only=true`);
      if (params.length > 0) url += `?${params.join('&')}`;

      const res = await api.get(url);
      setPods(res.data?.travel_pods || []);
    } catch (err) {
      console.warn('Failed to load travel pods:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPods();
  }, [eventIdFilter, womenOnlyFilter]);

  const handleJoinPod = async (pod) => {
    setJoiningId(pod.id);
    try {
      const res = await api.post(`/travel/${pod.id}/join`, {
        passenger_name: user?.full_name || 'Rayapuram Vikram',
      });

      if (res.data?.success) {
        setJoinedSet((prev) => new Set(prev).add(pod.id));
        setPods((prev) =>
          prev.map((p) => (p.id === pod.id ? { ...p, seats_available: res.data.seats_available } : p))
        );
        setConfettiTrigger(true);
        toast.success(`Seat booked in ${pod.origin_city} → ${pod.destination_city} pod!`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to join pod');
    } finally {
      setJoiningId(null);
    }
  };

  const getTransportIcon = (mode) => {
    const lower = (mode || '').toLowerCase();
    if (lower.includes('flight') || lower.includes('plane')) return <Plane className="h-4 w-4" />;
    if (lower.includes('bus')) return <Bus className="h-4 w-4" />;
    if (lower.includes('car') || lower.includes('cab')) return <Car className="h-4 w-4" />;
    return <Train className="h-4 w-4" />;
  };

  const filteredPods = pods.filter((p) => {
    const matchesOrigin = !originSearch || p.origin_city.toLowerCase().includes(originSearch.toLowerCase());
    const matchesDest = !destinationSearch || p.destination_city.toLowerCase().includes(destinationSearch.toLowerCase());
    return matchesOrigin && matchesDest;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Confetti Trigger */}
      <Confetti trigger={confettiTrigger} onComplete={() => setConfettiTrigger(false)} />

      {/* Top Header */}
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-border/20 p-6 sm:p-7 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/30">
            <Navigation className="h-3.5 w-3.5" />
            <span>Outstation Student Mobility & Fare Split Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight font-display">
            Travel Safe & Split Outstation Costs
          </h1>
          <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
            Coordinate train sleeper berths, flight cab carpools, and verified women-only cohorts to hackathon destinations.
          </p>
        </div>

        <button
          onClick={onOpenCreateTravel}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 text-black px-5 py-3 text-xs font-bold shadow-glow hover:opacity-95 transition transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 btn-shine"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ Create Travel Pod</span>
        </button>
      </div>

      {/* Filter Bar with Women-Only Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3.5 rounded-2xl border border-border/20 bg-surface p-3.5 sm:p-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Origin Search */}
          <div className="relative w-full sm:w-52">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
            <input
              type="text"
              placeholder="Origin (e.g. Pune)..."
              value={originSearch}
              onChange={(e) => setOriginSearch(e.target.value)}
              className="w-full rounded-xl border border-border/20 pl-10 pr-3.5 py-2 text-xs text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none bg-surface-2/60 hover:bg-surface-2 transition"
            />
          </div>

          <span className="hidden sm:inline text-muted text-xs font-bold font-mono">→</span>

          {/* Destination Search */}
          <div className="relative w-full sm:w-52">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
            <input
              type="text"
              placeholder="Destination (e.g. Chennai)..."
              value={destinationSearch}
              onChange={(e) => setDestinationSearch(e.target.value)}
              className="w-full rounded-xl border border-border/20 pl-10 pr-3.5 py-2 text-xs text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none bg-surface-2/60 hover:bg-surface-2 transition"
            />
          </div>
        </div>

        {/* Women-Only Safe Pods Toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer rounded-2xl border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition w-full md:w-auto justify-center shadow-xs">
          <input
            type="checkbox"
            checked={womenOnlyFilter}
            onChange={(e) => setWomenOnlyFilter(e.target.checked)}
            className="rounded border-purple-400 text-purple-600 focus:ring-purple-500 h-4 w-4"
          />
          <Shield className="h-4 w-4 text-purple-400" />
          <span>🛡️ Women-Only Safe Pods</span>
        </label>
      </div>

      {/* Pods Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <TravelCardSkeleton />
          <TravelCardSkeleton />
          <TravelCardSkeleton />
          <TravelCardSkeleton />
        </div>
      ) : filteredPods.length === 0 ? (
        <EmptyState
          icon={Navigation}
          title="No travel pods found for this route"
          description="Heading to an upcoming hackathon? Create a new travel pod to find co-passengers."
          actionLabel="Create Travel Pod"
          onAction={onOpenCreateTravel}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPods.map((pod, idx) => {
            const isJoined = joinedSet.has(pod.id);
            const isFull = pod.seats_available <= 0;

            return (
              <Reveal key={pod.id} delay={Math.min(idx * 60, 360)}>
                <div className="flex flex-col justify-between h-full rounded-3xl border border-border/20 bg-surface p-5 sm:p-6 shadow-subtle hover:border-brand/40 hover:shadow-elevated transition-all duration-200 card-lift">
                  <div>
                    {/* Route Header & Women-Only Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-xs">
                          {getTransportIcon(pod.transport_mode)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-base font-extrabold text-fg font-display">
                            <span>{pod.origin_city}</span>
                            <ArrowRight className="h-3.5 w-3.5 text-muted" />
                            <span>{pod.destination_city}</span>
                          </div>
                          <p className="text-[11px] text-muted font-semibold mt-0.5 font-mono">
                            {pod.transport_mode} • Departs {pod.departure_date}
                          </p>
                        </div>
                      </div>

                      {pod.women_only && <Badge variant="women-only" />}
                    </div>

                    {/* Organizer Details */}
                    <div className="flex items-center gap-2 text-xs text-muted mb-3">
                      <Avatar name={pod.organizer_name} size="sm" />
                      <p className="text-xs text-muted">
                        Organized by <span className="font-bold text-fg">{pod.organizer_name}</span>
                      </p>
                    </div>

                    {/* Transit Details */}
                    <div className="rounded-2xl bg-surface-2/80 p-3.5 text-xs text-fg border border-border/15 mb-3.5">
                      <p className="font-medium leading-relaxed">{pod.transit_details}</p>
                      {pod.event_title && (
                        <p className="mt-2 text-[11px] font-bold text-brand flex items-center gap-1 font-mono">
                          <span>Destination:</span>
                          <span className="text-fg">{pod.event_title}</span>
                        </p>
                      )}
                    </div>

                    {/* Split Cost Estimate */}
                    <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/25 text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <TrendingDown className="h-4 w-4 text-emerald-400" />
                        <span>Estimated Split Cost:</span>
                      </div>
                      <span className="font-extrabold text-emerald-400 text-sm font-mono">
                        {pod.split_cost_estimate || '₹850 / person'}
                      </span>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-5 pt-4 border-t border-border/15 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-muted font-mono">
                      {isFull ? (
                        <span className="text-rose-400 font-bold">No seats left</span>
                      ) : (
                        <span className="text-emerald-400 font-bold">
                          {pod.seats_available} seats remaining
                        </span>
                      )}
                    </span>

                    <button
                      onClick={() => handleJoinPod(pod)}
                      disabled={isFull || isJoined || joiningId === pod.id}
                      className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2 text-xs font-bold transition-all shadow-xs ${
                        isJoined
                          ? 'bg-emerald-500 text-black cursor-default font-extrabold'
                          : isFull
                          ? 'bg-surface-2 text-muted cursor-not-allowed'
                          : 'bg-amber-500 text-black hover:opacity-95 font-extrabold shadow-glow btn-shine'
                      }`}
                    >
                      {isJoined ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Seat Confirmed</span>
                        </>
                      ) : joiningId === pod.id ? (
                        'Booking...'
                      ) : (
                        'Book / Join Pod'
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
