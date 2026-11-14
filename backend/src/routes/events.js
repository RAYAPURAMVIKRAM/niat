const express = require('express');
const { z } = require('zod');
const { supabase } = require('../config/supabase');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Zod validation for event creation
const createEventSchema = z.object({
  title: z.string().min(2, 'Event title is required'),
  organizer: z.string().min(2, 'Organizer name is required'),
  event_type: z.string().default('Hackathon'),
  city: z.string().min(1, 'City is required'),
  venue: z.string().min(1, 'Venue is required'),
  event_date: z.string().min(1, 'Event date is required'),
  prize_pool: z.string().default('₹1,00,000'),
  tags: z.union([z.array(z.string()), z.string()]).transform((val) => {
    if (Array.isArray(val)) return val;
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  }).default(['Hackathon', 'AI']),
  registration_open: z.boolean().default(true),
  attendees_count: z.number().int().nonnegative().default(1),
});

/**
 * GET /api/events
 * Fetch all events ordered by created_at desc
 */
router.get('/', async (req, res) => {
  try {
    const { city, tag, search } = req.query;

    let query = supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (city) {
      query = query.ilike('city', `%${city}%`);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,organizer.ilike.%${search}%,venue.ilike.%${search}%`);
    }

    const { data: events, error } = await query;

    if (error) {
      console.error('Error fetching events from Supabase:', error);
      return res.status(500).json({ error: 'Failed to fetch events', message: error.message });
    }

    return res.json({
      success: true,
      count: events?.length || 0,
      events: events || [],
    });
  } catch (err) {
    console.error('Events GET error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

/**
 * GET /api/events/:id
 * Fetch single event by ID with associated teams and travel pods
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: event, error: eventErr } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single();

    if (eventErr || !event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Fetch related teams and travel pods
    const [teamsRes, travelRes] = await Promise.all([
      supabase.from('team_posts').select('*').eq('event_id', id).order('created_at', { ascending: false }),
      supabase.from('travel_pods').select('*').eq('event_id', id).order('created_at', { ascending: false }),
    ]);

    return res.json({
      success: true,
      event,
      teams: teamsRes.data || [],
      travel_pods: travelRes.data || [],
    });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

/**
 * POST /api/events
 * Create a new hackathon/tech event
 */
router.post('/', optionalAuth, async (req, res) => {
  try {
    const parseResult = createEventSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const eventData = parseResult.data;

    const { data: newEvent, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) {
      console.error('Error creating event in Supabase:', error);
      return res.status(500).json({ error: 'Failed to create event', message: error.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event: newEvent,
    });
  } catch (err) {
    console.error('Events POST error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

module.exports = router;
