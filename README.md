# HackSphere AI 🚀
### Autonomous Agentic AI Social Ecosystem for Tech Events, Skill-Based Teammate Matching & Safe Student Transit

> **Theme:** Agentic AI & Intelligent Systems (Integrating Autonomous Multi-Agents, Multimodal Vision Trust AI, and Safe Outstation Transit Pods)  
> **Built for Hackathons & Campus Builders** | Production-Ready Full-Stack System

---

## 📌 Executive Summary & Problem Statement

College students and engineering hackers participating in national hackathons (Smart India Hackathon, ETHIndia, HackNITR, campus datathons) consistently face three major hurdles:

1. **The Teammate Complementarity Mismatch:** Students frequently scramble on Discord/WhatsApp groups to find teammates, ending up in teams with redundant skills (e.g. 4 frontend devs and 0 backend/AI devs) or conflicting visions.
2. **The Outstation Travel & Safety Barrier:** Outstation travel to hackathon host cities (Bengaluru, Chennai, New Delhi, Hyderabad) is expensive and stressful. Solo travel is costly, while finding verified female-safe travel groups, sharing railway berths, or pooling airport cabs is chaotic and uncoordinated.
3. **The Campus Identity & Trust Deficit:** Hackathons suffer from fake profiles, unverified credentials, and ghost participants who abandon teams halfway through sprints.

### 💡 The HackSphere AI Solution

HackSphere AI is an **Autonomous Agentic Platform** that automates the entire hacker lifecycle before step one of the competition:
- **Autonomous Multi-Agent Orchestration:** A 3-agent autonomous workflow running on **Google Gemini AI** and **Supabase PostgreSQL** that strategizes project blueprints, analyzes database squads for skill complementarity, and coordinates door-to-door transit plans.
- **2-Tier Student Trust Verification:** Instant institutional domain verification (`.edu.in` / `.ac.in`) coupled with **Gemini Multimodal Vision OCR** to verify physical college ID cards and issue cryptographic campus trust badges.
- **Safe Outstation Travel Pods:** Coordinated student transit cohorts with fare splitting (saving ~55% vs solo travel) and verified **Women-Only Safe Pods**.
- **Integrated Live Huddle Rooms:** Real-time room messaging with an interactive WebRTC simulated audio/video huddle bar for instant pre-hackathon brainstorming.

---

## 🧠 3-Agent Autonomous Architecture

HackSphere AI coordinates a three-tier agentic pipeline where specialized micro-agents reason over student profiles, competition criteria, and live database state:

```
                          ┌───────────────────────────┐
                          │   Student Hacker Profile  │
                          │  (Skills, Goal, City, ID) │
                          └─────────────┬─────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             Autonomous 3-Agent AI Engine (Powered by Gemini)                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────┐   ┌───────────────────────┐   ┌────────────────┐ │
│  │       AGENT 1         │   │       AGENT 2         │   │    AGENT 3     │ │
│  │   Event & Track       ├──►│  Skill-Complementary  ├──►│  Safe Transit  │ │
│  │     Strategist        │   │     Team Matcher      │   │   & Logistics  │ │
│  └───────────┬───────────┘   └───────────┬───────────┘   └────────┬───────┘ │
│              │                           │                        │         │
│  • Analyzes user skills      • Queries live Supabase     • Matches travel   │
│  • Selects winning track       bounties (team_posts)       pods for city    │
│  • Generates project USP     • Ranks synergy (75-98%)    • Splits cab/train │
│  • Generates 36h sprint      • Synthesizes role fit        fare estimates   │
│    milestone timeline          reasoning for squad       • Enforces safety  │
│                                                                             │
└───────────────────────────────────────┬─────────────────────────────────────┘
                                        │
                                        ▼
             ┌─────────────────────────────────────────────────────┐
             │       Unified JSON Mission Intelligence Plan        │
             │  { blueprint, recommendedTeams, travelPlan, steps } │
             └─────────────────────────────────────────────────────┘
```

### 1. Agent 1: Event & Track Strategist
Evaluates the hacker's technical proficiencies against the target hackathon's prize tracks. Synthesizes a high-probability project blueprint complete with architecture recommendation, winning USP hook, and 36-hour sprint milestones.

### 2. Agent 2: Skill-Complementarity Matcher
Queries active teammate bounties in Supabase and executes set-complementarity matching. Rather than simple keyword matching, it identifies squads whose missing roles match the user's strengths (e.g., matching a frontend/design specialist with a backend/AI squad) with visual percentage match scores (75%–98%) and explicit synergy rationales.

### 3. Agent 3: Safe Transit & Logistics Planner
Scans active outstation travel pods matching the origin and host cities. Builds a door-to-door itinerary with verified student co-passengers, train/flight details, and cost-sharing savings (saving ~55% vs solo travel).

### 🛡️ Multimodal Trust AI (Gemini Vision OCR)
Analyzes student college ID cards submitted via image upload. Detects institutional watermarks, extracts roll number and student name, checks against enrolled profiles, and updates verified status in PostgreSQL with the **Verified Student Hacker** badge.

---

## 💻 Complete Technology Stack

