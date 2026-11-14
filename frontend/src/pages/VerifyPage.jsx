import React, { useState } from 'react';
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
  Image as ImageIcon
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function VerifyPage() {
  const { user, updateUser } = useAuth();

  const [collegeName, setCollegeName] = useState(user?.college_name || 'NIAT x Yenepoya University');
  const [studentName, setStudentName] = useState(user?.full_name || 'Rayapuram Vikram');
  const [idNumber, setIdNumber] = useState('NIAT-2026-CS042');
  const [imageBase64, setImageBase64] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Sample ID Card Generator for 1-Click Judge Demo
  const handleUseSampleCard = () => {
    // Generate a sleek synthetic college ID card on an HTML canvas
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Multimodal AI College ID Trust Verification
            </h1>
            <p className="text-xs text-slate-500">
              Cryptographic and visual verification for genuine student hackers & travel safety
            </p>
          </div>
        </div>

        {/* 2-Tier Explanation Cards */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5">
            <span className="font-bold text-emerald-900 block mb-1">
              Tier 1: Institutional Domain Check
            </span>
            <p className="text-emerald-700 leading-relaxed text-[11px]">
              Automatic validation on registration for recognized student emails ending in <code className="bg-emerald-100 px-1 rounded">.edu.in</code> or <code className="bg-emerald-100 px-1 rounded">.ac.in</code>.
            </p>
          </div>

          <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-3.5">
            <span className="font-bold text-brand-900 block mb-1">
              Tier 2: Gemini Multimodal Vision AI
            </span>
            <p className="text-brand-700 leading-relaxed text-[11px]">
              Deep neural analysis of physical college ID cards, OCR enrollment checks, and tamper-resistance scoring.
            </p>
          </div>
        </div>
      </div>

      {/* Main Verification Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-subtle">
        <form onSubmit={handleVerify} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">College / University Name *</label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Student Full Name *</label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Roll / ID Number *</label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
          </div>

          {/* ID Card Image Upload & Sample Card Button */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-700">
                Upload College ID Card Image (Physical / Digital)
              </label>

              <button
                type="button"
                onClick={handleUseSampleCard}
                className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2.5 py-1 text-xs font-bold text-brand-700 border border-brand-200 hover:bg-brand-100 transition"
              >
                <Sparkles className="h-3 w-3 text-brand-600" />
                <span>⚡ Use Sample NIAT ID Card</span>
              </button>
            </div>

            <div className="mt-1 flex justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 pt-5 pb-6 hover:border-slate-400 transition bg-slate-50/50">
              {imagePreview ? (
                <div className="text-center space-y-3">
                  <img
                    src={imagePreview}
                    alt="ID Card Preview"
                    className="max-h-48 rounded-xl shadow-md border border-slate-300 mx-auto"
                  />
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => { setImagePreview(''); setImageBase64(''); }}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      Remove Card
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-center">
                  <ImageIcon className="mx-auto h-10 w-10 text-slate-400" />
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
            <div className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={verifying}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {verifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Analyzing ID Card with Gemini Multimodal Vision...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>🔍 Verify College ID with Gemini Vision AI</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Verification Success Output Card */}
        {result && (
          <div className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50/70 p-5 shadow-xs animate-in fade-in">
            <div className="flex items-center justify-between mb-3 border-b border-emerald-200/80 pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">
                    College ID Authenticated Successfully!
                  </h3>
                  <p className="text-xs text-emerald-700">
                    Trust Badge Issued: <span className="font-bold">{result.badge}</span>
                  </p>
                </div>
              </div>

              <div className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-extrabold text-white">
                {result.trust_score}% Trust Score
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-950">
              <div className="rounded-lg bg-white/80 p-2.5 border border-emerald-200">
                <span className="text-[10px] text-slate-500 block">Verified Student</span>
                <span className="font-bold">{result.student_name}</span>
              </div>
              <div className="rounded-lg bg-white/80 p-2.5 border border-emerald-200">
                <span className="text-[10px] text-slate-500 block">Accredited College</span>
                <span className="font-bold">{result.college_name}</span>
              </div>
              <div className="rounded-lg bg-white/80 p-2.5 border border-emerald-200">
                <span className="text-[10px] text-slate-500 block">Roll / Reg Number</span>
                <span className="font-bold">{result.id_number}</span>
              </div>
            </div>

            <p className="mt-3 text-xs text-emerald-800 leading-relaxed bg-white/60 p-2.5 rounded-lg border border-emerald-200">
              <span className="font-bold">Multimodal AI Audit:</span> {result.verification_notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
