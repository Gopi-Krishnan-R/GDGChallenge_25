// src/services/gemini.js
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

/**
 * Retry wrapper for transient Gemini failures
 */
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

/**
 * Main AI processing function
 */
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

    // Hard fallback (UI must never break)
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

/**
 * Prompt builder — this is where effectiveness is controlled
 */
function buildPrompt(title, rawText, feedback) {
  return `
You are an AI assistant for a college event notification system.

Your job is to convert raw event text into a structured event object.
This output is rendered directly in a production UI.

====================
PRIMARY INPUT
====================

Event title:
${title}

Raw event description:
${rawText}

====================
CORRECTION OVERRIDE
====================

${feedback ? `
IMPORTANT:
The user has provided corrections to your previous output.

You MUST apply these instructions EXACTLY.
If there is any conflict, the feedback OVERRIDES EVERYTHING.

User correction:
${feedback}
` : `
No corrections provided.
`}

====================
STRICT RULES
====================

- Be factual and conservative
- Do NOT invent information
- Extract dates and venue 
- If any field is missing or unclear, use "TBD"
- summary_ai:
  - High-level overview only
  - Do NOT repeat venue or dates
  - If bullet points requested:
    • Use "•"
    • 3–5 bullets max
- start_time and end_time:
  - If dates are present,try to convert it to ISO 8601
- Output MUST be valid JSON only
- No markdown, no headings, no commentary

====================
OUTPUT SCHEMA
====================

Return ONLY valid JSON:

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

/**
 * Sanitize Gemini output
 */
function parseAIResponse(text) {
  const clean = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(clean);
}
