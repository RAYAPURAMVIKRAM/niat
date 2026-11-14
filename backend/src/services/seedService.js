const { supabase } = require('../config/supabase');

const seedDemoDataIfEmpty = async () => {
  try {
    // Check events
    const { data: existingEvents, error: eventErr } = await supabase
      .from('events')
      .select('id')
      .limit(1);

    if (eventErr) {
      console.warn('⚠️ Supabase events check warning:', eventErr.message);
      return;
    }

    let defaultEventId = null;

    if (!existingEvents || existingEvents.length === 0) {
      console.log('🌱 Seeding demo events into Supabase...');
      const demoEvents = [
        {
          title: 'Smart India Hackathon (SIH) 2026',
          organizer: 'Ministry of Education & AICTE',
          event_type: 'National Hackathon',
          city: 'New Delhi',
          venue: 'IIT Delhi Campus & Virtual Hybrid',
          event_date: '2026-12-05',
          prize_pool: '₹10,00,000',
          tags: ['AI/ML', 'Smart Governance', 'EdTech', 'Autonomous Systems'],
          registration_open: true,
          attendees_count: 1450,
        },
        {
          title: 'ETHIndia 2026',
          organizer: 'Devfolio & ETHGlobal',
          event_type: 'Web3 & AI Hackathon',
          city: 'Bengaluru',
          venue: 'KTPO Convention Centre, Whitefield',
          event_date: '2026-12-18',
          prize_pool: '$100,000',
          tags: ['Web3', 'AI Agents', 'DeFi', 'Zero-Knowledge'],
          registration_open: true,
          attendees_count: 2100,
        },
        {
          title: 'HackNITR 6.0',
          organizer: 'NIT Rourkela Tech Club',
          event_type: 'Student Hackathon',
          city: 'Rourkela',
          venue: 'Biju Patnaik Central Auditorium',
          event_date: '2026-11-28',
          prize_pool: '₹3,50,000',
          tags: ['Open Innovation', 'Healthcare AI', 'Robotics', 'FinTech'],
          registration_open: true,
          attendees_count: 890,
        },
        {
          title: 'Mumbai TechXcelerator Hack',
          organizer: 'IIT Bombay E-Cell',
          event_type: 'Startup Sprint',
          city: 'Mumbai',
          venue: 'IIT Bombay Powai Campus',
          event_date: '2026-12-12',
          prize_pool: '₹5,00,000',
          tags: ['Agentic AI', 'FinTech', 'Sustainability', 'Cloud Native'],
          registration_open: true,
          attendees_count: 1200,
        }
      ];

      const { data: insertedEvents, error: insertEventErr } = await supabase
        .from('events')
        .insert(demoEvents)
        .select();

      if (insertEventErr) {
        console.error('Failed to seed events:', insertEventErr.message);
      } else if (insertedEvents && insertedEvents.length > 0) {
        defaultEventId = insertedEvents[0].id;
        console.log(`✅ Seeded ${insertedEvents.length} events.`);
      }
    } else {
      defaultEventId = existingEvents[0].id;
    }

    // Check team_posts
    const { data: existingTeams, error: teamErr } = await supabase
      .from('team_posts')
      .select('id')
      .limit(1);

    if (!teamErr && (!existingTeams || existingTeams.length === 0)) {
      console.log('🌱 Seeding demo team posts into Supabase...');
      const demoTeams = [
        {
          event_id: defaultEventId,
          author_name: 'Aarav Patel',
          author_college: 'IIT Delhi',
          is_verified: true,
          team_name: 'NeuralCrafters',
          looking_for_roles: ['Frontend Developer', 'UI/UX Designer'],
          current_stack: ['Python', 'FastAPI', 'Gemini AI', 'PostgreSQL'],
          pitch: 'Building an autonomous multi-agent disaster response routing system. Need a strong React/Next.js dev to bring the control center dashboard to life!',
          spots_left: 2,
        },
        {
          event_id: defaultEventId,
          author_name: 'Pooja Sundaram',
          author_college: 'BITS Pilani',
          is_verified: true,
          team_name: 'ChainMind Labs',
          looking_for_roles: ['Full Stack Engineer', 'Smart Contract Dev'],
          current_stack: ['React', 'Node.js', 'Solidity', 'TailwindCSS'],
          pitch: 'Creating decentralized skill reputation badges and trust verification for student hackers. We have deep blockchain knowledge and need full-stack teammates.',
          spots_left: 1,
        },
        {
          event_id: defaultEventId,
          author_name: 'Rohan Deshmukh',
          author_college: 'VJTI Mumbai',
          is_verified: true,
          team_name: 'HealthPulse AI',
          looking_for_roles: ['Computer Vision Specialist', 'Mobile App Dev (Flutter)'],
          current_stack: ['PyTorch', 'Node.js', 'Express', 'Supabase'],
          pitch: 'Developing real-time triage assistance for emergency clinics using multimodal edge AI. Looking for someone with mobile app or UI skills.',
          spots_left: 2,
        }
      ];

      const { data: insertedTeams, error: insertTeamsErr } = await supabase
        .from('team_posts')
        .insert(demoTeams)
        .select();

      if (!insertTeamsErr && insertedTeams) {
        console.log(`✅ Seeded ${insertedTeams.length} team posts.`);
      }
    }

    // Check travel_pods
    const { data: existingTravel, error: travelErr } = await supabase
      .from('travel_pods')
      .select('id')
      .limit(1);

    if (!travelErr && (!existingTravel || existingTravel.length === 0)) {
      console.log('🌱 Seeding demo travel pods into Supabase...');
      const demoTravelPods = [
        {
          event_id: defaultEventId,
          organizer_name: 'Vikram Singh',
          origin_city: 'Pune',
          destination_city: 'Bengaluru',
          departure_date: '2026-12-17',
          transport_mode: 'Train (Udyan Express AC 3-Tier)',
          transit_details: 'Leaving Pune Junction at 18:30. 4 berths together in B4 coach. Group booking confirmed.',
          seats_available: 3,
          women_only: false,
          split_cost_estimate: '₹1,250 per head',
        },
        {
          event_id: defaultEventId,
          organizer_name: 'Ananya Iyer',
          origin_city: 'Mumbai',
          destination_city: 'Bengaluru',
          departure_date: '2026-12-17',
          transport_mode: 'Flight + Airport Cab Share',
          transit_details: 'IndiGo 6E-5324 morning flight landing at BLR 09:30 AM. Taking Uber XL shared cab directly to KTPO Whitefield venue.',
          seats_available: 2,
          women_only: true,
          split_cost_estimate: '₹3,400 per head (Flight + Cab)',
        },
        {
          event_id: defaultEventId,
          organizer_name: 'Karan Mehra',
          origin_city: 'Jaipur',
          destination_city: 'New Delhi',
          departure_date: '2026-12-04',
          transport_mode: 'Vande Bharat Express',
          transit_details: 'Train 20977 Jaipur to Delhi Cantt. Fast 3.5 hour transit, morning tea included, safe shared cab to IIT Delhi.',
          seats_available: 4,
          women_only: false,
          split_cost_estimate: '₹880 per head',
        }
      ];

      const { data: insertedPods, error: insertPodsErr } = await supabase
        .from('travel_pods')
        .insert(demoTravelPods)
        .select();

      if (!insertPodsErr && insertedPods) {
        console.log(`✅ Seeded ${insertedPods.length} travel pods.`);
      }
    }
  } catch (err) {
    console.warn('Seed operation notice:', err.message);
  }
};

module.exports = {
  seedDemoDataIfEmpty,
};
