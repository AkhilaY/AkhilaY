export interface StyleProfile {
  aesthetic: string[];
  colors: string[];
  occasions: string[];
  trendComfort: string;
  fitPreference: string;
  priceRange: string;
  brandNotes: string;
}

export interface ImageAnalysis {
  skin_tone: { depth: string; undertone: string; description: string };
  body_type: { type: string; description: string };
  facial_structure: { type: string; description: string };
}

export interface ProductResult {
  title: string;
  price: string;
  thumbnail: string;
  link: string;
  source: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  imageAnalysis?: ImageAnalysis;
  products?: Record<string, ProductResult[]>;
  searchTerms?: string[];
  imagePreview?: string;
}

export type OccasionTab = "casual" | "work" | "formal" | "evening";
