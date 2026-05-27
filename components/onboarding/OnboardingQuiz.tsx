"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QUIZ_QUESTIONS, saveStyleProfile } from "@/lib/quiz";
import { StyleProfile } from "@/lib/types";

const EMPTY: StyleProfile = {
  aesthetic: [],
  colors: [],
  occasions: [],
  trendComfort: "",
  fitPreference: "",
  priceRange: "",
  brandNotes: "",
};

export default function OnboardingQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<StyleProfile>(EMPTY);
  const [exiting, setExiting] = useState(false);

  const question = QUIZ_QUESTIONS[step];
  const current = profile[question.id as keyof StyleProfile] as string | string[];
  const selectedArr = Array.isArray(current) ? current : current ? [current] : [];
  const hasValue = Array.isArray(current) ? current.length > 0 : Boolean(current);
  const isLast = step === QUIZ_QUESTIONS.length - 1;
  const progress = ((step + 1) / QUIZ_QUESTIONS.length) * 100;

  function toggle(label: string) {
    if (question.multiSelect) {
      const next = selectedArr.includes(label)
        ? selectedArr.filter((v) => v !== label)
        : [...selectedArr, label];
      setProfile((p) => ({ ...p, [question.id]: next }));
    } else {
      setProfile((p) => ({ ...p, [question.id]: label }));
    }
  }

  function next() {
    if (isLast) {
      setExiting(true);
      saveStyleProfile(profile);
      setTimeout(() => router.push("/onboarding/photo"), 300);
    } else {
      setStep((s) => s + 1);
    }
  }

  return (
    <div
      className={`min-h-screen bg-cream flex flex-col transition-opacity duration-300 ${exiting ? "opacity-0" : "opacity-100"}`}
    >
      {/* Architectural grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,26,26,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6 border-b border-border">
        <span className="font-serif text-xl text-charcoal tracking-tight">Stylé</span>
        <div className="flex items-center gap-6">
          <span className="text-[10px] tracking-[0.3em] uppercase text-muted font-sans">
            Style Profile
          </span>
          <div className="flex items-center gap-1.5">
            {QUIZ_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-px transition-all duration-500 ${
                  i < step ? "w-6 bg-gold" : i === step ? "w-6 bg-gold" : "w-3 bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Gold progress line */}
      <div className="relative h-px bg-border">
        <div
          className="absolute left-0 top-0 h-full bg-gold transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-2xl">
          {/* Step indicator */}
          <p className="text-[10px] tracking-[0.35em] uppercase text-gold font-sans mb-8 animate-fade-up">
            {String(step + 1).padStart(2, "0")} / {String(QUIZ_QUESTIONS.length).padStart(2, "0")}
          </p>

          {/* Question */}
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal leading-tight mb-3 animate-fade-up-delay-1">
            {question.question}
          </h2>
          {question.multiSelect && (
            <p className="text-sm text-muted font-sans mb-10 animate-fade-up-delay-1">
              Select all that apply
            </p>
          )}
          {!question.multiSelect && <div className="mb-10" />}

          {/* Options */}
          <div
            className={`grid gap-2 animate-fade-up-delay-2 ${
              question.options.length <= 3 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {question.options.map((opt) => {
              const active = selectedArr.includes(opt.label);
              return (
                <button
                  key={opt.label}
                  onClick={() => toggle(opt.label)}
                  className={`group text-left px-6 py-5 border transition-all duration-200 cursor-pointer ${
                    active
                      ? "border-gold bg-gold/8 text-charcoal"
                      : "border-border bg-white/60 text-charcoal hover:border-charcoal/30 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block font-sans text-sm font-medium">{opt.label}</span>
                      {opt.description && (
                        <span className="block text-muted text-xs font-sans mt-0.5">
                          {opt.description}
                        </span>
                      )}
                    </div>
                    <div
                      className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 ml-4 transition-colors duration-200 ${
                        active ? "border-gold bg-gold" : "border-border"
                      }`}
                    >
                      {active && (
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-border animate-fade-up-delay-3">
            <button
              onClick={() => step > 0 && setStep((s) => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 text-xs font-sans text-muted hover:text-charcoal disabled:opacity-20 transition-colors cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>

            <button
              onClick={next}
              disabled={!hasValue}
              className="group flex items-center gap-3 bg-charcoal text-white px-8 py-3.5 text-[11px] tracking-widest uppercase font-sans hover:bg-charcoal/85 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
            >
              {isLast ? "Complete Profile" : "Continue"}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path d="M2 7H12M12 7L7 2M12 7L7 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom note */}
      <footer className="relative z-10 px-8 md:px-16 py-5 border-t border-border">
        <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans text-center">
          Your profile is saved locally and never shared
        </p>
      </footer>
    </div>
  );
}
