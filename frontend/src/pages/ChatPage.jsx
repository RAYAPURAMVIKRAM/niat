import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Radio,
  Users,
  Hash,
  Sparkles,
  ShieldCheck,
  Phone,
  Video,
  Smile,
  Paperclip
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import HuddleBar from '../components/HuddleBar';

const CHANNELS = [
  { id: 'global-lobby', name: 'global-lobby', description: 'General hackathon & teammate discussion' },
  { id: 'niat-hacksprint', name: 'niat-hacksprint', description: 'NIAT National GenAI HackSprint 2026' },
  { id: 'iitm-chennai-travel', name: 'iitm-chennai-travel', description: 'Bengaluru to Chennai Shatabdi Travel Pod' },
  { id: 'team-astrix', name: 'team-astrix', description: 'Rayapuram Vikram’s autonomous AI build squad' },
];

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const initialRoom = searchParams.get('room') || 'global-lobby';

  const [activeRoom, setActiveRoom] = useState(initialRoom);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [huddleActive, setHuddleActive] = useState(false);

  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const fetchMessages = async (roomId) => {
    try {
      const res = await api.get(`/messages/${roomId}`);
      setMessages(res.data?.messages || []);
    } catch (err) {
      console.warn('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchMessages(activeRoom);
    const interval = setInterval(() => {
      fetchMessages(activeRoom);
    }, 4000); // Polling for real-time feel
    return () => clearInterval(interval);
  }, [activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText('');

    // Optimistic local add
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      room_id: activeRoom,
      sender_name: user?.full_name || 'Rayapuram Vikram',
      sender_college: user?.college_name || 'NIAT University',
      content: textToSend,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      await api.post('/messages', {
        room_id: activeRoom,
        sender_name: user?.full_name || 'Rayapuram Vikram',
        sender_college: user?.college_name || 'NIAT University',
        content: textToSend,
      });
      fetchMessages(activeRoom);
    } catch (err) {
      console.error('Failed to post message:', err);
    }
  };

  const currentChannel = CHANNELS.find((c) => c.id === activeRoom) || CHANNELS[0];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-subtle overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
      {/* Top Huddle Bar (if active) */}
      {huddleActive && (
        <HuddleBar
          channelName={`#${currentChannel.name}`}
          onLeave={() => setHuddleActive(false)}
        />
      )}

      {/* Main Chat Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Channel Sidebar */}
        <div className="w-56 sm:w-64 border-r border-slate-200 bg-slate-50/60 p-3 flex flex-col shrink-0">
          <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-200/80">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Huddle Channels
            </span>
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
              Live
            </span>
          </div>

          <div className="space-y-1 overflow-y-auto flex-1">
            {CHANNELS.map((ch) => {
              const isActive = activeRoom === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveRoom(ch.id)}
                  className={`w-full flex items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs font-semibold transition ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  <Hash className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{ch.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Voice Huddle Toggle CTA */}
          <div className="mt-auto pt-3 border-t border-slate-200">
            <button
              onClick={() => setHuddleActive(!huddleActive)}
              className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-bold transition shadow-xs ${
                huddleActive
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  : 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white hover:from-brand-500 hover:to-indigo-500'
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              <span>{huddleActive ? 'End Huddle Call' : '🎙️ Start Voice Huddle'}</span>
            </button>
          </div>
        </div>

        {/* Right Message Feed & Input */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Channel Header */}
          <div className="h-14 border-b border-slate-200 px-4 flex items-center justify-between shrink-0 bg-white">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-slate-400" />
              <div>
                <h3 className="text-xs font-bold text-slate-900 leading-tight">
                  {currentChannel.name}
                </h3>
                <p className="text-[10px] text-slate-500 truncate max-w-sm sm:max-w-md">
                  {currentChannel.description}
                </p>
              </div>
            </div>

            {/* Top Right Huddle Action */}
            {!huddleActive && (
              <button
                onClick={() => setHuddleActive(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition"
              >
                <Radio className="h-3.5 w-3.5 text-emerald-600" />
                <span>Join Voice/Video Huddle</span>
              </button>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {loading && messages.length === 0 ? (
              <div className="space-y-3 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-2.5 animate-pulse">
                    <div className="h-8 w-8 rounded-full bg-slate-200 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 w-28 rounded bg-slate-200" />
                      <div className="h-8 w-3/4 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <MessageSquare className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">No messages in this huddle room yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Start the conversation with your fellow student hackers!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe =
                  msg.sender_name === user?.full_name ||
                  msg.sender_name?.toLowerCase().includes('vikram');

                return (
                  <div key={msg.id} className="flex items-start gap-2.5 group">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white uppercase shrink-0 shadow-xs ${
                        isMe
                          ? 'bg-gradient-to-tr from-brand-600 to-indigo-600'
                          : 'bg-slate-700'
                      }`}
                    >
                      {msg.sender_name?.charAt(0) || 'U'}
                    </div>

                    <div className="flex-1 max-w-xl">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-slate-900">{msg.sender_name}</span>
                        <span className="text-[10px] text-slate-400">{msg.sender_college}</span>
                        <span className="text-[9px] text-slate-300">
                          {msg.created_at
                            ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Just now'}
                        </span>
                      </div>
                      <div
                        className={`inline-block rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                          isMe
                            ? 'bg-slate-900 text-white rounded-tl-xs'
                            : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/60'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder={`Message #${currentChannel.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-brand-600 focus:outline-none bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-40 shrink-0 shadow-xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
