import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 md:px-16 py-6 border-b border-border">
        <span className="font-serif text-xl text-charcoal tracking-tight">Stylé</span>
        <Link
          href="/chat"
          className="text-xs tracking-widest uppercase font-sans text-muted hover:text-charcoal transition-colors"
        >
          Open Stylist →
        </Link>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center py-24">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gold font-sans mb-8">
          AI-Powered Personal Styling
        </p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-charcoal leading-[1.05] text-balance mb-8">
          Dress for the life<br />
          <em className="not-italic text-muted">you want to live.</em>
        </h1>
        <p className="text-base text-muted font-sans max-w-lg leading-relaxed mb-12 text-balance">
          Upload a photo, describe the occasion, or simply ask. Your AI stylist analyses your unique features and curates real looks from across the web.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/chat"
            className="inline-flex items-center gap-3 bg-charcoal text-white px-8 py-4 text-xs tracking-widest uppercase font-sans hover:bg-charcoal/80 transition-colors"
          >
            Start Styling
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 border border-gold text-charcoal px-8 py-4 text-xs tracking-widest uppercase font-sans hover:bg-gold/5 transition-colors"
          >
            Take Style Quiz
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="flex justify-center pb-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-8 bg-border" />
          <p className="text-[10px] tracking-widest uppercase text-muted font-sans">Explore</p>
        </div>
      </div>
    </section>
  );
}
