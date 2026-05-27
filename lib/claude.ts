import Anthropic from "@anthropic-ai/sdk";
import { ImageAnalysis, StyleProfile } from "./types";
import { profileToPromptText } from "./quiz";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export function buildSystemPrompt(
  styleProfile?: StyleProfile | null,
  imageAnalysis?: ImageAnalysis | null
): string {
  let prompt = `You are a world-class personal stylist with deep expertise in colour theory, body-type dressing, and occasion-appropriate fashion. You give warm, specific, and actionable outfit advice.

Always write in a refined but approachable tone — like a trusted friend who happens to be a fashion editor.`;

  if (styleProfile) {
    const profileText = profileToPromptText(styleProfile);
    prompt += `\n\nThe user has completed a style quiz. Their profile: ${profileText}. Incorporate this into every suggestion.`;
  }

  if (imageAnalysis) {
    const { skin_tone, body_type, facial_structure } = imageAnalysis;
    prompt += `\n\nThe user's physical features have been analysed from their photo:
- Skin tone: ${skin_tone.depth} depth with ${skin_tone.undertone} undertones — ${skin_tone.description}
- Body type: ${body_type.type} — ${body_type.description}
- Facial structure: ${facial_structure.type} — ${facial_structure.description}
Tailor all suggestions to these specific features.`;
  }

  prompt += `

At the end of EVERY response, append exactly this block (do not show it as prose — it will be parsed by the app):
[SEARCH_TERMS]{"terms":["<specific search phrase 1>","<specific search phrase 2>","<specific search phrase 3>","<specific search phrase 4>"]}[/SEARCH_TERMS]

The search terms must be specific, retail-ready phrases (3–6 words each) for Google Shopping that would find exact items mentioned in your suggestions — e.g. "terracotta linen wide-leg trousers" not "trousers". Include 4 terms per response.`;

  return prompt;
}

export async function streamChat(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  systemPrompt: string
): Promise<ReadableStream<Uint8Array>> {
  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
    cancel() {
      stream.controller.abort();
    },
  });
}

const ANALYZE_SYSTEM = `You are a professional image analyst. Analyze the person in the photo and return ONLY a valid JSON object — no markdown, no fences, no extra text.

If there is no person clearly visible, return: {"error":"NO_FACE","message":"No person detected in the image."}
If the image is too dark or blurry, return: {"error":"BAD_IMAGE","message":"Image quality insufficient."}`;

const ANALYZE_USER_TEXT = `Analyze the person in this photo and return exactly this JSON structure:
{
  "skin_tone": {
    "depth": "<fair|light|medium|tan|deep>",
    "undertone": "<warm|cool|neutral>",
    "description": "<2-3 sentence description>"
  },
  "body_type": {
    "type": "<inverted_triangle|rectangle|pear|hourglass|apple>",
    "description": "<2-3 sentence description of proportions>"
  },
  "facial_structure": {
    "type": "<oval|round|square|heart|oblong>",
    "description": "<2-3 sentence description of facial features>"
  }
}`;

export async function analyzeImage(
  base64: string,
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/gif"
): Promise<ImageAnalysis> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    temperature: 0,
    system: ANALYZE_SYSTEM,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mimeType, data: base64 },
          },
          { type: "text", text: ANALYZE_USER_TEXT },
        ],
      },
    ],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const parsed = JSON.parse(cleaned);

  if (parsed.error) {
    const err = new Error(parsed.message ?? "Analysis failed") as Error & { code: string };
    err.code = parsed.error;
    throw err;
  }

  return parsed as ImageAnalysis;
}
