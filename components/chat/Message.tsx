import { ChatMessage } from "@/lib/types";
import AnalysisBadges from "./AnalysisBadges";
import ProductGrid from "@/components/products/ProductGrid";
import LoadingDots from "@/components/ui/LoadingDots";
import Image from "next/image";

interface MessageProps {
  message: ChatMessage;
  isStreaming?: boolean;
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

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 border border-gold flex items-center justify-center">
          <span className="text-[8px] text-gold font-sans tracking-widest">AI</span>
        </div>
        <span className="text-[10px] tracking-widest uppercase text-muted font-sans">Your Stylist</span>
      </div>

      {message.imageAnalysis && <AnalysisBadges analysis={message.imageAnalysis} />}

      <div className="prose prose-sm max-w-none">
        {isStreaming && !message.content ? (
          <LoadingDots />
        ) : (
          <div className="text-sm font-sans text-charcoal leading-loose whitespace-pre-wrap">
            {message.content}
          </div>
        )}
        {isStreaming && message.content && (
          <span className="inline-block w-0.5 h-4 bg-charcoal ml-0.5 animate-pulse align-middle" />
        )}
      </div>

      {!isStreaming && message.products && (
        <ProductGrid products={message.products} />
      )}
    </div>
  );
}
