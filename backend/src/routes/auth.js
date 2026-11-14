const express = require('express');
const { z } = require('zod');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Zod validation schema for registration
const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  college_name: z.string().min(2, 'College name must be at least 2 characters'),
  college_email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  skills: z.union([z.array(z.string()), z.string()]).transform((val) => {
    if (Array.isArray(val)) return val;
    return val.split(',').map((s) => s.trim()).filter(Boolean);
  }),
  city: z.string().min(1, 'City is required'),
  gender: z.string().optional().default('Unspecified'),
  github_url: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
});

// Zod validation schema for login
const loginSchema = z.object({
  college_email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Check if email belongs to an accredited college/university domain (.edu.in, .ac.in, .edu)
 */
const isCollegeEmail = (email) => {
  if (!email) return false;
  const lower = email.toLowerCase();
  return lower.endsWith('.edu.in') || lower.endsWith('.ac.in') || lower.endsWith('.edu') || lower.endsWith('.ernet.in');
};

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { full_name, college_name, college_email, password, skills, city, gender, github_url, bio } = parseResult.data;

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id, college_email')
      .eq('college_email', college_email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'A student profile with this college email already exists. Please login instead.',
      });
    }

    // Auto-verify if email ends with accredited education domain
    const autoVerified = isCollegeEmail(college_email);
    const idCardStatus = autoVerified ? 'verified' : 'pending';

    // Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert into Supabase profiles
    const newProfile = {
      full_name,
      college_name,
      college_email: college_email.toLowerCase(),
      is_verified: autoVerified,
      id_card_status: idCardStatus,
      skills,
      city,
      gender,
      github_url: github_url || null,
      bio: bio || `Passionate student hacker from ${college_name} interested in ${skills.slice(0, 3).join(', ')}.`,
      password_hash: passwordHash,
    };

    const { data: insertedUser, error: insertError } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting profile into Supabase:', insertError);
      return res.status(500).json({
        error: 'Database error',
        message: insertError.message,
      });
    }

    // Clean user object (remove password hash)
    const { password_hash, ...safeUser } = insertedUser;

    // Sign JWT
    const token = jwt.sign(
      {
        id: safeUser.id,
        email: safeUser.college_email,
        full_name: safeUser.full_name,
        college_name: safeUser.college_name,
        is_verified: safeUser.is_verified,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      error: 'Internal server error',
      message: err.message,
    });
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { college_email, password } = parseResult.data;
    const emailLower = college_email.toLowerCase();

    // SPECIAL QUICK DEMO LOGIN SHORTCUT for 'vikram@niat.edu.in'
    if (emailLower === 'vikram@niat.edu.in') {
      const { data: demoUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('college_email', emailLower)
        .single();

      let targetUser = demoUser;

      // If Vikram's profile doesn't exist yet, auto-create it for a friction-free hackathon demo
      if (!targetUser) {
        const salt = await bcrypt.genSalt(10);
        const demoHash = await bcrypt.hash('password123', salt);
        const { data: createdDemo, error: demoErr } = await supabase
          .from('profiles')
          .insert([
            {
              full_name: 'Rayapuram Vikram',
              college_name: 'NIAT x Yenepoya University',
              college_email: 'vikram@niat.edu.in',
              is_verified: true,
              id_card_status: 'verified',
              skills: ['Full Stack Development', 'Agentic AI', 'Next.js', 'FastAPI', 'Supabase'],
              github_url: 'https://github.com/vikram-niat',
              bio: 'Lead Architect @ HackSphere AI. Building autonomous multi-agent systems for student builders.',
              city: 'Bengaluru',
              gender: 'Male',
              password_hash: demoHash,
            },
          ])
          .select()
          .single();

        if (!demoErr && createdDemo) {
          targetUser = createdDemo;
        }
      }

      if (targetUser) {
        const { password_hash, ...safeDemo } = targetUser;
        const token = jwt.sign(
          {
            id: safeDemo.id,
            email: safeDemo.college_email,
            full_name: safeDemo.full_name,
            college_name: safeDemo.college_name,
            is_verified: safeDemo.is_verified,
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          message: 'Demo login successful',
          token,
          user: safeDemo,
        });
      }
    }

    // Standard login flow: Look up user in Supabase
    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('college_email', emailLower)
      .single();

    if (userError || !user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'No student account found with this college email',
      });
    }

    // Verify bcrypt password hash
    const isMatch = await bcrypt.compare(password, user.password_hash || '');
    if (!isMatch) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid password',
      });
    }

    const { password_hash, ...safeUser } = user;

    // Sign JWT
    const token = jwt.sign(
      {
        id: safeUser.id,
        email: safeUser.college_email,
        full_name: safeUser.full_name,
        college_name: safeUser.college_name,
        is_verified: safeUser.is_verified,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      error: 'Internal server error',
      message: err.message,
    });
  }
});

/**
 * GET /api/auth/me (Protected)
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const { password_hash, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
