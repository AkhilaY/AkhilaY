import { ProductResult } from "@/lib/types";
import ProductCard from "./ProductCard";
import { googleShoppingFallback } from "@/lib/serpapi";

interface ProductGridProps {
  products: Record<string, ProductResult[]>;
}

export default function ProductGrid({ products }: ProductGridProps) {
  const entries = Object.entries(products).filter(([, items]) => items.length > 0);

  if (entries.length === 0) return null;

  return (
    <div className="mt-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] tracking-widest uppercase text-muted font-sans">Shop These Looks</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {entries.map(([term, items]) => (
        <div key={term}>
          <p className="text-xs text-muted font-sans italic mb-3 capitalize">{term}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {items.length > 0 ? (
              items.map((product, i) => (
                <ProductCard key={i} product={product} searchTerm={term} />
              ))
            ) : (
              <a
                href={googleShoppingFallback(term)}
                target="_blank"
                rel="noopener noreferrer"
                className="col-span-2 sm:col-span-4 text-xs text-gold hover:text-charcoal font-sans transition-colors"
              >
                Search &ldquo;{term}&rdquo; on Google Shopping →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
