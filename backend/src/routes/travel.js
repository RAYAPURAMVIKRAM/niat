const express = require('express');
const { z } = require('zod');
const { supabase } = require('../config/supabase');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Zod validation for travel pod creation
const createTravelPodSchema = z.object({
  event_id: z.string().optional().nullable(),
  organizer_name: z.string().min(2, 'Organizer name is required'),
  origin_city: z.string().min(2, 'Origin city is required'),
  destination_city: z.string().min(2, 'Destination city is required'),
  departure_date: z.string().min(2, 'Departure date/time is required'),
  transport_mode: z.string().default('Train'),
  transit_details: z.string().min(5, 'Transit details required'),
  seats_available: z.number().int().min(1).default(1),
  women_only: z.boolean().default(false),
  split_cost_estimate: z.string().default('₹1,000 / person'),
});

/**
 * GET /api/travel
 * Fetch all travel pods with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const { event_id, origin, destination, women_only } = req.query;

    let query = supabase
      .from('travel_pods')
      .select('*')
      .order('created_at', { ascending: false });

    if (event_id) {
      query = query.eq('event_id', event_id);
    }

    if (origin) {
      query = query.ilike('origin_city', `%${origin}%`);
    }

    if (destination) {
      query = query.ilike('destination_city', `%${destination}%`);
    }

    if (women_only === 'true') {
      query = query.eq('women_only', true);
    }

    const { data: pods, error } = await query;

    if (error) {
      console.error('Error fetching travel pods:', error);
      return res.status(500).json({ error: 'Failed to fetch travel pods', message: error.message });
    }

    // Enrich with event titles
    let enrichedPods = pods || [];
    if (enrichedPods.length > 0) {
      const eventIds = [...new Set(enrichedPods.map((p) => p.event_id).filter(Boolean))];
      if (eventIds.length > 0) {
        const { data: eventRows } = await supabase
          .from('events')
          .select('id, title, city')
          .in('id', eventIds);

        const eventMap = new Map();
        (eventRows || []).forEach((ev) => eventMap.set(ev.id, ev));

        enrichedPods = enrichedPods.map((pod) => ({
          ...pod,
          event_title: eventMap.get(pod.event_id)?.title || null,
        }));
      }
    }

    return res.json({
      success: true,
      count: enrichedPods.length,
      travel_pods: enrichedPods,
    });
  } catch (err) {
    console.error('Travel GET error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

/**
 * GET /api/travel/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: pod, error } = await supabase
      .from('travel_pods')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !pod) {
      return res.status(404).json({ error: 'Travel pod not found' });
    }

    return res.json({ success: true, travel_pod: pod });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

/**
 * POST /api/travel
 * Create a new travel pod for outstation hackathon travel
 */
router.post('/', optionalAuth, async (req, res) => {
  try {
    const parseResult = createTravelPodSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const payload = parseResult.data;

    // Use logged in user's name if available
    if (req.user && req.user.full_name && !payload.organizer_name) {
      payload.organizer_name = req.user.full_name;
    }

    const { data: newPod, error } = await supabase
      .from('travel_pods')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error creating travel pod in Supabase:', error);
      return res.status(500).json({ error: 'Failed to create travel pod', message: error.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Travel pod created successfully! Co-travelers can now join and split costs.',
      travel_pod: newPod,
    });
  } catch (err) {
    console.error('Travel POST error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

/**
 * POST /api/travel/:id/join
 * Decrement seats_available when a student joins a travel pod
 */
router.post('/:id/join', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const passengerName = req.body.passenger_name || req.user?.full_name || 'Student Traveler';

    const { data: pod, error: fetchErr } = await supabase
      .from('travel_pods')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !pod) {
      return res.status(404).json({ error: 'Travel pod not found' });
    }

    if (pod.seats_available <= 0) {
      return res.status(400).json({
        error: 'Pod is full',
        message: 'No seats left in this travel pod.'
      });
    }

    const newSeats = pod.seats_available - 1;

    const { data: updatedPod, error: updateErr } = await supabase
      .from('travel_pods')
      .update({ seats_available: newSeats })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return res.status(500).json({ error: 'Failed to join travel pod', message: updateErr.message });
    }

    return res.json({
      success: true,
      message: `Safe travel confirmed! ${passengerName} has joined ${pod.organizer_name}'s travel pod to ${pod.destination_city}.`,
      seats_available: newSeats,
      travel_pod: updatedPod,
    });
  } catch (err) {
    console.error('Travel join error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

module.exports = router;
