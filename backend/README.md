# HackSphere AI Backend 🚀

**Production-Ready Node.js + Express.js Agentic Backend** for **HackSphere AI**: An Agentic AI Social Platform for Tech Events, Hackathons, Skill-Based Teammate Matching, College ID Trust Verification, and Student Outstation Travel Pods.

---

## 🛠️ Tech Stack & Architecture

- **Runtime & Framework:** Node.js (v24+) + Express.js (CommonJS `require`, Zero ES Module Friction)
- **CORS:** Configured to allow all origins (`*`) with standard headers and methods
- **Validation:** `zod` schemas for runtime request sanitization and error details
- **Security & Auth:** `bcryptjs` for password hashing, `jsonwebtoken` (JWT) for authentication
- **Database:** Supabase PostgreSQL (`@supabase/supabase-js`) with Service Role Client bypassing RLS
- **Agentic AI:** Google Gemini API (`@google/generative-ai` & REST) with resilient multi-step fallback synthesis engine

---

## 📁 Folder Structure

```
backend/
├── .env                  # Live environment secrets (Supabase, JWT, Gemini)
├── package.json          # Dependencies and npm start/dev scripts
├── server.js             # Express application entrypoint and middleware
├── test-suite.js         # Automated end-to-end API test verification suite
└── src/
    ├── config/
    │   ├── supabase.js   # Supabase client connection
    │   └── gemini.js     # Google Gemini SDK configuration
    ├── middleware/
    │   └── auth.js       # JWT authentication and optional auth guards
    ├── routes/
    │   ├── auth.js       # Register, login, demo login, me
    │   ├── events.js     # Hackathon & event discovery and creation
    │   ├── teams.js      # Teammate bounties, skill search, join
    │   ├── travel.js     # Outstation student travel pods, seat join
    │   ├── messages.js   # Real-time room chat message persistence
    │   └── ai.js         # 3-Agent orchestration & multimodal ID verify
    └── services/
        ├── geminiService.js # 3-Agent workflow engine & fallback logic
        └── seedService.js   # Automatic demo data bootstrapper
```

---

## ⚙️ Environment Configuration (`.env`)

