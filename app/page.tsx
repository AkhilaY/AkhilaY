import HeroSection from "@/components/landing/HeroSection";
import MarqueeBand from "@/components/landing/MarqueeBand";
import FeatureRow from "@/components/landing/FeatureRow";
import CtaBanner from "@/components/landing/CtaBanner";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream">
      <HeroSection />
      <MarqueeBand />
      <FeatureRow />
      <CtaBanner />

      <footer className="border-t border-border px-8 md:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-serif text-lg text-charcoal">Stylé</span>
        <div className="flex items-center gap-6">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans">
            Powered by Claude AI
          </p>
          <div className="w-px h-3 bg-border" />
          <p className="text-[10px] text-muted font-sans">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}
