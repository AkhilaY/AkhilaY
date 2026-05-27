const features = [
  {
    number: "01",
    title: "Upload your photo",
    description: "Our AI reads your skin tone, body type, and facial structure to personalise every recommendation.",
  },
  {
    number: "02",
    title: "Chat naturally",
    description: "Tell your stylist where you're going, what you need, or what you love — and get a curated answer instantly.",
  },
  {
    number: "03",
    title: "Shop real looks",
    description: "Every suggestion links to actual products across the entire web — not just four retailers.",
  },
];

export default function FeatureRow() {
  return (
    <section className="border-t border-border px-8 md:px-16 py-20">
      <p className="text-[10px] tracking-[0.3em] uppercase text-muted font-sans mb-12">How It Works</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {features.map((f) => (
          <div key={f.number} className="flex flex-col gap-4">
            <span className="font-serif text-4xl text-border">{f.number}</span>
            <h3 className="font-serif text-xl text-charcoal">{f.title}</h3>
            <p className="text-sm text-muted font-sans leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
