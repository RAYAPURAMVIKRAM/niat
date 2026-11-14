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
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import Reveal from '../components/ui/Reveal';
import ProgressRing from '../components/ui/ProgressRing';

export default function VerifyPage() {
  const { user, updateUser } = useAuth();

  const [collegeName, setCollegeName] = useState(user?.college_name || 'NIAT x Yenepoya University');
  const [studentName, setStudentName] = useState(user?.full_name || 'Rayapuram Vikram');
  const [idNumber, setIdNumber] = useState('NIAT-2026-CS042');
  const [imageBase64, setImageBase64] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const [verifying, setVerifying] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

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

    // Background gradient
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
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageBase64(reader.result);
        setImagePreview(reader.result);
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
      } else {
        throw new Error(res.data?.error || 'Verification failed');
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Verification error');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-subtle">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 shadow-xs">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Multimodal AI College ID Trust Verification
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Cryptographic and visual verification for genuine student hackers & travel safety
            </p>
          </div>
        </div>

        {/* 2-Tier Explanation Cards */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-4">
            <span className="font-extrabold text-emerald-950 block mb-1">
              Tier 1: Institutional Domain Check
            </span>
            <p className="text-emerald-800 leading-relaxed text-[11px]">
              Automatic validation on registration for recognized student emails ending in{' '}
              <code className="bg-emerald-100/90 px-1.5 py-0.5 rounded font-mono font-bold text-emerald-900">.edu.in</code> or{' '}
              <code className="bg-emerald-100/90 px-1.5 py-0.5 rounded font-mono font-bold text-emerald-900">.ac.in</code>.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-200/80 bg-brand-50/70 p-4">
            <span className="font-extrabold text-brand-950 block mb-1">
              Tier 2: Gemini Multimodal Vision AI
            </span>
            <p className="text-brand-800 leading-relaxed text-[11px]">
              Deep neural analysis of physical college ID cards, OCR enrollment checks, and tamper-resistance scoring.
            </p>
          </div>
        </div>
      </div>

      {/* Main Verification Form */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-subtle">
        <form onSubmit={handleVerify} className="space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">College / University Name *</label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full rounded-xl border border-slate-300/90 px-3.5 py-2.5 font-medium text-slate-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-slate-50/60 hover:bg-white transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Student Full Name *</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full rounded-xl border border-slate-300/90 px-3.5 py-2.5 font-medium text-slate-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-slate-50/60 hover:bg-white transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-700">Roll / ID Number *</label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-300/90 px-3.5 py-2.5 font-medium text-slate-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none bg-slate-50/60 hover:bg-white transition"
              />
            </div>
          </div>

          {/* ID Card Image Upload & Sample Card Button */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-slate-700">
                Upload College ID Card Image (Physical / Digital)
              </label>

              <button
                type="button"
                onClick={handleUseSampleCard}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700 border border-brand-200 hover:bg-brand-100 transition shadow-xs btn-shine"
              >
                <Sparkles className="h-3.5 w-3.5 text-brand-600" />
                <span>⚡ Use Sample NIAT ID Card</span>
              </button>
            </div>

            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 px-6 pt-5 pb-6 hover:border-slate-400 transition bg-slate-50/50">
              {/* Laser Scan Line Overlay while verifying */}
              {verifying && (
                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_15px_#10B981] animate-scan-line" />
                </div>
              )}

              {imagePreview ? (
                <div className="text-center space-y-3 relative z-10">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="ID Card Preview"
                      className="max-h-56 rounded-2xl shadow-elevated border border-slate-300 mx-auto"
                    />
                    {verifying && (
                      <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                        <div className="bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-2 border border-emerald-500/40 shadow-elevated">
                          <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
                          <span>{SCAN_STEPS[scanStep]}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setImagePreview(''); setImageBase64(''); }}
                      className="text-xs text-rose-600 hover:underline font-bold"
                    >
                      Remove Card
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-center py-4">
                  <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div className="flex text-xs text-slate-600 justify-center">
                    <label className="relative cursor-pointer rounded-md font-bold text-brand-600 hover:underline">
                      <span>Upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1 text-slate-500">or click "Use Sample NIAT ID Card" above</p>
                  </div>
                  <p className="text-[10px] text-slate-400">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 p-3.5 text-xs text-rose-700 border border-rose-200 flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={verifying}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 py-3.5 text-xs font-bold text-white shadow-elevated hover:shadow-emerald-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed btn-shine"
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Analyzing ID Card with Gemini Multimodal Vision...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  <span className="tracking-wide">Verify College ID with Gemini Vision AI</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Verification Success Output Card */}
        {result && (
          <Reveal>
            <div className="mt-7 rounded-3xl border border-emerald-300/80 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 p-6 shadow-elevated">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-emerald-200/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-emerald-950">
                      College ID Authenticated Successfully!
                    </h3>
                    <p className="text-xs text-emerald-700">
                      Trust Badge Issued: <span className="font-bold">{result.badge}</span>
                    </p>
                  </div>
                </div>

                <div className="self-start sm:self-auto flex items-center gap-2 bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-extrabold shadow-sm">
                  <Fingerprint className="h-3.5 w-3.5" />
                  <span>{result.trust_score}% Trust Score</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs text-emerald-950">
                <div className="rounded-2xl bg-white/90 p-3.5 border border-emerald-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Verified Student
                  </span>
                  <span className="font-extrabold text-slate-900">{result.student_name}</span>
                </div>
                <div className="rounded-2xl bg-white/90 p-3.5 border border-emerald-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Accredited College
                  </span>
                  <span className="font-extrabold text-slate-900">{result.college_name}</span>
                </div>
                <div className="rounded-2xl bg-white/90 p-3.5 border border-emerald-200 shadow-xs">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Roll / Reg Number
                  </span>
                  <span className="font-extrabold text-slate-900">{result.id_number}</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-emerald-900 leading-relaxed bg-white/90 p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
                <span className="font-bold text-emerald-950">Multimodal AI Audit:</span> {result.verification_notes}
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
