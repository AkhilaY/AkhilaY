import { StyleProfile } from "./types";

export interface QuizQuestion {
  id: keyof StyleProfile;
  question: string;
  multiSelect: boolean;
  options: { label: string; description?: string }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "aesthetic",
    question: "What's your overall style aesthetic?",
    multiSelect: true,
    options: [
      { label: "Minimal" },
      { label: "Classic" },
      { label: "Bohemian" },
      { label: "Edgy" },
      { label: "Romantic" },
      { label: "Streetwear" },
    ],
  },
  {
    id: "colors",
    question: "Which colors do you gravitate toward?",
    multiSelect: true,
    options: [
      { label: "Neutrals" },
      { label: "Pastels" },
      { label: "Earth tones" },
      { label: "Black & white" },
      { label: "Bold & bright" },
      { label: "Jewel tones" },
    ],
  },
  {
    id: "occasions",
    question: "What occasions do you dress for most?",
    multiSelect: true,
    options: [
      { label: "Work" },
      { label: "Casual" },
      { label: "Events" },
      { label: "Date nights" },
      { label: "Travel" },
      { label: "Athletic" },
    ],
  },
  {
    id: "trendComfort",
    question: "How do you feel about trends?",
    multiSelect: false,
    options: [
      { label: "Trendsetter", description: "I love being first" },
      { label: "Balanced", description: "Selective about trends" },
      { label: "Timeless", description: "I prefer classics" },
    ],
  },
  {
    id: "fitPreference",
    question: "What's your fit preference?",
    multiSelect: false,
    options: [
      { label: "Fitted" },
      { label: "Relaxed" },
      { label: "Oversized" },
      { label: "Mix it up" },
    ],
  },
  {
    id: "priceRange",
    question: "What's your typical budget per piece?",
    multiSelect: false,
    options: [
      { label: "Luxury", description: "€200+" },
      { label: "Contemporary", description: "€50–200" },
      { label: "High-street", description: "Under €50" },
      { label: "Mix", description: "Varies" },
    ],
  },
];

const STORAGE_KEY = "styleProfile";

export function saveStyleProfile(profile: StyleProfile): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
}

export function loadStyleProfile(): StyleProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StyleProfile;
  } catch {
    return null;
  }
}

export function profileToPromptText(profile: StyleProfile): string {
  const parts: string[] = [];
  if (profile.aesthetic?.length) parts.push(`Style aesthetic: ${profile.aesthetic.join(", ")}`);
  if (profile.colors?.length) parts.push(`Favourite colours: ${profile.colors.join(", ")}`);
  if (profile.occasions?.length) parts.push(`Main occasions: ${profile.occasions.join(", ")}`);
  if (profile.trendComfort) parts.push(`Trend attitude: ${profile.trendComfort}`);
  if (profile.fitPreference) parts.push(`Fit preference: ${profile.fitPreference}`);
  if (profile.priceRange) parts.push(`Budget range: ${profile.priceRange}`);
  if (profile.brandNotes) parts.push(`Brand notes: ${profile.brandNotes}`);
  return parts.join(". ");
}
