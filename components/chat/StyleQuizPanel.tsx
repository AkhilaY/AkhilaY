"use client";

import { useEffect, useRef } from "react";
import { StyleProfile } from "@/lib/types";
import StyleQuiz from "@/components/quiz/StyleQuiz";
import Badge from "@/components/ui/Badge";

interface StyleQuizPanelProps {
  isOpen: boolean;
  onClose: () => void;
  savedProfile: StyleProfile | null;
  onComplete: (profile: StyleProfile) => void;
}

export default function StyleQuizPanel({ isOpen, onClose, savedProfile, onComplete }: StyleQuizPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) panelRef.current?.scrollTo(0, 0);
  }, [isOpen]);

  return (
    <>
      {/* backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-charcoal/20 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* panel */}
      <aside
        ref={panelRef}
        className={`fixed md:relative top-0 right-0 h-full w-80 bg-white border-l border-border z-30 flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0 md:hidden"
        }`}
      >
        <div className="p-6 border-b border-border">
          <p className="text-[10px] tracking-widest uppercase text-muted font-sans">Style Profile</p>
          <p className="font-serif text-lg text-charcoal mt-0.5">Personalise Your Experience</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {savedProfile ? (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-muted font-sans">Your profile is saved and applied to all suggestions.</p>
              <div className="grid grid-cols-1 gap-3">
                {savedProfile.aesthetic?.length > 0 && (
                  <Badge label="Aesthetic" value={savedProfile.aesthetic.join(", ")} />
                )}
                {savedProfile.colors?.length > 0 && (
                  <Badge label="Colours" value={savedProfile.colors.join(", ")} />
                )}
                {savedProfile.occasions?.length > 0 && (
                  <Badge label="Occasions" value={savedProfile.occasions.join(", ")} />
                )}
                {savedProfile.trendComfort && (
                  <Badge label="Trend attitude" value={savedProfile.trendComfort} />
                )}
                {savedProfile.fitPreference && (
                  <Badge label="Fit preference" value={savedProfile.fitPreference} />
                )}
                {savedProfile.priceRange && (
                  <Badge label="Budget" value={savedProfile.priceRange} />
                )}
              </div>
              <button
                onClick={() => onComplete({ ...savedProfile })}
                className="text-xs text-gold hover:text-charcoal font-sans transition-colors text-left mt-2"
              >
                Retake quiz →
              </button>
            </div>
          ) : (
            <StyleQuiz onComplete={onComplete} onClose={onClose} />
          )}
        </div>
      </aside>
    </>
  );
}
