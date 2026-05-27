import HeroSection from "@/components/landing/HeroSection";
import FeatureRow from "@/components/landing/FeatureRow";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream">
      <HeroSection />
      <FeatureRow />

      <footer className="border-t border-border px-8 md:px-16 py-8 flex items-center justify-between">
        <span className="font-serif text-charcoal">Stylé</span>
        <p className="text-xs text-muted font-sans">Powered by Claude AI</p>
      </footer>
    </main>
  );
}
