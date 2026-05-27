export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/serpapi";

export async function POST(req: NextRequest) {
  try {
    const { terms }: { terms: string[] } = await req.json();
    if (!terms || terms.length === 0) {
      return NextResponse.json({ results: {} });
    }
    const results = await searchProducts(terms.slice(0, 4));
    return NextResponse.json({ results });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ results: {} }, { status: 500 });
  }
}
