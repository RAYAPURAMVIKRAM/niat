const express = require('express');
const { z } = require('zod');
const { supabase } = require('../config/supabase');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Zod validation for posting a message
const postMessageSchema = z.object({
  room_id: z.string().min(1, 'room_id is required'),
  sender_name: z.string().min(1, 'sender_name is required'),
  sender_college: z.string().default('Student Hacker'),
  content: z.string().min(1, 'content cannot be empty'),
});

/**
 * GET /api/messages/:roomId
 * Fetch messages for a specific chat room ordered by created_at asc
 */
router.get('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const limit = parseInt(req.query.limit, 10) || 50;

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching messages from Supabase:', error);
      return res.status(500).json({ error: 'Failed to fetch messages', message: error.message });
    }

    return res.json({
      success: true,
      room_id: roomId,
      count: messages?.length || 0,
      messages: messages || [],
    });
  } catch (err) {
    console.error('Messages GET error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

/**
 * POST /api/messages
 * Post a new collaboration chat message
 */
router.post('/', optionalAuth, async (req, res) => {
  try {
    const parseResult = postMessageSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const payload = parseResult.data;

    // Enrich with logged in user details if available
    if (req.user) {
      if (req.user.full_name && !req.body.sender_name) payload.sender_name = req.user.full_name;
      if (req.user.college_name && !req.body.sender_college) payload.sender_college = req.user.college_name;
    }

    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error('Error posting message to Supabase:', error);
      return res.status(500).json({ error: 'Failed to post message', message: error.message });
    }

    return res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (err) {
    console.error('Messages POST error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

module.exports = router;
