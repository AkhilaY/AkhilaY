"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ImageAnalysis } from "@/lib/types";
import { savePhotoAnalysis, markOnboardingComplete } from "@/lib/quiz";
import { resizeImageFile, validateImageFile } from "@/lib/utils";
import Image from "next/image";

export default function OnboardingPhoto() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    const { valid, error: vErr } = validateImageFile(file);
    if (!valid) { setError(vErr ?? "Invalid file"); return; }

    setError(null);
    setAnalysis(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const base64 = await resizeImageFile(file);
      const arr = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const blob = new Blob([arr], { type: file.type });
      const form = new FormData();
      form.append("image", blob, file.name);

      const res = await fetch("/api/analyze", { method: "POST", body: form });
      const json = await res.json();

      if (json.success) {
        setAnalysis(json.data);
        savePhotoAnalysis(json.data);
      } else {
        setError(json.error ?? "Analysis failed. Please try another photo.");
        setPreview(null);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function proceed() {
    markOnboardingComplete();
    router.push("/chat");
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Architectural grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,26,26,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,26,0.025) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 md:px-16 py-6 border-b border-border">
        <span className="font-serif text-xl text-charcoal tracking-tight">Stylé</span>
        <button
          onClick={proceed}
          className="text-[10px] tracking-widest uppercase font-sans text-muted hover:text-charcoal transition-colors cursor-pointer"
        >
          Skip for now
        </button>
      </header>

      <main className="relative z-10 flex-1 flex items-start justify-center px-8 py-16">
        <div className="w-full max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-5 h-px bg-gold" />
            <p className="text-[10px] tracking-[0.35em] uppercase text-gold font-sans">
              Optional Step
            </p>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-charcoal leading-tight mb-3 animate-fade-up">
            Add a photo for precise recommendations
          </h2>
          <p className="text-sm text-muted font-sans leading-[1.75] max-w-md mb-12 animate-fade-up-delay-1">
            Your stylist will read your skin tone, undertone, and body proportions to personalise every suggestion. Your photo is never stored on our servers.
          </p>

          {!analysis ? (
            /* Upload zone */
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && fileRef.current?.click()}
              className={`relative border-2 border-dashed transition-all duration-200 cursor-pointer ${
                dragging ? "border-gold bg-gold/5" : "border-border hover:border-charcoal/30 hover:bg-white/50"
              }`}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              {preview ? (
                /* Preview + loading */
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F3F0]">
                  <Image src={preview} alt="Your photo" fill className="object-cover" unoptimized />
                  {uploading && (
                    <div className="absolute inset-0 bg-cream/80 flex flex-col items-center justify-center gap-4">
                      <div className="w-8 h-8 border border-gold/40 border-t-gold animate-spin" />
                      <p className="text-[11px] tracking-[0.25em] uppercase text-muted font-sans">
                        Analysing
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
                  <div className="w-12 h-12 border border-border flex items-center justify-center mb-6">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-muted">
                      <rect x="1" y="3" width="18" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                      <circle cx="7" cy="9" r="2" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M1 15L6 10.5L9.5 13.5L13 9L19 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-sm font-sans text-charcoal mb-2">Drop your photo here</p>
                  <p className="text-xs text-muted font-sans">or click to browse</p>
                  <p className="text-[10px] text-muted/70 font-sans mt-4">
                    JPG, PNG or WebP &nbsp;·&nbsp; Max 5 MB
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Analysis results */
            <div className="animate-fade-up">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-2 bg-gold" />
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted font-sans">
                  Analysis Complete
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
                {/* Skin Tone */}
                <div className="bg-cream p-6">
                  <div className="w-4 h-px bg-gold mb-4" />
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted font-sans mb-2">
                    Skin Tone
                  </p>
                  <p className="font-serif text-lg text-charcoal leading-snug mb-2">
                    {analysis.skin_tone.depth}
                  </p>
                  <p className="text-xs text-muted font-sans leading-relaxed">
                    <span className="text-charcoal font-medium">{analysis.skin_tone.undertone}</span> undertone
                    <br />
                    {analysis.skin_tone.description}
                  </p>
                </div>

                {/* Body Type */}
                <div className="bg-cream p-6">
                  <div className="w-4 h-px bg-gold mb-4" />
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted font-sans mb-2">
                    Body Type
                  </p>
                  <p className="font-serif text-lg text-charcoal leading-snug mb-2">
                    {analysis.body_type.type}
                  </p>
                  <p className="text-xs text-muted font-sans leading-relaxed">
                    {analysis.body_type.description}
                  </p>
                </div>

                {/* Facial Structure */}
                <div className="bg-cream p-6">
                  <div className="w-4 h-px bg-gold mb-4" />
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted font-sans mb-2">
                    Face Shape
                  </p>
                  <p className="font-serif text-lg text-charcoal leading-snug mb-2">
                    {analysis.facial_structure.type}
                  </p>
                  <p className="text-xs text-muted font-sans leading-relaxed">
                    {analysis.facial_structure.description}
                  </p>
                </div>
              </div>

              {/* Retake option */}
              <button
                onClick={() => { setAnalysis(null); setPreview(null); }}
                className="mt-4 text-xs text-muted hover:text-charcoal font-sans transition-colors cursor-pointer"
              >
                Retake photo
              </button>
            </div>
          )}

          {error && (
            <p className="mt-4 text-xs text-red-500 font-sans">{error}</p>
          )}

          {/* CTA */}
          <div className="mt-12 flex items-center gap-4">
            <button
              onClick={proceed}
              className="group flex items-center gap-3 bg-charcoal text-white px-10 py-4 text-[11px] tracking-widest uppercase font-sans hover:bg-charcoal/85 transition-colors duration-200 cursor-pointer"
            >
              {analysis ? "Continue to Chat" : "Skip and Continue"}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                <path d="M2 7H12M12 7L7 2M12 7L7 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {analysis && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gold" />
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted font-sans">
                  Profile saved
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
