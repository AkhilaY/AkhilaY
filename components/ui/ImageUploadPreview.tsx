"use client";

import Image from "next/image";

interface ImageUploadPreviewProps {
  preview: string;
  fileName?: string;
  onRemove: () => void;
}

export default function ImageUploadPreview({ preview, fileName, onRemove }: ImageUploadPreviewProps) {
  return (
    <div className="relative inline-flex items-center gap-2 bg-white border border-border rounded-sm px-3 py-2">
      <div className="relative w-10 h-10 flex-shrink-0">
        <Image
          src={preview}
          alt="Upload preview"
          fill
          className="object-cover rounded-sm"
          unoptimized
        />
      </div>
      {fileName && (
        <span className="text-xs text-muted font-sans truncate max-w-[120px]">{fileName}</span>
      )}
      <button
        onClick={onRemove}
        className="ml-1 text-muted hover:text-charcoal transition-colors"
        aria-label="Remove image"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
