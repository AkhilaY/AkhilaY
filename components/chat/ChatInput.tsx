"use client";

import { useRef, useState, KeyboardEvent } from "react";
import { validateImageFile } from "@/lib/utils";
import ImageUploadPreview from "@/components/ui/ImageUploadPreview";

interface ChatInputProps {
  onSend: (text: string, file?: File) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleFile(chosen: File) {
    const { valid, error } = validateImageFile(chosen);
    if (!valid) { setFileError(error ?? null); return; }
    setFileError(null);
    setFile(chosen);
    setPreview(URL.createObjectURL(chosen));
  }

  function handleRemoveFile() {
    setFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed && !file) return;
    onSend(trimmed || "Analyze my photo and suggest outfits.", file ?? undefined);
    setText("");
    handleRemoveFile();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleTextChange(val: string) {
    setText(val);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }

  return (
    <div className="border-t border-border bg-white px-4 py-4">
      {fileError && (
        <p className="text-xs text-red-500 font-sans mb-2">{fileError}</p>
      )}
      {preview && file && (
        <div className="mb-3">
          <ImageUploadPreview
            preview={preview}
            fileName={file.name}
            onRemove={handleRemoveFile}
          />
        </div>
      )}

      <div className="flex items-end gap-3 border border-border bg-white focus-within:border-gold/60 transition-colors">
        {/* image upload */}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
          className="p-3 text-muted hover:text-charcoal transition-colors flex-shrink-0 disabled:opacity-40"
          aria-label="Upload image"
          title="Upload photo for personalised analysis"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="3" width="16" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <circle cx="6.5" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M1 13L5.5 9.5L8 12L11.5 8L17 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {/* textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder="Ask your stylist anything..."
          rows={1}
          className="flex-1 resize-none bg-transparent py-3 pr-1 text-sm font-sans text-charcoal placeholder:text-muted focus:outline-none disabled:opacity-40"
          style={{ minHeight: "44px" }}
        />

        {/* send */}
        <button
          onClick={handleSend}
          disabled={disabled || (!text.trim() && !file)}
          className="p-3 text-muted hover:text-charcoal disabled:opacity-30 transition-colors flex-shrink-0"
          aria-label="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M16 9L2 2L5.5 9L2 16L16 9Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <p className="text-[10px] text-muted font-sans mt-2 text-center">
        Press Enter to send · Shift+Enter for new line · Upload a photo for personalised suggestions
      </p>
    </div>
  );
}
