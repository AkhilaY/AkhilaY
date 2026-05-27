import { ImageAnalysis } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface AnalysisBadgesProps {
  analysis: ImageAnalysis;
}

export default function AnalysisBadges({ analysis }: AnalysisBadgesProps) {
  return (
    <div className="flex flex-wrap gap-4 px-4 py-3 bg-cream border border-border mb-2">
      <Badge label="Skin Tone" value={`${analysis.skin_tone.depth} · ${analysis.skin_tone.undertone}`} />
      <div className="w-px bg-border self-stretch" />
      <Badge label="Body Type" value={analysis.body_type.type} />
      <div className="w-px bg-border self-stretch" />
      <Badge label="Face Shape" value={analysis.facial_structure.type} />
    </div>
  );
}
