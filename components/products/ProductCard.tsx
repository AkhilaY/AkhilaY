"use client";

import { useState } from "react";
import { ProductResult } from "@/lib/types";
import { googleShoppingFallback } from "@/lib/serpapi";

interface ProductCardProps {
  product: ProductResult;
  searchTerm?: string;
}

export default function ProductCard({ product, searchTerm }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const href = product.link || (searchTerm ? googleShoppingFallback(searchTerm) : "#");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col bg-white border border-border hover:border-gold/60 transition-all duration-200 hover:shadow-sm"
    >
      <div className="relative aspect-square overflow-hidden bg-[#F5F3F0]">
        {!imgError && product.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-border">
              <rect width="32" height="32" rx="2" fill="currentColor" fillOpacity="0.3"/>
              <path d="M8 24L13 17L17 21L21 14L24 24H8Z" fill="currentColor" fillOpacity="0.5"/>
              <circle cx="12" cy="11" r="2.5" fill="currentColor" fillOpacity="0.5"/>
            </svg>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <p className="text-xs font-medium text-charcoal font-sans line-clamp-2 leading-relaxed">
          {product.title}
        </p>
        <div className="flex items-center justify-between mt-1">
          {product.price && (
            <span className="text-xs text-charcoal font-sans font-semibold">{product.price}</span>
          )}
          {product.source && (
            <span className="text-[10px] text-muted font-sans tracking-wide">{product.source}</span>
          )}
        </div>
        <span className="text-[10px] tracking-widest uppercase text-gold font-sans mt-1 group-hover:text-charcoal transition-colors">
          View Item →
        </span>
      </div>
    </a>
  );
}
