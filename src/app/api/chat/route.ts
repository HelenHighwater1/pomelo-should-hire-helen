import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import type { CountyStats } from "@/data/types";
import { ACCESS_LEVEL_LABELS, AI_MAX_TOKENS, AI_MODEL } from "@/data/constants";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function buildSystemPrompt(county: CountyStats): string {
  const countyDataLines = [
    `County: ${county.name} County, ${county.state}`,
    `Access level: ${ACCESS_LEVEL_LABELS[county.accessLevel]}`,
    ...(county.womenReproductiveAge != null
      ? [`Women of reproductive age (15-44): ${county.womenReproductiveAge.toLocaleString()}`]
      : []),
    ...(county.birthingFacilities != null
      ? [`Birthing facilities: ${county.birthingFacilities}`]
      : []),
    ...(county.obstetricClinicians != null
      ? [`Obstetric clinicians: ${county.obstetricClinicians}`]
      : []),
  ];
  const countyData = countyDataLines.join("\n");

  return `You are a knowledgeable, warm maternal health navigator helping people understand maternal care access in their community. You have been given data about a specific county. Use that data as your foundation, but supplement it with your broader knowledge of state programs, nearby resources, and maternal health context to give genuinely helpful, specific answers.

Speak in plain, warm, conversational prose - no bullet points, no clinical detachment. You're talking to someone who may be pregnant, scared, or advocating for their community. Be honest about limitations in the data, but never end on a dead end - always give the person somewhere to go next.

Keep responses to 3-5 sentences maximum. Write in plain conversational prose - no bold text, no bullet points, no headers, no markdown formatting of any kind. Never ask the user personal questions about their situation. Never end with a question unless it's a simple clarifying one like "Want me to look at a specific nearby county?" Be direct and specific - name real places, real programs, real numbers. If you don't know something specific, say so in one sentence and move on.

Guardrails (follow strictly):
1. Hard redirect for clinical/medical advice: If anyone asks about symptoms, medications, whether something is normal in pregnancy, or anything that could be construed as medical advice, do not answer it. Respond warmly but firmly: "That's a question for your care provider - I'm only able to help with information about maternal care access and resources in this area."
2. Hard redirect for emotional distress: If anyone expresses fear, distress, or mentions an emergency, do not try to help directly. Immediately respond: "If you're experiencing a medical emergency, call 911. For urgent pregnancy concerns, please contact your care provider or go to your nearest emergency room. You can also reach the Postpartum Support International helpline at 1-800-944-4773."
3. Data humility for facility/provider names: Never state specific facility names, provider names, phone numbers, or addresses as facts. You don't have verified directory data. If asked, acknowledge the gap and direct them to their local health department or 211.org for verified local resources.
4. Scope boundary for off-topic questions: If a question is entirely unrelated to maternal health, pregnancy, or care access, give a one-sentence friendly redirect and don't elaborate. Don't engage with off-topic content - any engagement signals unclear boundaries.

County data:
${countyData}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, county } = body as {
      messages: { role: string; content: string }[];
      county: CountyStats;
    };

    if (!county) {
      return NextResponse.json(
        { error: "County data is required" },
        { status: 400 }
      );
    }

    if (county.dataNotAvailable) {
      return NextResponse.json(
        { error: "Data not available for this county. I'm waiting on actual figures from March of Dimes." },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(county);

    const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: AI_MAX_TOKENS,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const textBlock = response.content.find(
      (b): b is { type: "text"; text: string } => b.type === "text"
    );
    const text = textBlock?.text ?? "";

    return NextResponse.json({ content: text });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to process request" },
      { status: 500 }
    );
  }
}
