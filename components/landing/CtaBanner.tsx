import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="relative border-t border-charcoal bg-charcoal px-8 md:px-16 py-24 md:py-32 overflow-hidden">
      {/* Grid overlay on dark background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Editorial background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <span
          className="font-serif leading-none tracking-tighter text-white"
          style={{ fontSize: "20vw", opacity: 0.03 }}
        >
          STYLE
        </span>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="w-6 h-px bg-gold/60" />
          <p className="text-[10px] tracking-[0.35em] uppercase text-gold font-sans">
            Your Stylist Awaits
          </p>
          <div className="w-6 h-px bg-gold/60" />
        </div>

        {/* Headline */}
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.08] tracking-tight text-balance mb-6">
          Style is not about clothes.
          <br />
          <span className="text-white/55">It is about intention.</span>
        </h2>

        <p className="text-base text-white/50 font-sans leading-[1.75] max-w-md mx-auto mb-14 text-balance">
          Start a conversation with your AI stylist. Upload a photo, describe your day, or simply ask.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/onboarding/quiz"
            className="group inline-flex items-center gap-3 bg-white text-charcoal px-10 py-4 text-[11px] tracking-widest uppercase font-sans hover:bg-white/90 transition-colors duration-200 cursor-pointer min-w-[200px] justify-center"
          >
            Start Styling
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path d="M3 7.5H12M12 7.5L8 3.5M12 7.5L8 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link
            href="/onboarding/quiz"
            className="inline-flex items-center gap-2 border border-gold/60 text-white/80 px-10 py-4 text-[11px] tracking-widest uppercase font-sans hover:border-gold hover:text-white transition-colors duration-200 cursor-pointer min-w-[200px] justify-center"
          >
            Take Style Quiz
          </Link>
        </div>
      </div>
    </section>
  );
}
