const http = require('http');

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      url,
      {
        method,
        headers,
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting HackSphere AI Backend Automated Verification Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    const health = await request('GET', '/api/health');
    assert(
      health.status === 200 && health.data.status === 'ok' && health.data.service.includes('HackSphere'),
      'GET /api/health returns ok status'
    );

    // 2. Demo Login for Vikram
    const demoLogin = await request('POST', '/api/auth/login', {
      college_email: 'vikram@niat.edu.in',
      password: 'password123',
    });
    assert(
      demoLogin.status === 200 && demoLogin.data.token && demoLogin.data.user.college_email === 'vikram@niat.edu.in',
      'POST /api/auth/login allows demo login for vikram@niat.edu.in'
    );
    const demoToken = demoLogin.data?.token;

    // 3. User Registration
    const testEmail = `testhacker_${Date.now()}@iitb.ac.in`;
    const regRes = await request('POST', '/api/auth/register', {
      full_name: 'Aditi Rao',
      college_name: 'IIT Bombay',
      college_email: testEmail,
      password: 'securepassword123',
      skills: ['React', 'Python', 'Machine Learning', 'FastAPI'],
      city: 'Mumbai',
      gender: 'Female',
    });
    assert(
      regRes.status === 201 && regRes.data.token && regRes.data.user.is_verified === true,
      'POST /api/auth/register auto-verifies .ac.in email and returns JWT'
    );
    const testToken = regRes.data?.token;

    // 4. Standard Login
    const loginRes = await request('POST', '/api/auth/login', {
      college_email: testEmail,
      password: 'securepassword123',
    });
    assert(
      loginRes.status === 200 && loginRes.data.token && loginRes.data.user.full_name === 'Aditi Rao',
      'POST /api/auth/login authenticates registered user'
    );

    // 5. GET Events
    const eventsRes = await request('GET', '/api/events');
    assert(
      eventsRes.status === 200 && Array.isArray(eventsRes.data.events) && eventsRes.data.events.length > 0,
      `GET /api/events returns list of events (${eventsRes.data.events?.length} found)`
    );
    const firstEventId = eventsRes.data.events?.[0]?.id;

    // 6. POST Event
    const newEventRes = await request('POST', '/api/events', {
      title: 'HackSphere Global Sprint 2026',
      organizer: 'HackSphere Autonomous DAO',
      event_type: 'Agentic Hackathon',
      city: 'Hyderabad',
      venue: 'T-Hub 2.0 Convention Hall',
      event_date: '2026-12-28',
      prize_pool: '₹5,00,000',
      tags: ['Autonomous Agents', 'Gemini API', 'Next.js'],
      registration_open: true,
      attendees_count: 500,
    });
    assert(
      newEventRes.status === 201 && newEventRes.data.event.title === 'HackSphere Global Sprint 2026',
      'POST /api/events creates a new event'
    );

    // 7. GET Teams
    const teamsRes = await request('GET', '/api/teams');
    assert(
      teamsRes.status === 200 && Array.isArray(teamsRes.data.teams),
      `GET /api/teams returns team bounties (${teamsRes.data.teams?.length} found)`
    );

    // 8. POST Team Bounty
    const newTeamRes = await request('POST', '/api/teams', {
      event_id: firstEventId,
      author_name: 'Aditi Rao',
      author_college: 'IIT Bombay',
      is_verified: true,
      team_name: 'AgenticForce',
      looking_for_roles: ['UI/UX Designer', 'Prompt Engineer'],
      current_stack: ['Python', 'FastAPI', 'Gemini Flash'],
      pitch: 'Building an autonomous travel pod matching bot for inter-college hackathons.',
      spots_left: 2,
    }, testToken);
    assert(
      newTeamRes.status === 201 && newTeamRes.data.team.team_name === 'AgenticForce',
      'POST /api/teams publishes a teammate bounty'
    );
    const createdTeamId = newTeamRes.data.team.id;

    // 9. POST Team Join
    const joinTeamRes = await request('POST', `/api/teams/${createdTeamId}/join`, {
      applicant_name: 'Rayapuram Vikram',
      role: 'UI/UX Designer',
    }, demoToken);
    assert(
      joinTeamRes.status === 200 && joinTeamRes.data.spots_left === 1,
      'POST /api/teams/:id/join successfully decrements spots_left'
    );

    // 10. GET Travel Pods
    const travelRes = await request('GET', '/api/travel');
    assert(
      travelRes.status === 200 && Array.isArray(travelRes.data.travel_pods),
      `GET /api/travel returns travel pods (${travelRes.data.travel_pods?.length} found)`
    );

    // 11. POST Travel Pod
    const newPodRes = await request('POST', '/api/travel', {
      event_id: firstEventId,
      organizer_name: 'Aditi Rao',
      origin_city: 'Mumbai',
      destination_city: 'Hyderabad',
      departure_date: '2026-12-27 @ 08:00 AM',
      transport_mode: 'Vande Bharat Express',
      transit_details: 'Coach C2, confirmed seats, safe group travel from CSMT.',
      seats_available: 3,
      women_only: true,
      split_cost_estimate: '₹1,150 / person',
    }, testToken);
    assert(
      newPodRes.status === 201 && newPodRes.data.travel_pod.origin_city === 'Mumbai',
      'POST /api/travel creates an outstation travel pod'
    );
    const createdPodId = newPodRes.data.travel_pod.id;

    // 12. POST Travel Join
    const joinPodRes = await request('POST', `/api/travel/${createdPodId}/join`, {
      passenger_name: 'Sneha Patel',
    });
    assert(
      joinPodRes.status === 200 && joinPodRes.data.seats_available === 2,
      'POST /api/travel/:id/join decrements seats_available'
    );

    // 13. Messages: POST and GET
    const postMsgRes = await request('POST', '/api/messages', {
      room_id: 'hackathon-lounge',
      sender_name: 'Aditi Rao',
      sender_college: 'IIT Bombay',
      content: 'Hey everyone, our AgenticForce team is looking for 1 designer!',
    });
    assert(
      postMsgRes.status === 201 && postMsgRes.data.message.content.includes('AgenticForce'),
      'POST /api/messages posts a chat message to room'
    );

    const getMsgRes = await request('GET', '/api/messages/hackathon-lounge');
    assert(
      getMsgRes.status === 200 && Array.isArray(getMsgRes.data.messages) && getMsgRes.data.messages.length > 0,
      'GET /api/messages/:roomId retrieves chat history'
    );

    // 14. Core AI: POST /api/ai/agent-orchestrate
    console.log('\n🤖 Testing Core 3-Agent Orchestration (/api/ai/agent-orchestrate)...');
    const aiOrchestrateRes = await request('POST', '/api/ai/agent-orchestrate', {
      userProfile: {
        full_name: 'Aditi Rao',
        college_name: 'IIT Bombay',
        skills: ['React', 'Python', 'FastAPI', 'Gemini AI', 'TailwindCSS'],
        city: 'Mumbai',
      },
      goal: 'Find a winning hackathon track, complementary team, and travel pod',
      targetEventId: firstEventId,
    });
    assert(
      aiOrchestrateRes.status === 200 &&
      Array.isArray(aiOrchestrateRes.data.agentSteps) &&
      aiOrchestrateRes.data.agentSteps.length === 3 &&
      Array.isArray(aiOrchestrateRes.data.recommendedTeams) &&
      aiOrchestrateRes.data.travelPlan &&
      aiOrchestrateRes.data.hackathonBlueprint,
      'POST /api/ai/agent-orchestrate returns full 3-agent orchestration response'
    );
    console.log(`   Agent 1: ${aiOrchestrateRes.data.agentSteps[0]?.summary}`);
    console.log(`   Agent 2: ${aiOrchestrateRes.data.agentSteps[1]?.summary}`);
    console.log(`   Agent 3: ${aiOrchestrateRes.data.agentSteps[2]?.summary}`);
    console.log(`   Blueprint: ${aiOrchestrateRes.data.hackathonBlueprint?.project_title}`);

    // 15. Multimodal Trust AI: POST /api/ai/verify-id
    console.log('\n🛡️ Testing Multimodal ID Verification (/api/ai/verify-id)...');
    const verifyIdRes = await request('POST', '/api/ai/verify-id', {
      collegeName: 'IIT Bombay',
      studentName: 'Aditi Rao',
      idNumber: '210050042',
      userEmail: testEmail,
    });
    assert(
      verifyIdRes.status === 200 &&
      verifyIdRes.data.is_verified === true &&
      verifyIdRes.data.id_card_status === 'verified',
      'POST /api/ai/verify-id issues verified status and trust badge'
    );

    console.log(`\n====================================================`);
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`====================================================\n`);

    if (failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Fatal test execution error:', err);
    process.exit(1);
  }
}

// Start server and run tests in sequence
const app = require('./server');
setTimeout(() => {
  runTests();
}, 1500);
