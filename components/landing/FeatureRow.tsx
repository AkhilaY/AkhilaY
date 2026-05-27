const features = [
  {
    number: "01",
    title: "Upload your photo",
    description:
      "Our AI reads your skin tone, body proportions, and facial structure to personalise every recommendation to you specifically.",
  },
  {
    number: "02",
    title: "Chat naturally",
    description:
      "Tell your stylist where you're going, what you need, or what you love — and get a curated, considered answer instantly.",
  },
  {
    number: "03",
    title: "Shop real looks",
    description:
      "Every suggestion links to actual products across the entire web — not just a handful of retailers. Real style, real prices.",
  },
];

export default function FeatureRow() {
  return (
    <section className="border-t border-border px-8 md:px-16 py-24">
      {/* Section label */}
      <div className="flex items-center gap-4 mb-16">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted font-sans">
          How It Works
        </p>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {features.map((f, idx) => (
          <div
            key={f.number}
            className={`py-8 md:py-0 md:pr-12 ${
              idx < features.length - 1
                ? "border-b md:border-b-0 md:border-r border-border"
                : ""
            } ${idx > 0 ? "md:pl-12" : ""}`}
          >
            <span className="block font-serif text-[56px] leading-none text-border mb-6">
              {f.number}
            </span>
            <h3 className="font-serif text-xl text-charcoal mb-3 leading-snug">
              {f.title}
            </h3>
            <p className="text-sm text-muted font-sans leading-[1.75]">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
