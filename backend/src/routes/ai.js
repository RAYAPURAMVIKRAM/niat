const express = require('express');
const { z } = require('zod');
const { runAgenticOrchestration, verifyStudentIdCard } = require('../services/geminiService');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation for agent orchestration
const orchestrateSchema = z.object({
  userProfile: z.object({
    full_name: z.string().optional(),
    college_name: z.string().optional(),
    skills: z.union([z.array(z.string()), z.string()]).transform((val) => {
      if (Array.isArray(val)) return val;
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }).optional(),
    city: z.string().optional(),
  }).optional().default({}),
  goal: z.string().optional().default('Find complementary team and safe travel pod for hackathon'),
  targetEventId: z.string().optional().nullable(),
});

// Validation for ID verification
const verifyIdSchema = z.object({
  collegeName: z.string().optional().default('Engineering College'),
  studentName: z.string().optional().default('Student'),
  idNumber: z.string().optional().default('ID-2026-X'),
  imageBase64: z.string().optional().nullable(),
  userEmail: z.string().optional().nullable(),
});

/**
 * POST /api/ai/agent-orchestrate
 * THE CORE AGENTIC AI FEATURE
 * Runs a 3-agent autonomous workflow:
 * 1. Agent 1 (Event & Track Strategist)
 * 2. Agent 2 (Skill-Complementarity Matcher)
 * 3. Agent 3 (Safe Transit & Logistics Planner)
 */
router.post('/agent-orchestrate', optionalAuth, async (req, res) => {
  try {
    const parseResult = orchestrateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { userProfile, goal, targetEventId } = parseResult.data;

    // Merge authenticated user data if userProfile was partially empty
    const enrichedProfile = {
      full_name: userProfile?.full_name || req.user?.full_name || 'Rayapuram Vikram',
      college_name: userProfile?.college_name || req.user?.college_name || 'NIAT x Yenepoya University',
      skills: (userProfile?.skills && userProfile.skills.length > 0)
        ? userProfile.skills
        : ['Next.js', 'FastAPI', 'Agentic AI', 'Supabase', 'Python'],
      city: userProfile?.city || 'Bengaluru',
    };

    console.log(`🤖 Triggering 3-Agent Orchestrator for ${enrichedProfile.full_name} (${enrichedProfile.city})...`);

    const result = await runAgenticOrchestration({
      userProfile: enrichedProfile,
      goal,
      targetEventId,
    });

    return res.json({
      success: true,
      service: 'HackSphere Autonomous 3-Agent AI Engine',
      ...result,
    });
  } catch (err) {
    console.error('Agent Orchestration unexpected error:', err);
    return res.status(500).json({
      error: 'Agent orchestration failed',
      message: err.message,
    });
  }
});

/**
 * POST /api/ai/verify-id
 * MULTIMODAL / TRUST AI
 * Accepts collegeName, studentName, idNumber, imageBase64
 * Verifies ID card via Gemini Vision / Trust heuristics and updates Supabase is_verified = true
 */
router.post('/verify-id', optionalAuth, async (req, res) => {
  try {
    const parseResult = verifyIdSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: parseResult.error.flatten().fieldErrors,
      });
    }

    const { collegeName, studentName, idNumber, imageBase64, userEmail } = parseResult.data;

    // Determine target user email
    const targetEmail = userEmail || req.user?.email || null;
    const targetStudentName = studentName || req.user?.full_name || 'Student Hacker';
    const targetCollege = collegeName || req.user?.college_name || 'Institute of Technology';

    console.log(`🛡️ Verifying Student ID for ${targetStudentName} (${targetCollege})...`);

    const verificationResult = await verifyStudentIdCard({
      collegeName: targetCollege,
      studentName: targetStudentName,
      idNumber,
      imageBase64,
      userEmail: targetEmail,
    });

    return res.json({
      success: true,
      message: 'Student ID successfully verified and trusted badge issued',
      ...verificationResult,
    });
  } catch (err) {
    console.error('ID verification error:', err);
    return res.status(500).json({
      error: 'ID verification failed',
      message: err.message,
    });
  }
});

module.exports = router;