```env
PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 📡 Complete API Reference

### 1. System Health
- **`GET /api/health`**
  - **Description:** Verifies service health and uptime.
  - **Response:** `{ "status": "ok", "service": "HackSphere Agentic AI Backend" }`

---

### 2. Authentication & Student Profiles
- **`POST /api/auth/register`**
  - **Body:** `{ "full_name": "...", "college_name": "...", "college_email": "...", "password": "...", "skills": ["..."], "city": "...", "gender": "..." }`
  - **Behavior:** Auto-verifies student if email ends with `.edu.in`, `.ac.in`, or `.edu`. Hashes password with bcryptjs.
  - **Response:** `{ "token": "...", "user": { ... } }`

- **`POST /api/auth/login`**
  - **Body:** `{ "college_email": "...", "password": "..." }`
  - **Quick Demo Shortcut:** Logging in with `vikram@niat.edu.in` automatically provisions or authenticates the primary demo hacker without any friction!
  - **Response:** `{ "token": "...", "user": { ... } }`

- **`GET /api/auth/me`**
  - **Headers:** `Authorization: Bearer <token>`
  - **Response:** Current logged-in student profile.

---

### 3. Events & Hackathons
- **`GET /api/events`**
  - **Query Params:** `?city=...`, `?search=...`
  - **Response:** List of events ordered by `created_at` desc.

- **`POST /api/events`**
  - **Body:** `{ "title": "...", "organizer": "...", "event_type": "...", "city": "...", "venue": "...", "event_date": "...", "prize_pool": "...", "tags": [...] }`
  - **Response:** Created event object.

- **`GET /api/events/:id`**
  - **Response:** Event details with linked teams and travel pods.

---

### 4. Teammate Matching & Bounties
- **`GET /api/teams`**
  - **Query Params:** `?event_id=...`, `?role=...`
  - **Response:** List of teams looking for hackers, enriched with linked event titles.

- **`POST /api/teams`**
  - **Body:** `{ "event_id": "...", "author_name": "...", "author_college": "...", "team_name": "...", "looking_for_roles": [...], "current_stack": [...], "pitch": "...", "spots_left": 2 }`
  - **Response:** Published team bounty.

- **`POST /api/teams/:id/join`**
  - **Body:** `{ "applicant_name": "...", "role": "..." }`
  - **Behavior:** Decrements `spots_left` by 1.

---

### 5. Safe Outstation Travel Pods
- **`GET /api/travel`**
  - **Query Params:** `?origin=...`, `?destination=...`, `?women_only=true`
  - **Response:** List of available travel pods.

- **`POST /api/travel`**
  - **Body:** `{ "event_id": "...", "organizer_name": "...", "origin_city": "...", "destination_city": "...", "departure_date": "...", "transport_mode": "Train", "transit_details": "...", "seats_available": 3, "women_only": false, "split_cost_estimate": "₹850 / person" }`
  - **Response:** Published travel pod.

- **`POST /api/travel/:id/join`**
  - **Body:** `{ "passenger_name": "..." }`
  - **Behavior:** Decrements `seats_available` by 1.

---

### 6. Real-Time Chat & Collaboration
- **`GET /api/messages/:roomId`**
  - **Response:** History of messages in a given room (e.g. `global-lobby`, `event-blore-2026`).

- **`POST /api/messages`**
  - **Body:** `{ "room_id": "...", "sender_name": "...", "sender_college": "...", "content": "..." }`
  - **Response:** Persisted chat message.

---

### 7. Core Agentic AI Orchestrator
- **`POST /api/ai/agent-orchestrate`**
  - **Payload:**
    ```json
    {
      "userProfile": {
        "full_name": "Rayapuram Vikram",
        "college_name": "NIAT x Yenepoya University",
        "skills": ["Next.js", "FastAPI", "Agentic AI", "Supabase"],
        "city": "Bengaluru"
      },
      "goal": "Build an autonomous AI agent to win SIH 2026",
      "targetEventId": "optional-uuid"
    }
    ```
  - **3-Agent Autonomous Workflow:**
    1. **Agent 1 (Event & Track Strategist):** Evaluates user skills against hackathon requirements and selects the winning track & project concept.
    2. **Agent 2 (Skill-Complementarity Matcher):** Scans live `team_posts` in Supabase and ranks squads by compatibility score (75-98%) and specific skill synergy reasoning.
    3. **Agent 3 (Safe Transit & Logistics Planner):** Identifies relevant `travel_pods` from the user's city to the venue, calculating cost savings vs solo transit.
  - **Resilient Fallback Guarantee:** If the Gemini API key or network encounters latency or rate-limiting, the built-in deterministic synthesis engine instantly computes real skill overlaps and matches actual Supabase rows so the demo NEVER crashes!

---

### 8. Multimodal Trust AI (Student ID Verification)
- **`POST /api/ai/verify-id`**
  - **Payload:**
    ```json
    {
      "collegeName": "NIAT University",
      "studentName": "Rayapuram Vikram",
      "idNumber": "NIAT-2026-CS042",
      "imageBase64": "data:image/jpeg;base64,...",
      "userEmail": "vikram@niat.edu.in"
    }
    ```
  - **Behavior:** Analyzes ID card credentials using Gemini Vision / OCR heuristics, updates Supabase `profiles` with `is_verified = true` and `id_card_status = 'verified'`, and issues a trusted hacker badge.

---

## 🚀 How to Run

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the production server:**
   ```bash
   node server.js
   ```

3. **Run the Automated Test Suite (16/16 Verification Tests):**
   ```bash
   node test-suite.js
   ```