| Layer | Technologies Used | Purpose |
|---|---|---|
| **Frontend Framework** | React.js (v18), Vite | Blazing fast single-page application with hot module replacement |
| **Routing** | React Router v6 | Seamless multi-page client-side navigation (`/`, `/agent`, `/teams`, `/travel`, `/verify`, `/chat`) |
| **Styling & Design** | Tailwind CSS | Executive SaaS design inspired by Linear & Stripe (`Plus Jakarta Sans` typography) |
| **Icons & UI** | Lucide React | High-contrast, clean icons across all navigation tabs and modals |
| **HTTP Client** | Axios | Configured with automatic Bearer JWT injection interceptor |
| **Backend Runtime** | Node.js (v24), Express.js | Modular REST API built with CommonJS `require` for zero ESM issues |
| **Validation** | Zod | Runtime schema validation for all incoming requests |
| **Security & Auth** | bcryptjs, jsonwebtoken (JWT) | Password hashing (salt rounds: 10) and secure Bearer token authentication |
| **Database** | Supabase (PostgreSQL) | Managed cloud relational database with Service Role access bypassing RLS |
| **Generative AI** | Google Gemini (`@google/generative-ai`) | Multimodal LLM reasoning for 3-agent orchestration & ID card verification |
| **Fallback Engine** | Deterministic Algorithmic Synthesis | Zero-crash fallback guaranteeing 100% demo uptime if Gemini API throttles |

---

## 🗄️ Database Architecture (Supabase Public Schema)

- **`profiles`**: `id`, `full_name`, `college_name`, `college_email`, `is_verified`, `id_card_status`, `skills (text[])`, `github_url`, `bio`, `city`, `gender`, `password_hash`, `created_at`
- **`events`**: `id`, `title`, `organizer`, `event_type`, `city`, `venue`, `event_date`, `prize_pool`, `tags (text[])`, `registration_open`, `attendees_count`, `created_at`
- **`team_posts`**: `id`, `event_id`, `author_name`, `author_college`, `is_verified`, `team_name`, `looking_for_roles (text[])`, `current_stack (text[])`, `pitch`, `spots_left`, `created_at`
- **`travel_pods`**: `id`, `event_id`, `organizer_name`, `origin_city`, `destination_city`, `departure_date`, `transport_mode`, `transit_details`, `seats_available`, `women_only`, `split_cost_estimate`, `created_at`
- **`messages`**: `id`, `room_id`, `sender_name`, `sender_college`, `content`, `created_at`

---

## 🚀 Step-by-Step Local Setup & Execution

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/RAYAPURAMVIKRAM/niat.git
cd niat
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env` (refer to `backend/.env.example`):
```env
PORT=5000
SUPABASE_URL=https://rnbtiljblgxbrbqjants.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=hacksphere_super_secret_jwt_key_2026
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:
```bash
npm start
# Server runs on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

Run the automated backend test suite (16/16 tests passing):
```bash
node test-suite.js
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
```

Create `frontend/.env` (refer to `frontend/.env.example`):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
# Application opens at http://localhost:5173
```

To test production build:
```bash
npm run build
```

---

## ⚡ 1-Click Instant Demo Login for Judges

When opening the frontend at **`http://localhost:5173`**:
1. Click the green **"⚡ Instant Demo Login (Vikram @ NIAT)"** button in the top navigation bar.
2. The platform instantly authenticates as **Rayapuram Vikram (Lead Architect @ NIAT x Yenepoya University)**.
3. The green **Verified Student (.edu.in)** badge unlocks immediately in the header.
4. All 3 agents in `/agent` will have live context pre-populated.

---

## 📡 API Reference

### System & Health
- `GET /api/health` — Verifies backend status (`{ status: "ok", service: "HackSphere Agentic AI Backend" }`)

### Authentication & Profiles
- `POST /api/auth/register` — Validates with Zod, hashes password, auto-verifies `.edu.in`/`.ac.in` domains
- `POST /api/auth/login` — Verifies credentials and returns JWT (includes instant demo bypass for `vikram@niat.edu.in`)
- `GET /api/auth/me` — Retrieves current authenticated profile

### Events & Hackathons
- `GET /api/events` — Fetches events ordered by `created_at` desc (supports `city` and `search` query parameters)
- `POST /api/events` — Validates and creates a new hackathon event
- `GET /api/events/:id` — Fetches event details with linked teams and travel pods

### Teammate Bounties
- `GET /api/teams` — Fetches all teammate bounties enriched with linked hackathon details
- `POST /api/teams` — Publishes a new teammate bounty
- `POST /api/teams/:id/join` — Decrements `spots_left` and adds hacker to team

### Outstation Travel Pods
- `GET /api/travel` — Fetches travel pods (supports `origin`, `destination`, `women_only=true` filters)
- `POST /api/travel` — Creates an outstation travel pod with fare-split estimate
- `POST /api/travel/:id/join` — Decrements `seats_available` and confirms transit booking

### Real-Time Chat & Huddle
- `GET /api/messages/:roomId` — Retrieves message history for room (e.g., `global-lobby`, `team-astrix`)
- `POST /api/messages` — Publishes real-time message to Supabase

### Agentic AI & Trust
- `POST /api/ai/agent-orchestrate` — **Core 3-Agent Autonomous Orchestration Engine**
- `POST /api/ai/verify-id` — **Multimodal Gemini Vision Student ID Verification**

---

## 👥 HackSphere AI Engineering Team

- **Rayapuram Vikram** — Lead Architect & Full Stack AI Engineer (NIAT x Yenepoya University)
- Project Repository: [https://github.com/RAYAPURAMVIKRAM/niat](https://github.com/RAYAPURAMVIKRAM/niat)
- License: MIT
