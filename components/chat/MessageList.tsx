"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "@/lib/types";
import Message from "./Message";

interface MessageListProps {
  messages: ChatMessage[];
  streamingId?: string;
}

export default function MessageList({ messages, streamingId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingId]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
        <div className="w-10 h-10 border border-gold flex items-center justify-center">
          <span className="text-gold font-serif text-lg">S</span>
        </div>
        <div>
          <p className="font-serif text-xl text-charcoal mb-2">Your personal stylist awaits</p>
          <p className="text-sm text-muted font-sans max-w-xs leading-relaxed">
            Ask me anything — from &quot;What to wear to a gallery opening?&quot; to &quot;Build my summer capsule wardrobe.&quot; Upload a photo for personalised analysis.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-sm mt-2">
          {STARTER_PROMPTS.map((p) => (
            <div key={p} className="border border-border bg-white px-3 py-2.5 text-xs font-sans text-muted text-left">
              {p}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 scrollbar-hide">
      {messages.map((msg) => (
        <Message
          key={msg.id}
          message={msg}
          isStreaming={msg.id === streamingId}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

const STARTER_PROMPTS = [
  '"What to wear to a rooftop party in Ibiza?"',
  '"Build me a Parisian capsule wardrobe"',
  '"Style me for a creative director interview"',
  '"Evening look for the opera — dramatic but chic"',
];
