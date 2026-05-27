"use client";

import { QuizQuestion } from "@/lib/quiz";

interface QuizStepProps {
  question: QuizQuestion;
  selected: string | string[];
  onChange: (value: string | string[]) => void;
}

export default function QuizStep({ question, selected, onChange }: QuizStepProps) {
  const isMulti = question.multiSelect;
  const selectedArr = Array.isArray(selected) ? selected : selected ? [selected] : [];

  function toggle(label: string) {
    if (isMulti) {
      const next = selectedArr.includes(label)
        ? selectedArr.filter((v) => v !== label)
        : [...selectedArr, label];
      onChange(next);
    } else {
      onChange(label);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-serif text-base text-charcoal">{question.question}</p>
      {isMulti && (
        <p className="text-xs text-muted font-sans -mt-2">Select all that apply</p>
      )}
      <div className="grid grid-cols-2 gap-2">
        {question.options.map((opt) => {
          const active = selectedArr.includes(opt.label);
          return (
            <button
              key={opt.label}
              onClick={() => toggle(opt.label)}
              className={`text-left px-4 py-3 border text-xs font-sans transition-all duration-150 ${
                active
                  ? "border-gold bg-gold/10 text-charcoal"
                  : "border-border bg-white text-charcoal hover:border-gold/50"
              }`}
            >
              <span className="font-medium">{opt.label}</span>
              {opt.description && (
                <span className="block text-muted text-[10px] mt-0.5">{opt.description}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
