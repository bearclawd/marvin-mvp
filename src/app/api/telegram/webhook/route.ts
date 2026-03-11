import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;

    if (!message?.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text.trim();
    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (!botToken) {
      console.error("TELEGRAM_BOT_TOKEN not set");
      return NextResponse.json({ ok: true });
    }

    let replyText = "";

    if (text === "/start") {
      replyText = `🤖 *Welcome to Marvin!*

I'm your AI CNC shop assistant by Imnoo AG.

*Available commands:*
/status — Shop overview & pipeline summary
/rfqs — List all open RFQs
/help — Show this message

Or just type any question about your shop, and I'll do my best to help!`;
    } else if (text === "/status" || text === "/help") {
      const db = getDb();
      const shop = db.getShop(1);

      if (!shop || !shop.onboarding_complete) {
        replyText = "No shop configured yet. Visit the web dashboard to complete onboarding.";
      } else if (text === "/help") {
        replyText = `🤖 *Marvin Commands*

/status — Shop overview & pipeline
/rfqs — Open RFQ list

Or ask me anything:
• "What's our margin this month?"
• "Any pending approvals?"
• "Summarize today's activity"`;
      } else {
        const rfqs = db.getRFQs(shop.id);

        const statusGroups: Record<string, { count: number; total: number }> = {};
        for (const r of rfqs) {
          if (!statusGroups[r.status]) statusGroups[r.status] = { count: 0, total: 0 };
          statusGroups[r.status].count++;
          statusGroups[r.status].total += r.total_value;
        }

        const pipeline = Object.entries(statusGroups)
          .map(([status, data]) => `• ${status}: ${data.count} (CHF ${Math.round(data.total).toLocaleString()})`)
          .join("\n");

        const totalValue = rfqs.reduce((s, r) => s + r.total_value, 0);

        replyText = `📊 *${shop.name} — Status*

*Pipeline:*
${pipeline}

*Total pipeline value:* CHF ${Math.round(totalValue).toLocaleString()}

Use /rfqs to see individual RFQs.`;
      }
    } else if (text === "/rfqs") {
      const db = getDb();
      const shop = db.getShop(1);

      if (!shop || !shop.onboarding_complete) {
        replyText = "No shop configured yet.";
      } else {
        const allRfqs = db.getRFQs(shop.id);
        const rfqs = allRfqs.filter(r => ["incoming", "new", "analysis", "quoted"].includes(r.status)).slice(0, 10);

        if (rfqs.length === 0) {
          replyText = "No open RFQs at the moment.";
        } else {
          const list = rfqs.map((r, i) =>
            `${i + 1}. *${r.title}*\n   ${r.customer_company} — CHF ${Number(r.total_value).toLocaleString()} — _${r.status}_`
          ).join("\n\n");

          replyText = `📋 *Open RFQs (${rfqs.length}):*\n\n${list}`;
        }
      }
    } else {
      // Free-text: provide a helpful response based on shop data
      const db = getDb();
      const shop = db.getShop(1);

      if (!shop || !shop.onboarding_complete) {
        replyText = "I'm Marvin, your CNC shop AI assistant. Complete onboarding on the web dashboard first, then I can help you here!";
      } else {
        const rfqs = db.getRFQs(shop.id);

        const totalValue = rfqs.reduce((s, r) => s + r.total_value, 0);
        const avgMargin = rfqs.length > 0 ? rfqs.reduce((s, r) => s + r.margin_pct, 0) / rfqs.length : 0;

        replyText = `Based on your current data at *${shop.name}*:

• ${rfqs.length} RFQs in pipeline (CHF ${Math.round(totalValue).toLocaleString()})
• Average margin: ${avgMargin.toFixed(1)}%
• Specializations: ${shop.specializations}

For detailed analysis, ask me specific questions or use /status for an overview!`;
      }
    }

    // Send reply via Telegram API
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: replyText,
        parse_mode: "Markdown",
      }),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ ok: true });
  }
}
