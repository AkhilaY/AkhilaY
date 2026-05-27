"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChatMessage, ImageAnalysis, StyleProfile } from "@/lib/types";
import { extractSearchTerms, generateId, resizeImageFile } from "@/lib/utils";
import {
  loadStyleProfile,
  loadPhotoAnalysis,
  hasCompletedOnboarding,
} from "@/lib/quiz";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import StyleQuizPanel from "./StyleQuizPanel";

export default function ChatInterface() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [styleProfile, setStyleProfile] = useState<StyleProfile | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<ImageAnalysis | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasCompletedOnboarding()) {
      router.replace("/onboarding/quiz");
      return;
    }
    setStyleProfile(loadStyleProfile());
    const saved = loadPhotoAnalysis();
    if (saved) setCurrentAnalysis(saved);
    setReady(true);
  }, [router]);

  const fetchProducts = useCallback(async (terms: string[], msgId: string) => {
    if (terms.length === 0) return;
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ terms }),
      });
      const data = await res.json();
      if (data.results) {
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId ? { ...m, products: data.results } : m))
        );
      }
    } catch {
      // silently fall back — ProductGrid handles empty arrays
    }
  }, []);

  const sendMessage = useCallback(async (text: string, file?: File) => {
    if (isLoading) return;

    let imageAnalysis: ImageAnalysis | null = null;
    let imagePreview: string | undefined;

    if (file) {
      imagePreview = URL.createObjectURL(file);
      setIsLoading(true);
      try {
        const base64 = await resizeImageFile(file);
        const arr = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        const blob = new Blob([arr], { type: file.type });
        const form = new FormData();
        form.append("image", blob, file.name);
        const res = await fetch("/api/analyze", { method: "POST", body: form });
        const json = await res.json();
        if (json.success) {
          imageAnalysis = json.data;
          setCurrentAnalysis(json.data);
        }
      } catch {
        // proceed without analysis
      }
    }

    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: text,
      imagePreview,
    };

    const assistantId = generateId();
    const assistantMsg: ChatMessage = { id: assistantId, role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setStreamingId(assistantId);
    setIsLoading(true);

    const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          styleProfile,
          imageAnalysis: imageAnalysis ?? currentAnalysis,
        }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: fullText } : m))
        );
      }

      const { clean, terms } = extractSearchTerms(fullText);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: clean, searchTerms: terms, imageAnalysis: imageAnalysis ?? undefined }
            : m
        )
      );

      fetchProducts(terms, assistantId);
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Something went wrong. Please try again." }
            : m
        )
      );
    } finally {
      setStreamingId(null);
      setIsLoading(false);
    }
  }, [isLoading, messages, styleProfile, currentAnalysis, fetchProducts]);

  function handlePromptSelect(prompt: string) {
    sendMessage(prompt);
  }

  function handleQuizComplete(profile: StyleProfile) {
    setStyleProfile(profile);
    setQuizOpen(false);
  }

  if (!ready) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-6 h-6 border border-gold/40 border-t-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-full relative overflow-hidden">
      {/* Main chat */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-white flex-shrink-0">
          <div>
            <a href="/" className="text-[10px] tracking-widest uppercase text-muted font-sans hover:text-charcoal transition-colors">
              &larr; Home
            </a>
            <p className="font-serif text-lg text-charcoal mt-0.5">Your Stylist</p>
          </div>
          <button
            onClick={() => setQuizOpen((o) => !o)}
            className={`flex items-center gap-2 px-4 py-2 border text-xs tracking-widest uppercase font-sans transition-all cursor-pointer ${
              styleProfile
                ? "border-gold text-gold bg-gold/5 hover:bg-gold/10"
                : "border-border text-muted hover:border-gold hover:text-gold"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M2 12C2 9.79086 4.23858 8 7 8C9.76142 8 12 9.79086 12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            {styleProfile ? "Style Profile" : "Style Profile"}
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <MessageList
            messages={messages}
            streamingId={streamingId ?? undefined}
            onPromptSelect={handlePromptSelect}
          />
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>

      {/* Quiz panel */}
      <StyleQuizPanel
        isOpen={quizOpen}
        onClose={() => setQuizOpen(false)}
        savedProfile={styleProfile}
        onComplete={handleQuizComplete}
      />
    </div>
  );
}
