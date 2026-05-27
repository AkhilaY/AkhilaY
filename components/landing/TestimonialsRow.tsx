const testimonials = [
  {
    quote:
      "I never knew what 'dressing for my body' actually meant until Stylé showed me. The suggestions were spot-on and every item was shoppable.",
    name: "Priya M.",
    role: "Creative Director, London",
  },
  {
    quote:
      "Within two minutes I had a full look for my gallery opening. It understood the brief better than any stylist I've ever worked with.",
    name: "Isabelle K.",
    role: "Architect, Paris",
  },
  {
    quote:
      "The colour analysis alone is worth it. It pulled pieces I would have never chosen myself — and they all worked together perfectly.",
    name: "Anika R.",
    role: "Brand Strategist, New York",
  },
];

export default function TestimonialsRow() {
  return (
    <section className="border-t border-border px-8 md:px-16 py-24">
      {/* Section label */}
      <div className="flex items-center gap-4 mb-16">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted font-sans">
          What People Say
        </p>
        <div className="flex-1 h-px bg-border" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {testimonials.map((t, idx) => (
          <div
            key={t.name}
            className={`py-8 md:py-0 md:pr-12 ${
              idx < testimonials.length - 1
                ? "border-b md:border-b-0 md:border-r border-border"
                : ""
            } ${idx > 0 ? "md:pl-12" : ""}`}
          >
            {/* Gold accent */}
            <div className="w-6 h-px bg-gold mb-6" />

            <blockquote className="font-serif text-lg text-charcoal leading-[1.65] mb-8 italic">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-charcoal font-sans font-medium">
                {t.name}
              </p>
              <p className="text-[10px] text-muted font-sans mt-0.5">
                {t.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
