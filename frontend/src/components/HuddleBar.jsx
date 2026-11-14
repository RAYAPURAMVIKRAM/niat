import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  PhoneOff,
  Radio,
  Users,
  Volume2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
      avatar: user?.full_name?.charAt(0) || 'V',
      color: 'from-brand-600 to-indigo-600',
    },
    {
      name: 'Aditi Rao',
      role: 'Frontend Dev',
      college: 'IIT Bombay',
      isSpeaking: speakingUser === 1,
      avatar: 'A',
      color: 'from-purple-600 to-pink-600',
    },
    {
      name: 'Pooja Sundaram',
      role: 'Smart Contract Dev',
      college: 'BITS Pilani',
      isSpeaking: speakingUser === 2,
      avatar: 'P',
      color: 'from-emerald-600 to-teal-600',
    },
  ];

  return (
    <div className="border-b border-slate-200 bg-slate-900 text-white p-3 shadow-md animate-in slide-in-from-top-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Channel & Status */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                Live Voice & Video Huddle
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                WebRTC Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Channel: <span className="font-mono text-slate-300">{channelName}</span>
            </p>
          </div>
        </div>

        {/* Center: Live Speaker Avatars */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {participants.map((p, idx) => (
            <div
              key={p.name}
              className={`flex items-center gap-2 rounded-full px-2.5 py-1 text-xs transition border ${
                p.isSpeaking
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200 shadow-sm shadow-emerald-500/20 ring-2 ring-emerald-500/40'
                  : 'border-slate-800 bg-slate-800/80 text-slate-300'
              }`}
            >
              <div
                className={`relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr ${p.color} text-[10px] font-bold text-white`}
              >
                {p.avatar}
                {p.isSpeaking && (
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-medium leading-tight max-w-[90px] truncate">{p.name}</span>
                <span className="text-[9px] text-slate-400 leading-none">{p.role}</span>
              </div>
              {p.isSpeaking && (
                <Volume2 className="h-3 w-3 text-emerald-400 animate-pulse ml-0.5" />
              )}
            </div>
          ))}
        </div>

        {/* Right: Media Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setMicOn(!micOn)}
            className={`rounded-lg p-2 text-xs font-semibold transition ${
              micOn
                ? 'bg-slate-800 text-white hover:bg-slate-700'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
            }`}
            title={micOn ? 'Mute Mic' : 'Unmute Mic'}
          >
            {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setVideoOn(!videoOn)}
            className={`rounded-lg p-2 text-xs font-semibold transition ${
              videoOn
                ? 'bg-brand-600 text-white hover:bg-brand-700'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
            title={videoOn ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {videoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setSharing(!sharing)}
            className={`rounded-lg p-2 text-xs font-semibold transition ${
              sharing
                ? 'bg-brand-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
            title="Share Screen"
          >
            <Share2 className="h-4 w-4" />
          </button>

          <button
            onClick={onLeave}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition shadow-xs"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span>Leave</span>
          </button>
        </div>
      </div>
    </div>
  );
}
