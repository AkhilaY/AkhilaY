import { ProductResult } from "./types";

const SERPAPI_KEY = process.env.SERPAPI_KEY;

export async function searchProducts(
  terms: string[]
): Promise<Record<string, ProductResult[]>> {
  if (!SERPAPI_KEY) {
    return Object.fromEntries(terms.map((t) => [t, []]));
  }

  const results = await Promise.all(
    terms.map(async (term) => {
      try {
        const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(term)}&api_key=${SERPAPI_KEY}&num=4`;
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return { term, products: [] };
        const data = await res.json();
        const products: ProductResult[] = (data.shopping_results ?? [])
          .slice(0, 4)
          .map((r: Record<string, string>) => ({
            title: r.title ?? "",
            price: r.price ?? "",
            thumbnail: r.thumbnail ?? "",
            link: r.link ?? "",
            source: r.source ?? "",
          }));
        return { term, products };
      } catch {
        return { term, products: [] };
      }
    })
  );

  return Object.fromEntries(results.map((r) => [r.term, r.products]));
}

export function googleShoppingFallback(term: string): string {
  return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(term)}`;
}
