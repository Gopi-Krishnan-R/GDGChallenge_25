import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

async function generateWithRetry(prompt, retries = 2, delayMs = 1200) {
  try {
    return await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
  } catch (error) {
    const msg = error?.message || "";
    if (
      retries > 0 &&
      (msg.includes("503") ||
        msg.includes("overloaded") ||
        msg.includes("UNAVAILABLE"))
    ) {
      await new Promise((r) => setTimeout(r, delayMs));
      return generateWithRetry(prompt, retries - 1, delayMs * 1.5);
    }
    throw error;
  }
}

export async function processEventWithAI({ title, rawText, feedback }) {
  const prompt = buildPrompt(title, rawText, feedback);

  try {
    const response = await generateWithRetry(prompt);
    const text = response.text.trim();
    const parsed = parseAIResponse(text);

    return {
      title_ai: parsed.title_ai || title,
      summary_ai: parsed.summary_ai || "",
      description_ai: parsed.description_ai || rawText,
      department_tags: Array.isArray(parsed.department_tags)
        ? parsed.department_tags
        : ["General"],
      event_type: parsed.event_type || "general",
      priority: parsed.priority || "normal",
      venue: parsed.venue || "TBD",
      start_time: parsed.start_time || "TBD",
      end_time: parsed.end_time || "TBD",
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      title_ai: title,
      summary_ai:
        "AI service is temporarily unavailable. Please try again shortly.",
      description_ai: rawText,
      department_tags: ["General"],
      event_type: "general",
      priority: "normal",
      venue: "TBD",
      start_time: "TBD",
      end_time: "TBD",
    };
  }
}

function buildPrompt(title, rawText, feedback) {
  return `
You are an AI assistant for a college event notification system.

Your job is to convert raw event text into a structured event object.
This output is rendered directly in a production UI.

Event title:
${title}

Raw event description:
${rawText}

${feedback ? `
IMPORTANT:
The user has provided corrections.
You MUST apply them exactly.
User correction:
${feedback}
` : ``}

Rules:
- Be factual
- Do not invent information
- Extract dates and venue if present
- Use "TBD" when unclear
- summary_ai must be high-level and concise
- If bullets are used, prefix with "•"
- Convert dates to ISO 8601 when possible
- Output valid JSON only

Return JSON in this exact shape:

{
  "title_ai": string,
  "summary_ai": string,
  "description_ai": string,
  "department_tags": string[],
  "event_type": "workshop" | "seminar" | "hackathon" | "cultural" | "sports" | "academic" | "general",
  "priority": "low" | "normal" | "high",
  "venue": string,
  "start_time": string | "TBD",
  "end_time": string | "TBD"
}
`;
}

function parseAIResponse(text) {
  const clean = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(clean);
}
