const items = [
  "Personal Styling",
  "AI-Curated Looks",
  "Occasion Dressing",
  "Colour Analysis",
  "Wardrobe Edit",
  "Style Profiles",
  "Skin Tone Matching",
  "Body-Type Fit",
  "Real Products",
  "Fashion Intelligence",
];

const separator = (
  <span className="mx-6 text-gold/50 select-none" aria-hidden>×</span>
);

export default function MarqueeBand() {
  const doubled = [...items, ...items];

  return (
    <div
      className="border-t border-b border-border overflow-hidden bg-cream py-3.5"
      aria-label="Features ticker"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span className="text-[10px] tracking-[0.3em] uppercase font-sans text-muted">
              {item}
            </span>
            {separator}
          </span>
        ))}
      </div>
    </div>
  );
}
