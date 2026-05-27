import { ProductResult } from "./types";

const SERPAPI_KEY = process.env.SERPAPI_KEY;

function isDirectMerchantLink(url: string): boolean {
  if (!url) return false;
  try {
    const { hostname } = new URL(url);
    return !hostname.includes("google.com") && !hostname.includes("googleapis.com");
  } catch {
    return false;
  }
}

export async function searchProducts(
  terms: string[]
): Promise<Record<string, ProductResult[]>> {
  if (!SERPAPI_KEY) {
    return Object.fromEntries(terms.map((t) => [t, []]));
  }

  const results = await Promise.all(
    terms.map(async (term) => {
      try {
        const url = `https://serpapi.com/search.json?engine=google_shopping&q=${encodeURIComponent(term)}&api_key=${SERPAPI_KEY}&num=6`;
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) return { term, products: [] };
        const data = await res.json();

        const products: ProductResult[] = (data.shopping_results ?? [])
          .map((r: Record<string, string>) => {
            // Prefer direct merchant link; fall back to product_link only if direct
            const directLink =
              isDirectMerchantLink(r.link) ? r.link :
              isDirectMerchantLink(r.product_link) ? r.product_link :
              "";
            return {
              title: r.title ?? "",
              price: r.price ?? "",
              thumbnail: r.thumbnail ?? "",
              link: directLink,
              source: r.source ?? "",
            };
          })
          // Only include results that have a direct link or at least a title
          .filter((p: ProductResult) => p.title)
          .slice(0, 4);

        return { term, products };
      } catch {
        return { term, products: [] };
      }
    })
  );

  return Object.fromEntries(results.map((r) => [r.term, r.products]));
}

export function googleShoppingFallback(term: string, productTitle?: string): string {
  const query = productTitle ?? term;
  return `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(query)}`;
}
