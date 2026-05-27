export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return { valid: false, error: "Please upload a JPG, PNG, or WebP image." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: "Image must be under 5 MB." };
  }
  return { valid: true };
}

export async function resizeImageFile(file: File, maxDim = 1024): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85).split(",")[1]);
    };
    img.src = url;
  });
}

export function extractSearchTerms(text: string): { clean: string; terms: string[] } {
  const match = text.match(/\[SEARCH_TERMS\]([\s\S]*?)\[\/SEARCH_TERMS\]/);
  if (!match) return { clean: text, terms: [] };
  const clean = text.replace(/\[SEARCH_TERMS\][\s\S]*?\[\/SEARCH_TERMS\]/, "").trim();
  try {
    const parsed = JSON.parse(match[1]);
    return { clean, terms: Array.isArray(parsed.terms) ? parsed.terms : [] };
  } catch {
    return { clean, terms: [] };
  }
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}
