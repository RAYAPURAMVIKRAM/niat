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
  TrendingDown
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

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

  const navigate = useNavigate();
  const { user } = useAuth();

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
      }
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to join pod');
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
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200 mb-1.5">
            <Navigation className="h-3.5 w-3.5" />
            <span>Outstation Student Mobility & Fare Split Hub</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Travel Safe & Split Outstation Costs
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Coordinate train sleeper berths, flight cab carpools, and verified women-only cohorts to hackathon destinations.
          </p>
        </div>

        <button
          onClick={onOpenCreateTravel}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition shrink-0"
        >
          <PlusCircle className="h-4 w-4" />
          <span>+ Create Travel Pod</span>
        </button>
      </div>

      {/* Filter Bar with Women-Only Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-subtle">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Origin Search */}
          <div className="relative w-full sm:w-48">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Origin (e.g. Pune)..."
              value={originSearch}
              onChange={(e) => setOriginSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-brand-600 focus:outline-none"
            />
          </div>

          <span className="hidden sm:inline text-slate-400 text-xs">→</span>

          {/* Destination Search */}
          <div className="relative w-full sm:w-48">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Destination (e.g. Chennai)..."
              value={destinationSearch}
              onChange={(e) => setDestinationSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:border-brand-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Women-Only Safe Pods Toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer rounded-xl border border-purple-200 bg-purple-50/60 px-3.5 py-2 text-xs font-bold text-purple-900 hover:bg-purple-100/60 transition w-full md:w-auto justify-center">
          <input
            type="checkbox"
            checked={womenOnlyFilter}
            onChange={(e) => setWomenOnlyFilter(e.target.checked)}
            className="rounded border-purple-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
          />
          <Shield className="h-4 w-4 text-purple-600" />
          <span>🛡️ Women-Only Safe Travel Pods</span>
        </label>
      </div>

      {/* Pods Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-56 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse" />
          ))}
        </div>
      ) : filteredPods.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Navigation className="mx-auto h-12 w-12 text-slate-400 mb-2" />
          <h3 className="text-sm font-bold text-slate-900">No travel pods found for this route</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Heading to an upcoming hackathon? Create a new travel pod to find co-passengers.
          </p>
          <button
            onClick={onOpenCreateTravel}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-700 transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Create Travel Pod</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPods.map((pod) => {
            const isJoined = joinedSet.has(pod.id);
            const isFull = pod.seats_available <= 0;

            return (
              <div
                key={pod.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-subtle hover:border-slate-300 hover:shadow-elevated transition-all"
              >
                <div>
                  {/* Route Header & Women-Only Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                        {getTransportIcon(pod.transport_mode)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900">
                          <span>{pod.origin_city}</span>
                          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                          <span>{pod.destination_city}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {pod.transport_mode} • Departs {pod.departure_date}
                        </p>
                      </div>
                    </div>

                    {pod.women_only && (
                      <span className="flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200">
                        <Shield className="h-3 w-3 text-purple-600" />
                        <span>Women-Only</span>
                      </span>
                    )}
                  </div>

                  {/* Organizer Details */}
                  <p className="text-xs text-slate-500 mb-2">
                    Organized by <span className="font-semibold text-slate-800">{pod.organizer_name}</span>
                  </p>

                  {/* Transit Details */}
                  <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 border border-slate-200/80 mb-3">
                    <p className="font-medium">{pod.transit_details}</p>
                    {pod.event_title && (
                      <p className="mt-1 text-[11px] font-semibold text-brand-600">
                        Destination Hackathon: {pod.event_title}
                      </p>
                    )}
                  </div>

                  {/* Split Cost Estimate */}
                  <div className="flex items-center justify-between rounded-lg bg-emerald-50/60 p-2.5 border border-emerald-200/80 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-900">
                      <TrendingDown className="h-4 w-4 text-emerald-600" />
                      <span className="font-semibold">Estimated Split Cost:</span>
                    </div>
                    <span className="font-extrabold text-emerald-800 text-sm">
                      {pod.split_cost_estimate || '₹850 / person'}
                    </span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">
                    {isFull ? (
                      <span className="text-rose-600">No seats left</span>
                    ) : (
                      <span className="text-emerald-700 font-bold">{pod.seats_available} seats remaining</span>
                    )}
                  </span>

                  <button
                    onClick={() => handleJoinPod(pod)}
                    disabled={isFull || isJoined || joiningId === pod.id}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-bold transition shadow-xs ${
                      isJoined
                        ? 'bg-emerald-600 text-white cursor-default'
                        : isFull
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-amber-600 text-white hover:bg-amber-700'
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
            );
          })}
        </div>
      )}
    </div>
  );
}
