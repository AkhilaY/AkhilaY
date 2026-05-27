import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Architectural grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,26,26,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Editorial background typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <span
          className="font-serif leading-none tracking-tighter text-charcoal"
          style={{ fontSize: "22vw", opacity: 0.028 }}
        >
          STYLÉ
        </span>
      </div>

      {/* Animated vertical accent lines */}
      <div className="absolute left-8 md:left-16 top-0 bottom-0 pointer-events-none">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-border to-transparent opacity-60" />
      </div>
      <div className="absolute right-8 md:right-16 top-0 bottom-0 pointer-events-none">
        <div className="w-px h-full bg-gradient-to-b from-transparent via-border to-transparent opacity-60" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6 border-b border-border">
        <span className="font-serif text-xl text-charcoal tracking-tight">Stylé</span>
        <div className="flex items-center gap-8">
          <span className="hidden md:block text-[10px] tracking-[0.25em] uppercase text-muted font-sans">
            AI Personal Stylist
          </span>
          <Link
            href="/onboarding/quiz"
            className="group flex items-center gap-2 text-[10px] tracking-widest uppercase font-sans text-charcoal border border-charcoal px-5 py-2.5 hover:bg-charcoal hover:text-white transition-colors duration-200 cursor-pointer"
          >
            Open Stylist
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            >
              <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </nav>

      {/* Animated gold rule under nav */}
      <div className="relative h-px overflow-hidden">
        <div className="animate-draw-line absolute left-0 top-0 h-full bg-gold/40" />
      </div>

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center py-24 md:py-32">

        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-10 animate-fade-up">
          <div className="w-8 h-px bg-gold" />
          <p className="text-[10px] tracking-[0.35em] uppercase text-gold font-sans">
            AI-Powered Personal Styling
          </p>
          <div className="w-8 h-px bg-gold" />
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-[88px] xl:text-[100px] text-charcoal leading-[1.02] tracking-tight text-balance mb-6 max-w-4xl animate-fade-up-delay-1">
          Dress for the life
          <br />
          <span className="text-muted">you want to live.</span>
        </h1>

        {/* Sub */}
        <p className="text-base md:text-lg text-muted font-sans max-w-md leading-[1.75] mb-14 text-balance animate-fade-up-delay-2">
          Upload a photo, describe the occasion, or simply ask. Your AI stylist
          analyses your unique features and curates real looks from across the web.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 animate-fade-up-delay-3">
          <Link
            href="/onboarding/quiz"
            className="group inline-flex items-center gap-3 bg-charcoal text-white px-10 py-4 text-[11px] tracking-widest uppercase font-sans hover:bg-charcoal/85 transition-colors duration-200 cursor-pointer min-w-[200px] justify-center"
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
            className="inline-flex items-center gap-2 border border-gold text-charcoal px-10 py-4 text-[11px] tracking-widest uppercase font-sans hover:bg-gold/8 transition-colors duration-200 cursor-pointer min-w-[200px] justify-center"
          >
            Take Style Quiz
          </Link>
        </div>

        {/* Trust line */}
        <p className="mt-10 text-[10px] tracking-[0.2em] uppercase text-muted/70 font-sans animate-fade-up-delay-4">
          No account needed &nbsp;&middot;&nbsp; Free to start &nbsp;&middot;&nbsp; Powered by Claude AI
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-10">
        <div className="flex flex-col items-center gap-2.5">
          <div className="w-px h-10 bg-border" />
          <p className="text-[9px] tracking-[0.3em] uppercase text-muted font-sans">Explore</p>
        </div>
      </div>
    </section>
  );
}
