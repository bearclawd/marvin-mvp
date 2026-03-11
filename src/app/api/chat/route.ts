import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import getDb from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session.shopId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages } = await req.json();

    const db = getDb();
    const shop = db.getShop(session.shopId);
    const rfqs = db.getRFQs(session.shopId);
    const suppliers = db.getSuppliers(session.shopId);

    const systemPrompt = `You are Marvin, the AI assistant for ${shop?.name}, a CNC machining shop located at ${shop?.address}.

Shop Profile:
- Specializations: ${shop?.specializations}
- Materials: ${shop?.materials}
- Certifications: ${shop?.certifications}
- ERP System: ${shop?.erp_system}
- Weekly RFQs: ${shop?.weekly_rfqs}
- Turnaround: ${shop?.turnaround_days} days

Current RFQ Pipeline (${rfqs.length} total):
${rfqs.map((r) => `- ${r.title} (${r.customer_company}) — CHF ${Number(r.total_value).toLocaleString()} — Status: ${r.status} — Margin: ${r.margin_pct}%`).join("\n")}

Suppliers (${suppliers.length}):
${suppliers.map((s) => `- ${s.name} — ${s.category} — ${s.materials} — ${s.lead_time_days}d lead time`).join("\n")}

Guidelines:
- Be concise, professional, and data-driven
- Reference specific numbers from the shop's data
- Suggest actionable improvements
- Use CHF for currency
- When asked about margins, quotes, or pipeline, use the actual data above
- If asked to do something outside your knowledge, explain what you'd need
- Format responses with markdown when helpful`;

    const result = streamText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
