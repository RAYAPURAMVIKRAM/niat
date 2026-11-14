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
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import HuddleBar from '../components/HuddleBar';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';

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
    <div className="rounded-3xl border border-border/20 bg-surface shadow-elevated overflow-hidden flex flex-col h-[calc(100vh-8.5rem)]">
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
        <div className="w-60 sm:w-68 border-r border-border/15 bg-surface-2/60 p-3.5 flex flex-col shrink-0">
          <div className="flex items-center justify-between px-2.5 pb-3 mb-2 border-b border-border/15">
            <span className="text-[11px] font-extrabold text-fg uppercase tracking-wider font-mono">
              Huddle Channels
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live</span>
            </span>
          </div>

          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
            {CHANNELS.map((ch) => {
              const isActive = activeRoom === ch.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => setActiveRoom(ch.id)}
                  className={`w-full flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand text-brand-fg shadow-glow font-bold'
                      : 'text-muted hover:bg-surface-2 hover:text-fg'
                  }`}
                >
                  <Hash className={`h-4 w-4 shrink-0 ${isActive ? 'text-brand-fg' : 'text-muted'}`} />
                  <span className="truncate">{ch.name}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Voice Huddle Toggle CTA */}
          <div className="mt-auto pt-3 border-t border-border/15">
            <button
              onClick={() => setHuddleActive(!huddleActive)}
              className={`w-full flex items-center justify-center gap-2 rounded-2xl py-2.5 px-3 text-xs font-bold transition-all shadow-xs ${
                huddleActive
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-brand text-brand-fg hover:opacity-95 shadow-glow btn-shine'
              }`}
            >
              <Radio className="h-4 w-4 shrink-0 animate-pulse" />
              <span>{huddleActive ? 'End Huddle Call' : 'Start Voice Huddle'}</span>
            </button>
          </div>
        </div>

        {/* Right Message Feed & Input */}
        <div className="flex-1 flex flex-col bg-surface overflow-hidden">
          {/* Channel Header */}
          <div className="h-16 border-b border-border/15 px-5 flex items-center justify-between shrink-0 bg-surface">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-surface-2 flex items-center justify-center text-muted">
                <Hash className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-fg leading-tight font-display">
                  {currentChannel.name}
                </h3>
                <p className="text-[11px] text-muted truncate max-w-sm sm:max-w-md">
                  {currentChannel.description}
                </p>
              </div>
            </div>

            {/* Top Right Huddle Action */}
            {!huddleActive && (
              <button
                onClick={() => setHuddleActive(true)}
                className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-border/20 bg-surface-2 px-3.5 py-1.5 text-xs font-bold text-fg hover:border-brand/40 transition shadow-xs"
              >
                <Radio className="h-3.5 w-3.5 text-emerald-400" />
                <span>Join Voice / Video Huddle</span>
              </button>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {loading && messages.length === 0 ? (
              <div className="space-y-4 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="h-9 w-9 rounded-full bg-surface-2 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-32 rounded bg-surface-2" />
                      <div className="h-10 w-3/4 rounded bg-surface-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted">
                <div className="h-12 w-12 rounded-2xl bg-surface-2 flex items-center justify-center text-muted mb-2.5">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <p className="text-xs font-bold text-fg font-display">No messages in this huddle room yet</p>
                <p className="text-[11px] text-muted mt-0.5">Start the conversation with your fellow student hackers!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe =
                  msg.sender_name === user?.full_name ||
                  msg.sender_name?.toLowerCase().includes('vikram');

                return (
                  <div key={msg.id} className="flex items-start gap-3 group">
                    <Avatar name={msg.sender_name} size="md" verified={isMe} />

                    <div className="flex-1 max-w-xl">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-extrabold text-fg font-display">{msg.sender_name}</span>
                        <span className="text-[10px] font-semibold text-muted font-mono">{msg.sender_college}</span>
                        <span className="text-[10px] text-muted font-mono">
                          {msg.created_at
                            ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Just now'}
                        </span>
                      </div>
                      <div
                        className={`inline-block rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-xs ${
                          isMe
                            ? 'bg-brand text-brand-fg rounded-tl-sm shadow-glow font-medium'
                            : 'bg-surface-2 text-fg rounded-tl-sm border border-border/20'
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
            className="p-3.5 border-t border-border/15 bg-surface flex items-center gap-2.5 shrink-0"
          >
            <input
              type="text"
              placeholder={`Message #${currentChannel.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 rounded-2xl border border-border/20 px-4 py-2.5 text-xs text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none bg-surface-2/60 hover:bg-surface-2 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-brand-fg hover:opacity-95 transition disabled:opacity-40 shrink-0 shadow-glow btn-shine"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
