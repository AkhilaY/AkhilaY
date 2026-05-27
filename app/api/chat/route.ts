export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { buildSystemPrompt, streamChat } from "@/lib/claude";
import { ImageAnalysis, StyleProfile } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      styleProfile,
      imageAnalysis,
    }: {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      styleProfile?: StyleProfile;
      imageAnalysis?: ImageAnalysis;
    } = body;

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), { status: 400 });
    }

    const systemPrompt = buildSystemPrompt(styleProfile, imageAnalysis);
    const stream = await streamChat(messages, systemPrompt);

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response(JSON.stringify({ error: "Failed to generate response" }), { status: 500 });
  }
}
