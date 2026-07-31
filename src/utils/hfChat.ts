// src/utils/hfChat.ts
//
// Real AI call for Vaigai AI Helper — adapted from VaigAI's sendMessage.ts
// (https://github.com/CatherinGino/VaigAI), pointed at Hugging Face's
// router API. Used as the fallback for open-ended questions that don't
// match one of the deterministic complaint-routing categories.

const API_KEY = import.meta.env.VITE_HF_API_KEY as string | undefined;
const API_URL = "https://router.huggingface.co/v1/chat/completions";

const SYSTEM_PROMPT = `You are Vaigai AI, a campus hostel management assistant.
Answer only questions related to: hostel facilities, complaints and maintenance,
room allocation, visitor/outpass rules, gate timings and curfew, mess/food,
emergency procedures, and hostel community (Hostel Circle) policies.

If a resident describes a maintenance issue (plumbing, electrical, etc.), briefly
acknowledge it and tell them to use the "Log Ticket" option so it can be
auto-routed to the right staff member — do not invent staff names, phone
numbers, or exact policy numbers yourself, since those are shown separately
by the app's own routing system.

If the question is unrelated to hostel life, politely say you're a campus
assistant and redirect them to relevant hostel topics. Keep answers short
(2-4 sentences) and friendly.`;

export async function askVaigaiAI(
  message: string,
  userRole: string = "Resident"
): Promise<string> {
  if (!API_KEY) {
    throw new Error(
      "Hugging Face API key not found. Add VITE_HF_API_KEY to your .env file."
    );
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "Qwen/Qwen2.5-3B-Instruct:featherless-ai",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `[User role: ${userRole}] ${message}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Hugging Face Error:", errorText);
    throw new Error(`API Error ${response.status}`);
  }

  const data = await response.json();

  return (
    data?.choices?.[0]?.message?.content?.trim() ??
    "Sorry, I couldn't generate a response right now."
  );
}