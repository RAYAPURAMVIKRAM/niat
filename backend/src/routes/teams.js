const express = require('express');
const { z } = require('zod');
const { supabase } = require('../config/supabase');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Zod validation for team bounty post
const createTeamSchema = z.object({
  event_id: z.string().optional().nullable(),
  author_name: z.string().min(2, 'Author name is required'),
  author_college: z.string().min(2, 'College name is required'),
  is_verified: z.boolean().default(false),
  team_name: z.string().min(2, 'Team name is required'),
  looking_for_roles: z.union([z.array(z.string()), z.string()]).transform((val) => {
    if (Array.isArray(val)) return val;
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  }).default(['Frontend Developer']),
  current_stack: z.union([z.array(z.string()), z.string()]).transform((val) => {
    if (Array.isArray(val)) return val;
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  }).default(['React', 'Node.js']),
  pitch: z.string().min(5, 'Pitch must be at least 5 characters'),
  spots_left: z.number().int().min(1).default(1),
});

/**
 * GET /api/teams
 * Fetch all team posts, enriched with event title if event_id is linked
 */
router.get('/', async (req, res) => {
  try {
    const { event_id, role, search } = req.query;

    let query = supabase
      .from('team_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (event_id) {
      query = query.eq('event_id', event_id);
    }

    const { data: teams, error } = await query;

    if (error) {
      console.error('Error fetching teams:', error);
      return res.status(500).json({ error: 'Failed to fetch team posts', message: error.message });
    }

    // Optionally join event title for enriched frontend display
    let enrichedTeams = teams || [];
    if (enrichedTeams.length > 0) {
      const eventIds = [...new Set(enrichedTeams.map((t) => t.event_id).filter(Boolean))];
      if (eventIds.length > 0) {
        const { data: eventRows } = await supabase
          .from('events')
          .select('id, title, city, event_date')
          .in('id', eventIds);

        const eventMap = new Map();
        (eventRows || []).forEach((ev) => eventMap.set(ev.id, ev));

        enrichedTeams = enrichedTeams.map((team) => {
          const linkedEvent = eventMap.get(team.event_id);
          return {
            ...team,
            event_title: linkedEvent?.title || null,
            event_city: linkedEvent?.city || null,
            event_date: linkedEvent?.event_date || null,
          };
        });
      }
    }

    // Optional in-memory filter if role query provided
    if (role) {
      const lowerRole = role.toLowerCase();
      enrichedTeams = enrichedTeams.filter((t) =>
        t.looking_for_roles && t.looking_for_roles.some((r) => r.toLowerCase().includes(lowerRole))
      );
    }

    return res.json({
      success: true,
      count: enrichedTeams.length,
      teams: enrichedTeams,
    });
  } catch (err) {
    console.error('Teams GET error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

/**
 * GET /api/teams/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: team, error } = await supabase
      .from('team_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !team) {
      return res.status(404).json({ error: 'Team post not found' });
    }

    return res.json({ success: true, team });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

/**
 * POST /api/teams
 * Create a new teammate bounty post
 */
router.post('/', optionalAuth, async (req, res) => {
  try {
    const parseResult = createTeamSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const payload = parseResult.data;

    // If user is authenticated, enforce their verified status and name if not provided
    if (req.user) {
      if (req.user.full_name && !payload.author_name) payload.author_name = req.user.full_name;
      if (req.user.college_name && !payload.author_college) payload.author_college = req.user.college_name;
      payload.is_verified = Boolean(req.user.is_verified);
    }

    const { data: newTeam, error } = await supabase
      .from('team_posts')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error creating team post in Supabase:', error);
      return res.status(500).json({ error: 'Failed to create team post', message: error.message });
    }

    return res.status(201).json({
      success: true,
      message: 'Teammate bounty published successfully',
      team: newTeam,
    });
  } catch (err) {
    console.error('Teams POST error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

/**
 * POST /api/teams/:id/join
 * Decrement spots_left when a teammate joins
 */
router.post('/:id/join', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const applicantName = req.body.applicant_name || req.user?.full_name || 'Student Hacker';
    const applicantCollege = req.body.applicant_college || req.user?.college_name || 'Engineering Institute';
    const applicantRole = req.body.role || 'Teammate';

    // Fetch team post
    const { data: team, error: fetchErr } = await supabase
      .from('team_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !team) {
      return res.status(404).json({ error: 'Team post not found' });
    }

    if (team.spots_left <= 0) {
      return res.status(400).json({
        error: 'Team is full',
        message: 'This team has already filled all open spots for the hackathon.'
      });
    }

    const newSpots = team.spots_left - 1;

    const { data: updatedTeam, error: updateErr } = await supabase
      .from('team_posts')
      .update({ spots_left: newSpots })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return res.status(500).json({ error: 'Failed to join team', message: updateErr.message });
    }

    return res.json({
      success: true,
      message: `Congratulations! ${applicantName} has successfully joined ${team.team_name} as ${applicantRole}!`,
      spots_left: newSpots,
      team: updatedTeam,
    });
  } catch (err) {
    console.error('Teams join error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

module.exports = router;
