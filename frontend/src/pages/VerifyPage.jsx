import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Upload,
  Sparkles,
  FileText,
  AlertCircle,
  Loader2,
  Award,
  Zap,
  Image as ImageIcon,
  Scan,
  Check,
  Radio,
  Fingerprint
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Reveal from '../components/ui/Reveal';
import ProgressRing from '../components/ui/ProgressRing';
import Confetti from '../components/ui/Confetti';

export default function VerifyPage() {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const toast = useToast();

  const [collegeName, setCollegeName] = useState(user?.college_name || 'NIAT x Yenepoya University');
  const [studentName, setStudentName] = useState(user?.full_name || 'Rayapuram Vikram');
  const [idNumber, setIdNumber] = useState('NIAT-2026-CS042');
  const [imageBase64, setImageBase64] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const [verifying, setVerifying] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [confettiTrigger, setConfettiTrigger] = useState(false);

  const SCAN_STEPS = [
    'Scanning ID card perimeter & physical hologram...',
    'Performing neural OCR on institutional seal & name...',
    'Matching roll credentials against registrar records...',
    'Computing tamper-resistance cryptographic score...',
  ];

  useEffect(() => {
    let interval;
    if (verifying) {
      interval = setInterval(() => {
        setScanStep((prev) => (prev + 1) % SCAN_STEPS.length);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [verifying]);

  // Sample ID Card Generator for 1-Click Judge Demo
  const handleUseSampleCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    // Background gradient tuned to theme
    const grad = ctx.createLinearGradient(0, 0, 600, 360);
    grad.addColorStop(0, '#0F172A');
    grad.addColorStop(1, '#312E81');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 360);

    // Header strip
    ctx.fillStyle = '#4F46E5';
    ctx.fillRect(0, 0, 600, 60);

    // College Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('NIAT x YENEPOYA UNIVERSITY', 25, 40);

    // ID Card Subtitle
    ctx.fillStyle = '#A5B4FC';
    ctx.font = '13px sans-serif';
    ctx.fillText('OFFICIAL STUDENT IDENTITY CARD • 2026', 25, 95);

    // Photo Box
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(25, 120, 130, 160);
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 3;
    ctx.strokeRect(25, 120, 130, 160);

    ctx.fillStyle = '#818CF8';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('RV', 60, 215);

    // Student Details
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(studentName.toUpperCase(), 180, 150);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '14px sans-serif';
    ctx.fillText('Department:', 180, 185);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText('Computer Science & Autonomous AI', 280, 185);

    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Roll / Reg No:', 180, 215);
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText(idNumber, 280, 215);

    ctx.fillStyle = '#94A3B8';
    ctx.fillText('Email:', 180, 245);
    ctx.fillStyle = '#38BDF8';
    ctx.fillText(user?.college_email || 'vikram@niat.edu.in', 280, 245);

    // Watermark / Hologram
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('AUTHENTICATED CAMPUS CREDENTIAL', 180, 310);

    const dataUrl = canvas.toDataURL('image/png');
    setImageBase64(dataUrl);
    setImagePreview(dataUrl);
    toast.info('Synthetic NIAT Student ID loaded onto preview frame!');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageBase64(reader.result);
        setImagePreview(reader.result);
        toast.info('ID Card image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setError('');
    setResult(null);

    try {
      const res = await api.post('/ai/verify-id', {
        collegeName,
        studentName,
        idNumber,
        imageBase64: imageBase64 || null,
        userEmail: user?.college_email || null,
      });

      if (res.data?.success) {
        setResult(res.data);
        updateUser({
          is_verified: true,
          id_card_status: 'verified',
        });
        setConfettiTrigger(true);
        toast.success(`ID Card Verified! Trust score: ${res.data.trust_score}%`);
      } else {
        throw new Error(res.data?.error || 'Verification failed');
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || err.message || 'Verification error';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Confetti Trigger */}
      <Confetti trigger={confettiTrigger} onComplete={() => setConfettiTrigger(false)} />

      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-border/20 p-6 sm:p-7 shadow-subtle">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-fg tracking-tight font-display">
              Multimodal AI College ID Trust Verification
            </h1>
            <p className="text-xs sm:text-sm text-muted">
              Cryptographic and visual verification for genuine student hackers & travel safety
            </p>
          </div>
        </div>

        {/* 2-Tier Explanation Cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4">
            <span className="font-extrabold text-emerald-400 block mb-1 font-display">
              Tier 1: Institutional Domain Check
            </span>
            <p className="text-muted leading-relaxed text-[11px]">
              Automatic validation on registration for recognized student emails ending in{' '}
              <code className="bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold text-emerald-300">
                .edu.in
              </code>{' '}
              or{' '}
              <code className="bg-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold text-emerald-300">
                .ac.in
              </code>.
            </p>
          </div>

          <div className="rounded-2xl border border-brand/25 bg-brand/10 p-4">
            <span className="font-extrabold text-brand block mb-1 font-display">
              Tier 2: Gemini Multimodal Vision AI
            </span>
            <p className="text-muted leading-relaxed text-[11px]">
              Deep neural analysis of physical college ID cards, OCR enrollment checks, and tamper-resistance scoring.
            </p>
          </div>
        </div>
      </div>

      {/* Main Verification Form */}
      <div className="rounded-3xl border border-border/20 bg-surface p-6 sm:p-7 shadow-subtle">
        <form onSubmit={handleVerify} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-fg">College / University Name *</label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full rounded-xl border border-border/20 px-3.5 py-2.5 font-medium text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none bg-surface-2/60 hover:bg-surface-2 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-fg">Student Full Name *</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full rounded-xl border border-border/20 px-3.5 py-2.5 font-medium text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none bg-surface-2/60 hover:bg-surface-2 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-fg">Roll / ID Number *</label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full rounded-xl border border-border/20 px-3.5 py-2.5 font-medium text-fg focus:border-brand focus:ring-2 focus:ring-brand/20 focus:outline-none bg-surface-2/60 hover:bg-surface-2 transition"
              />
            </div>
          </div>

          {/* ID Card Image Upload & Sample Card Button */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-fg">
                Upload College ID Card Image (Physical / Digital)
              </label>

              <button
                type="button"
                onClick={handleUseSampleCard}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand/15 px-3.5 py-1.5 text-xs font-bold text-brand border border-brand/30 hover:bg-brand/20 transition shadow-xs btn-shine"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>⚡ Use Sample NIAT ID Card</span>
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-border/25 px-6 pt-5 pb-6 hover:border-brand/40 transition bg-surface-2/40">
              {/* Dynamic Laser Scan Line Overlay while verifying */}
              {verifying && (
                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent shadow-glow animate-scan-line" />
                </div>
              )}

              {imagePreview ? (
                <div className="text-center space-y-3 relative z-10">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="ID Card Preview"
                      className="max-h-56 rounded-2xl shadow-elevated border border-border/25 mx-auto"
                    />
                    {verifying && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                        <div className="bg-surface/90 text-fg text-[11px] font-bold px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-brand/40 shadow-elevated">
                          <Radio className="h-3 w-3 text-brand animate-pulse" />
                          <span>{SCAN_STEPS[scanStep]}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setImageBase64('');
                      }}
                      className="text-xs text-rose-400 hover:underline font-bold"
                    >
                      Remove Card
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-center py-4">
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-surface-2 flex items-center justify-center text-muted">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div className="flex text-xs text-muted justify-center">
                    <label className="relative cursor-pointer rounded-md font-bold text-brand hover:underline">
                      <span>Upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or click "Use Sample NIAT ID Card" above</p>
                  </div>
                  <p className="text-[10px] text-muted font-mono">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-500/10 p-3.5 text-xs text-rose-400 border border-rose-500/30 flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={verifying}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand text-brand-fg py-3.5 text-xs font-bold shadow-glow hover:opacity-95 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed btn-shine"
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing ID Card with Gemini Multimodal Vision...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span className="tracking-wide">Verify College ID with Gemini Vision AI</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Verification Success Output Card */}
        {result && (
          <Reveal>
            <div className="mt-7 rounded-3xl border border-emerald-500/30 bg-surface-2/90 p-6 shadow-elevated">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-border/15 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-fg font-display">
                      College ID Authenticated Successfully!
                    </h3>
                    <p className="text-xs text-emerald-400">
                      Trust Badge Issued: <span className="font-bold">{result.badge}</span>
                    </p>
                  </div>
                </div>

                <div className="self-start sm:self-auto flex items-center gap-2 bg-emerald-500 text-black px-4 py-1.5 rounded-full text-xs font-extrabold shadow-sm font-mono">
                  <Fingerprint className="h-3.5 w-3.5" />
                  <span>{result.trust_score}% Trust Score</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                <div className="rounded-2xl bg-surface p-3.5 border border-border/20 shadow-xs">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1 font-mono">
                    Verified Student
                  </span>
                  <span className="font-extrabold text-fg">{result.student_name}</span>
                </div>
                <div className="rounded-2xl bg-surface p-3.5 border border-border/20 shadow-xs">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1 font-mono">
                    Accredited College
                  </span>
                  <span className="font-extrabold text-fg">{result.college_name}</span>
                </div>
                <div className="rounded-2xl bg-surface p-3.5 border border-border/20 shadow-xs">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider block mb-1 font-mono">
                    Roll / Reg Number
                  </span>
                  <span className="font-extrabold text-fg font-mono">{result.id_number}</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-fg leading-relaxed bg-surface p-3.5 rounded-2xl border border-border/20 shadow-xs">
                <span className="font-bold text-emerald-400">Multimodal AI Audit:</span>{' '}
                {result.verification_notes}
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
