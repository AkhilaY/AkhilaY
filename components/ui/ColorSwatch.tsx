"use client";

import { useState } from "react";

interface ColorSwatchProps {
  hex: string;
  name?: string;
}

export function ColorSwatch({ hex, name }: ColorSwatchProps) {
  const [tooltip, setTooltip] = useState(false);

  return (
    <span className="relative inline-flex items-center">
      <button
        className="w-5 h-5 border border-border flex-shrink-0 cursor-pointer hover:scale-110 transition-transform duration-150 focus:outline-none focus:ring-1 focus:ring-gold"
        style={{ backgroundColor: hex }}
        aria-label={name ?? hex}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        onFocus={() => setTooltip(true)}
        onBlur={() => setTooltip(false)}
      />
      {tooltip && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-charcoal text-white text-[9px] font-sans tracking-wide whitespace-nowrap pointer-events-none z-10">
          {name ? `${name} ${hex}` : hex}
        </span>
      )}
    </span>
  );
}

const FASHION_COLORS: Record<string, string> = {
  ivory: "#FFFFF0",
  cream: "#FAF9F6",
  camel: "#C19A6B",
  tan: "#D2B48C",
  beige: "#F5F5DC",
  taupe: "#8B8682",
  navy: "#1B2A4A",
  cobalt: "#0047AB",
  sage: "#8B9E6A",
  olive: "#6B6E2A",
  blush: "#F4C2C2",
  rose: "#F08080",
  mauve: "#9B7D7D",
  burgundy: "#800020",
  wine: "#722F37",
  terracotta: "#C15B3E",
  rust: "#B7410E",
  charcoal: "#1A1A1A",
  slate: "#708090",
  sand: "#F4D9B0",
  cognac: "#9A4E1E",
  chocolate: "#7B3F00",
  gold: "#C9A96E",
  champagne: "#F7E7CE",
  pearl: "#F0EDE7",
  bone: "#E8DCC8",
  ecru: "#C2B280",
  wheat: "#F5DEB3",
  white: "#FFFFFF",
  black: "#1A1A1A",
  grey: "#888888",
  gray: "#888888",
  khaki: "#C3B091",
  emerald: "#50C878",
  forest: "#2D5016",
  lilac: "#C8A2C8",
  lavender: "#E6E6FA",
  coral: "#FF7F50",
};

export function extractColors(text: string): { hex: string; name?: string }[] {
  const found: { hex: string; name?: string }[] = [];
  const seen = new Set<string>();

  // Hex codes
  const hexRegex = /#([0-9a-fA-F]{6})\b/g;
  let m: RegExpExecArray | null;
  while ((m = hexRegex.exec(text)) !== null) {
    const hex = `#${m[1].toUpperCase()}`;
    if (!seen.has(hex)) { seen.add(hex); found.push({ hex }); }
  }

  // Named fashion colors
  for (const [name, hex] of Object.entries(FASHION_COLORS)) {
    const pattern = new RegExp(`\\b${name}\\b`, "i");
    if (pattern.test(text) && !seen.has(hex)) {
      seen.add(hex);
      found.push({ hex, name: name.charAt(0).toUpperCase() + name.slice(1) });
    }
  }

  return found.slice(0, 6);
}
