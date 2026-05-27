import { ChatMessage } from "@/lib/types";
import AnalysisBadges from "./AnalysisBadges";
import ProductGrid from "@/components/products/ProductGrid";
import LoadingDots from "@/components/ui/LoadingDots";
import { ColorSwatch, extractColors } from "@/components/ui/ColorSwatch";
import Image from "next/image";

interface MessageProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

/* Parse markdown-lite: bold (**text**), bullet lists, numbered lists, paragraphs */
function renderContent(text: string) {
  const blocks = text.split(/\n{2,}/);

  return blocks.map((block, bi) => {
    const lines = block.split("\n");

    // Bullet list
    if (lines.every((l) => /^[-*•]\s/.test(l.trim()) || l.trim() === "")) {
      const items = lines.filter((l) => /^[-*•]\s/.test(l.trim()));
      return (
        <ul key={bi} className="space-y-1.5 my-3">
          {items.map((item, ii) => (
            <li key={ii} className="flex gap-2.5 text-sm font-sans text-charcoal leading-[1.7]">
              <span className="mt-2 w-1 h-1 bg-gold flex-shrink-0" />
              <span>{parseBold(item.replace(/^[-*•]\s/, ""))}</span>
            </li>
          ))}
        </ul>
      );
    }

    // Numbered list
    if (lines.every((l) => /^\d+\.\s/.test(l.trim()) || l.trim() === "")) {
      const items = lines.filter((l) => /^\d+\.\s/.test(l.trim()));
      return (
        <ol key={bi} className="space-y-2 my-3">
          {items.map((item, ii) => (
            <li key={ii} className="flex gap-3 text-sm font-sans text-charcoal leading-[1.7]">
              <span className="font-serif text-gold text-xs mt-0.5 flex-shrink-0 w-4">
                {ii + 1}.
              </span>
              <span>{parseBold(item.replace(/^\d+\.\s/, ""))}</span>
            </li>
          ))}
        </ol>
      );
    }

    // Single line that looks like a heading (short, ends without punctuation, or has ##)
    const trimmed = block.trim();
    if (trimmed.startsWith("## ") || trimmed.startsWith("### ")) {
      const text = trimmed.replace(/^#{2,3}\s/, "");
      return (
        <div key={bi} className="mt-5 mb-2 flex items-center gap-3">
          <div className="w-2 h-px bg-gold" />
          <p className="text-[10px] tracking-[0.25em] uppercase text-muted font-sans">{text}</p>
        </div>
      );
    }

    // Regular paragraph
    if (trimmed === "") return null;
    return (
      <p key={bi} className="text-sm font-sans text-charcoal leading-[1.8] my-2">
        {parseBold(trimmed)}
      </p>
    );
  });
}

function parseBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="font-semibold text-charcoal">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function Message({ message, isStreaming }: MessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex flex-col items-end gap-2 mb-6">
        {message.imagePreview && (
          <div className="relative w-32 h-32 border border-border">
            <Image
              src={message.imagePreview}
              alt="Uploaded"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <div className="bg-charcoal text-white px-4 py-3 max-w-sm">
          <p className="text-sm font-sans leading-relaxed">{message.content}</p>
        </div>
      </div>
    );
  }

  const colors = message.content ? extractColors(message.content) : [];

  return (
    <div className="mb-10">
      {/* Stylist label */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 border border-gold flex items-center justify-center">
          <span className="text-[8px] text-gold font-sans tracking-widest">AI</span>
        </div>
        <span className="text-[10px] tracking-widest uppercase text-muted font-sans">Your Stylist</span>
      </div>

      {/* Analysis badges if present */}
      {message.imageAnalysis && <AnalysisBadges analysis={message.imageAnalysis} />}

      {/* Message body */}
      <div className="border-l-2 border-border pl-4">
        {isStreaming && !message.content ? (
          <LoadingDots />
        ) : (
          <div>
            {renderContent(message.content)}
            {isStreaming && message.content && (
              <span className="inline-block w-0.5 h-4 bg-charcoal ml-0.5 animate-pulse align-middle" />
            )}
          </div>
        )}
      </div>

      {/* Colour palette swatches */}
      {!isStreaming && colors.length > 0 && (
        <div className="mt-4 ml-6 flex items-center gap-3 flex-wrap">
          <p className="text-[9px] tracking-[0.25em] uppercase text-muted font-sans">Palette</p>
          <div className="flex items-center gap-1.5">
            {colors.map((c, i) => (
              <ColorSwatch key={i} hex={c.hex} name={c.name} />
            ))}
          </div>
        </div>
      )}

      {/* Product grid */}
      {!isStreaming && message.products && (
        <div className="mt-4">
          <ProductGrid products={message.products} />
        </div>
      )}
    </div>
  );
}
