"use client";

import { useState } from "react";
import { QUIZ_QUESTIONS, saveStyleProfile } from "@/lib/quiz";
import { StyleProfile } from "@/lib/types";
import QuizStep from "./QuizStep";
import Button from "@/components/ui/Button";

interface StyleQuizProps {
  onComplete: (profile: StyleProfile) => void;
  onClose: () => void;
}

const EMPTY: StyleProfile = {
  aesthetic: [],
  colors: [],
  occasions: [],
  trendComfort: "",
  fitPreference: "",
  priceRange: "",
  brandNotes: "",
};

export default function StyleQuiz({ onComplete, onClose }: StyleQuizProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<StyleProfile>(EMPTY);

  const question = QUIZ_QUESTIONS[step];
  const current = profile[question.id as keyof StyleProfile] as string | string[];

  function handleChange(value: string | string[]) {
    setProfile((prev) => ({ ...prev, [question.id]: value }));
  }

  function next() {
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      saveStyleProfile(profile);
      onComplete(profile);
    }
  }

  const isLast = step === QUIZ_QUESTIONS.length - 1;
  const hasValue = Array.isArray(current) ? current.length > 0 : Boolean(current);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-muted font-sans">
            {step + 1} / {QUIZ_QUESTIONS.length}
          </p>
          <div className="flex gap-1 mt-1.5">
            {QUIZ_QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 transition-colors duration-300 ${i <= step ? "bg-gold" : "bg-border"}`}
              />
            ))}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted hover:text-charcoal transition-colors"
          aria-label="Close quiz"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <QuizStep question={question} selected={current} onChange={handleChange} />

        {question.id === "brandNotes" && (
          <div className="mt-3">
            <textarea
              placeholder="e.g. Arket, &Other Stories, vintage..."
              value={profile.brandNotes}
              onChange={(e) => setProfile((prev) => ({ ...prev, brandNotes: e.target.value }))}
              className="w-full border border-border bg-white px-3 py-2 text-xs font-sans text-charcoal placeholder:text-muted resize-none focus:outline-none focus:border-gold"
              rows={3}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-border mt-4">
        <button
          onClick={() => step > 0 && setStep((s) => s - 1)}
          disabled={step === 0}
          className="text-xs font-sans text-muted hover:text-charcoal disabled:opacity-30 transition-colors"
        >
          ← Back
        </button>
        <Button
          onClick={next}
          disabled={!hasValue && question.id !== "brandNotes"}
          size="sm"
        >
          {isLast ? "Save Profile" : "Next →"}
        </Button>
      </div>
    </div>
  );
}
