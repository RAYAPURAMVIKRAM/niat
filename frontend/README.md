# HackSphere AI Frontend 🚀

**Production-Ready, Executive-Grade React + Vite Frontend** for **HackSphere AI**: An Agentic AI Social Platform for Tech Events, Hackathons, Skill-Based Teammate Matching, College ID Trust Verification, and Student Outstation Travel Pods.

---

## 🛠️ Stack & Architecture

- **Core:** React 18 + Vite + `react-router-dom` v6
- **Styling & UI:** Tailwind CSS with custom slate/navy executive color palette (`Plus Jakarta Sans` typography)
- **Icons:** `lucide-react`
- **HTTP Client:** `axios` with automatic Bearer JWT injection interceptor
- **State Management:** Context API (`AuthContext`) with persistent `localStorage` synchronization

---

## 🌟 Interactive Pages & Capabilities

### 1. Unified Events & Hackathons Feed (`/`)
- Live search bar and city filters (`All`, `Bengaluru`, `Chennai`, `Warangal`, `Hyderabad`, `New Delhi`, `Mumbai`).
- Category pills (`All`, `Hackathon`, `National Hackathon`, `Tech Fest`, `Datathon`, `Sprint`).
- Event cards with prize pool badges in ₹, venue, date, tags, and 3 direct actions:
  - **Run Agentic AI Planner** $\rightarrow$ Pre-loads this event into the 3-Agent AI Command Center.
  - **Find Teammates** $\rightarrow$ Filters matching squads for this event.
  - **Outstation Travel Pods** $\rightarrow$ Filters travel pods to this hackathon city.
- **+ Host / Post Event Modal** (`POST /api/events`) allowing judges to post a live event on the fly!

### 2. Autonomous 3-Agent AI Command Center (`/agent`) — *The Showstopper*
- Hacker profile confirmation (skills & custom goal).
- Target hackathon selection dropdown.
- **🚀 Launch Autonomous 3-Agent Workflow** button calling `POST /api/ai/agent-orchestrate` with step-by-step pipeline animations:
  - **Agent 1: Event & Track Strategist** $\rightarrow$ Winning Project Title, Recommended Track, USP Hook, Architecture Stack, and 36-Hour Sprint Milestones.
  - **Agent 2: Skill-Complementarity Matcher** $\rightarrow$ Ranked live Supabase squads with visual match percentage badges (e.g. `96% Match`), AI synergy reasoning, and 1-click **"Request / Join Team"**.
  - **Agent 3: Safe Transit & Logistics Planner** $\rightarrow$ Matched outstation travel pods, departure schedule, cost savings vs solo transit, campus safety protocols, and 1-click **"Join Travel Pod"**.

### 3. Smart Teammate Matching Board (`/teams`)
- Filter by roles needed (`Frontend`, `Backend`, `AI/ML`, `UI/UX`, `Pitch`, `Smart Contract`).
- **+ Post Teammate Bounty (LFT)** modal (`POST /api/teams`).
- Squad cards showing lead hacker, verified campus badge, pitch, open roles, and live **"Request / Join Team"** button decrementing `spots_left` in real-time.

### 4. Outstation Travel & Mobility Hub (`/travel`)
- Origin and Destination city search filters.
- **🛡️ Women-Only Safe Travel Pods** toggle switch.
- **+ Create Travel Pod** modal (`POST /api/travel`) with departure time, train/bus/flight details, and seat count.
- 1-click **"Book / Join Pod"** button decrementing `seats_available` in real-time.

### 5. Multimodal AI College ID Trust Verification (`/verify`)
- 2-tier security breakdown: Tier 1 (`.edu.in`/`.ac.in` domain check) & Tier 2 (Gemini Multimodal Vision OCR).
- **⚡ Use Sample NIAT ID Card** button generating a synthetic high-resolution college ID card canvas on the fly!
- Calls `POST /api/ai/verify-id`, displays trust score and visual tamper audit notes, and issues the **Verified Student Hacker** badge.

### 6. Real-Time Collaboration & WebRTC Huddle Rooms (`/chat`)
- Channels: `#global-lobby`, `#niat-hacksprint`, `#iitm-chennai-travel`, `#team-astrix`.
- Real-time polling chat stream connected to Supabase `messages` table.
- **🎙️ Start Instant Voice/Video Huddle** toggle bar with simulated WebRTC voice waves, active speaker avatars, mic mute/unmute, camera toggle, and screen share.

---

## ⚡ 1-Click Instant Demo Login for Hackathon Judges

In the top navigation bar or the auth modal, click:
**"⚡ Instant Demo Login (Vikram @ NIAT)"**
This automatically authenticates as **Rayapuram Vikram (Lead Architect @ NIAT x Yenepoya University)**, unlocks the green **Verified Student (.edu.in)** trust badge, and populates all AI recommendations.

---

## 🚀 Running the Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

Server starts on: `http://localhost:5173`
Connected to backend on: `http://localhost:5000/api`
