import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Navigation, Palette, Check, ArrowRight, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const { theme, setTheme, themes } = useTheme();

  useEffect(() => {
    try {
      const seen = localStorage.getItem('hacksphere_onboarding_completed');
      if (!seen) {
        setOpen(true);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleFinish = () => {
    try {
      localStorage.setItem('hacksphere_onboarding_completed', 'true');
    } catch (e) {}
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-border/25 bg-surface/95 text-fg p-6 sm:p-8 shadow-elevated-hover flex flex-col justify-between">
        {/* Top close */}
        <button
          onClick={handleFinish}
          className="absolute top-5 right-5 text-muted hover:text-fg p-1 rounded-xl transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step 1: Discover */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="h-12 w-12 rounded-2xl bg-brand/15 text-brand flex items-center justify-center border border-brand/30 shadow-xs">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-brand uppercase tracking-wider">
                Step 1 of 3 • Discover
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
                Welcome to HackSphere AI
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                The next-generation autonomous social ecosystem for college hackathons, verified tech events, and campus talent discovery.
              </p>
            </div>
            <div className="rounded-2xl border border-border/15 bg-surface-2/60 p-4 text-xs text-muted space-y-2">
              <p className="font-bold text-fg">✨ What you can do here:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Explore national hackathons with live prize pools</li>
                <li>Deploy autonomous 3-agent AI strategy pipelines</li>
                <li>Find verified complementary hackers for your squad</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 2: Team Up & Transit */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="h-12 w-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center border border-accent/30 shadow-xs">
              <Navigation className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-brand uppercase tracking-wider">
                Step 2 of 3 • Safety & Travel
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
                Safe Mobility & Verified IDs
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                Outstation hackathons made safe and affordable through student travel pods, sleeper splits, and Gemini Vision ID verification.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl border border-border/15 bg-surface-2/60">
                <span className="font-bold text-fg block mb-1">🛡️ Women-Only Pods</span>
                <p className="text-[11px] text-muted">Dedicated safe travel cohorts for outstation transit.</p>
              </div>
              <div className="p-3.5 rounded-2xl border border-border/15 bg-surface-2/60">
                <span className="font-bold text-fg block mb-1">🔍 Vision AI Audit</span>
                <p className="text-[11px] text-muted">Multimodal neural validation for genuine student trust.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pick Your Vibe (Theme) */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="h-12 w-12 rounded-2xl bg-brand/15 text-brand flex items-center justify-center border border-brand/30 shadow-xs">
              <Palette className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-brand uppercase tracking-wider">
                Step 3 of 3 • Personalize
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
                Pick Your Visual Vibe
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-2 leading-relaxed">
                Select your preferred theme and typography palette. You can change this anytime from the top bar!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {themes.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`flex flex-col items-center p-3 rounded-2xl border transition-all text-center ${
                      isSelected
                        ? 'border-brand bg-brand/15 shadow-glow ring-2 ring-brand/40'
                        : 'border-border/15 bg-surface-2/60 hover:border-border/30'
                    }`}
                  >
                    <span
                      className="w-7 h-7 rounded-full border border-black/20 shadow-sm flex items-center justify-center mb-2"
                      style={{ backgroundColor: t.primary }}
                    >
                      {isSelected && (
                        <Check className={`h-4 w-4 ${t.id === 'classic' ? 'text-white' : 'text-black'}`} />
                      )}
                    </span>
                    <span className="text-xs font-bold text-fg">{t.name}</span>
                    <span className="text-[10px] text-muted truncate max-w-full mt-0.5">{t.tagline}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-8 pt-4 border-t border-border/15 flex items-center justify-between">
          <div className="flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === i ? 'w-6 bg-brand' : 'w-2 bg-border/30'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted hover:text-fg transition"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-2 rounded-xl bg-brand text-brand-fg px-5 py-2.5 text-xs font-bold transition shadow-xs hover:opacity-95 btn-shine"
              >
                <span>Continue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="inline-flex items-center gap-2 rounded-xl bg-brand text-brand-fg px-6 py-2.5 text-xs font-bold transition shadow-glow hover:opacity-95 btn-shine"
              >
                <span>🚀 Launch HackSphere</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
