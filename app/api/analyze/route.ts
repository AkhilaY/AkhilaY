export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/lib/claude";

type AllowedMime = "image/jpeg" | "image/png" | "image/webp" | "image/gif";
const ALLOWED_MIMES: AllowedMime[] = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No image provided", code: "BAD_IMAGE" }, { status: 400 });
    }

    if (!ALLOWED_MIMES.includes(file.type as AllowedMime)) {
      return NextResponse.json({ success: false, error: "Unsupported image format", code: "BAD_IMAGE" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "Image must be under 5 MB", code: "BAD_IMAGE" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const analysis = await analyzeImage(base64, file.type as AllowedMime);

    return NextResponse.json({ success: true, data: analysis });
  } catch (err: unknown) {
    const error = err as Error & { code?: string };
    if (error.code === "NO_FACE") {
      return NextResponse.json({ success: false, error: error.message, code: "NO_FACE" }, { status: 400 });
    }
    if (error.code === "BAD_IMAGE") {
      return NextResponse.json({ success: false, error: error.message, code: "BAD_IMAGE" }, { status: 400 });
    }
    console.error("Analyze API error:", err);
    return NextResponse.json({ success: false, error: "Analysis failed", code: "API_ERROR" }, { status: 500 });
  }
}
