import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  PhoneOff,
  Radio,
  Volume2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from './ui/Avatar';

export default function HuddleBar({ channelName, onLeave }) {
  const { user } = useAuth();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [speakingUser, setSpeakingUser] = useState(0);

  // Simulated active speaker animation
  useEffect(() => {
    const timer = setInterval(() => {
      setSpeakingUser((prev) => (prev + 1) % 3);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const participants = [
    {
      name: user?.full_name || 'Rayapuram Vikram',
      role: 'You (Host)',
      college: user?.college_name || 'NIAT University',
      isSpeaking: micOn && speakingUser === 0,
      isVerified: user?.is_verified || true,
    },
    {
      name: 'Aditi Rao',
      role: 'Frontend Dev',
      college: 'IIT Bombay',
      isSpeaking: speakingUser === 1,
      isVerified: true,
    },
    {
      name: 'Pooja Sundaram',
      role: 'Smart Contract Dev',
      college: 'BITS Pilani',
      isSpeaking: speakingUser === 2,
      isVerified: true,
    },
  ];

  return (
    <div className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-3.5 shadow-elevated animate-fade-in-up">
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Channel & Status with Animated Equalizer */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-white tracking-wide font-display">
                Live Voice & Video Huddle
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/40">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                LIVE
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span>Channel: <strong className="font-mono text-slate-200">{channelName}</strong></span>
              {/* Equalizer animation */}
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 bg-emerald-400 rounded-full animate-wave-bar-1" />
                <span className="w-0.5 bg-emerald-400 rounded-full animate-wave-bar-2" />
                <span className="w-0.5 bg-emerald-400 rounded-full animate-wave-bar-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Center: Live Speaker Avatars */}
        <div className="flex items-center gap-2.5 overflow-x-auto py-1">
          {participants.map((p) => (
            <div
              key={p.name}
              className={`flex items-center gap-2 rounded-full pl-1 pr-3 py-1 text-xs transition-all duration-200 border ${
                p.isSpeaking
                  ? 'border-emerald-500 bg-emerald-950/60 text-emerald-200 shadow-glow-emerald ring-2 ring-emerald-500/50 scale-102'
                  : 'border-slate-800 bg-slate-900/80 text-slate-300'
              }`}
            >
              <Avatar name={p.name} isVerified={p.isVerified} size="xs" />
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold leading-tight max-w-[95px] truncate font-display">{p.name}</span>
                <span className="text-[9px] text-slate-400 leading-none">{p.role}</span>
              </div>
              {p.isSpeaking && (
                <Volume2 className="h-3 w-3 text-emerald-400 animate-pulse ml-0.5" />
              )}
            </div>
          ))}
        </div>

        {/* Right: Media Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`rounded-xl p-2.5 text-xs font-semibold transition-all ${
              micOn
                ? 'bg-slate-800 text-white hover:bg-slate-700'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/50 hover:bg-rose-500/30'
            }`}
            title={micOn ? 'Mute Mic' : 'Unmute Mic'}
          >
            {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setVideoOn(!videoOn)}
            className={`rounded-xl p-2.5 text-xs font-semibold transition-all ${
              videoOn
                ? 'bg-brand-600 text-white hover:bg-brand-500 shadow-glow'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
            title={videoOn ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {videoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setSharing(!sharing)}
            className={`rounded-xl p-2.5 text-xs font-semibold transition-all ${
              sharing
                ? 'bg-indigo-600 text-white shadow-glow'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
            title="Share Screen"
          >
            <Share2 className="h-4 w-4" />
          </button>

          <button
            onClick={onLeave}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-700 transition shadow-subtle btn-shine"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span>Leave</span>
          </button>
        </div>
      </div>
    </div>
  );
}
