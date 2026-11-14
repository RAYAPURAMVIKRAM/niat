import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Footer from './components/Footer';
import BackToTop from './components/ui/BackToTop';
import RouteProgressBar from './components/RouteProgressBar';
import CommandPalette from './components/CommandPalette';
import OnboardingModal from './components/OnboardingModal';

// Modals
import HostEventModal from './components/HostEventModal';
import PostTeamModal from './components/PostTeamModal';
import CreateTravelModal from './components/CreateTravelModal';
import AuthModal from './components/AuthModal';

// Pages
import EventsPage from './pages/EventsPage';
import AgentPage from './pages/AgentPage';
import TeamsPage from './pages/TeamsPage';
import TravelPage from './pages/TravelPage';
import VerifyPage from './pages/VerifyPage';
import ChatPage from './pages/ChatPage';

import api from './api/client';

function MainLayout() {
  const [hostEventModalOpen, setHostEventModalOpen] = useState(false);
  const [postTeamModalOpen, setPostTeamModalOpen] = useState(false);
  const [createTravelModalOpen, setCreateTravelModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [eventsList, setEventsList] = useState([]);

  // Load events for dropdowns in modals
  const loadEvents = async () => {
    try {
      const res = await api.get('/events');
      setEventsList(res.data?.events || []);
    } catch (e) {
      console.warn('Could not load events list in layout:', e);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-bg text-fg flex flex-col font-sans transition-colors duration-300">
      {/* Top Route Progress Bar */}
      <RouteProgressBar />

      {/* Top Navbar */}
      <Navbar
        onOpenAuth={openAuth}
        onOpenHostEvent={() => setHostEventModalOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Main Workspace with Sidebar & Dynamic Views */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <Sidebar
          onOpenHostEvent={() => setHostEventModalOpen(true)}
          onOpenPostTeam={() => setPostTeamModalOpen(true)}
          onOpenCreateTravel={() => setCreateTravelModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10 overflow-y-auto min-w-0">
          <Routes>
            <Route
              path="/"
              element={
                <EventsPage onOpenHostEvent={() => setHostEventModalOpen(true)} />
              }
            />
            <Route path="/agent" element={<AgentPage />} />
            <Route
              path="/teams"
              element={
                <TeamsPage onOpenPostTeam={() => setPostTeamModalOpen(true)} />
              }
            />
            <Route
              path="/travel"
              element={
                <TravelPage onOpenCreateTravel={() => setCreateTravelModalOpen(true)} />
              }
            />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Modern Footer */}
      <Footer />

      {/* Back to Top Floating Action */}
      <BackToTop />

      {/* Mobile Bottom Navigation Dock */}
      <MobileNav />

      {/* Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenHostEvent={() => setHostEventModalOpen(true)}
        onOpenPostTeam={() => setPostTeamModalOpen(true)}
        onOpenCreateTravel={() => setCreateTravelModalOpen(true)}
      />

      {/* 3-Step First-Time Onboarding Tour */}
      <OnboardingModal />

      {/* Modals */}
      <HostEventModal
        isOpen={hostEventModalOpen}
        onClose={() => setHostEventModalOpen(false)}
        onEventCreated={() => {
          loadEvents();
          window.location.reload();
        }}
      />

      <PostTeamModal
        isOpen={postTeamModalOpen}
        onClose={() => setPostTeamModalOpen(false)}
        events={eventsList}
        onTeamCreated={() => {
          if (window.location.pathname === '/teams') {
            window.location.reload();
          }
        }}
      />

      <CreateTravelModal
        isOpen={createTravelModalOpen}
        onClose={() => setCreateTravelModalOpen(false)}
        events={eventsList}
        onPodCreated={() => {
          if (window.location.pathname === '/travel') {
            window.location.reload();
          }
        }}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <MainLayout />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
