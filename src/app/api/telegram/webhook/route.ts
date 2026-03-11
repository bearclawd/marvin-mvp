import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { seedDemoData } from "@/lib/seed";

export async function POST(req: Request) {
  try {
    seedDemoData();
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
      const shop = db.prepare("SELECT * FROM shops WHERE onboarding_complete = 1 LIMIT 1").get() as Record<string, unknown> | undefined;

      if (!shop) {
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
        const rfqCounts = db.prepare(
          "SELECT status, COUNT(*) as count, SUM(total_value) as total FROM rfqs WHERE shop_id = ? GROUP BY status"
        ).all(shop.id as number) as { status: string; count: number; total: number }[];

        const pipeline = rfqCounts.map((r) => `• ${r.status}: ${r.count} (CHF ${Math.round(r.total).toLocaleString()})`).join("\n");

        replyText = `📊 *${shop.name} — Status*

*Pipeline:*
${pipeline}

*Total pipeline value:* CHF ${Math.round(rfqCounts.reduce((s, r) => s + r.total, 0)).toLocaleString()}

Use /rfqs to see individual RFQs.`;
      }
    } else if (text === "/rfqs") {
      const db = getDb();
      const shop = db.prepare("SELECT * FROM shops WHERE onboarding_complete = 1 LIMIT 1").get() as Record<string, unknown> | undefined;

      if (!shop) {
        replyText = "No shop configured yet.";
      } else {
        const rfqs = db.prepare(
          "SELECT r.*, c.company as customer_company FROM rfqs r LEFT JOIN customers c ON r.customer_id = c.id WHERE r.shop_id = ? AND r.status IN ('incoming', 'analysis', 'quoted') ORDER BY r.created_at DESC LIMIT 10"
        ).all(shop.id as number) as Record<string, unknown>[];

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
      const shop = db.prepare("SELECT * FROM shops WHERE onboarding_complete = 1 LIMIT 1").get() as Record<string, unknown> | undefined;

      if (!shop) {
        replyText = "I'm Marvin, your CNC shop AI assistant. Complete onboarding on the web dashboard first, then I can help you here!";
      } else {
        const rfqs = db.prepare(
          "SELECT r.*, c.company as customer_company FROM rfqs r LEFT JOIN customers c ON r.customer_id = c.id WHERE r.shop_id = ?"
        ).all(shop.id as number) as Record<string, unknown>[];

        const totalValue = rfqs.reduce((s, r) => s + Number(r.total_value), 0);
        const avgMargin = rfqs.length > 0 ? rfqs.reduce((s, r) => s + Number(r.margin_pct), 0) / rfqs.length : 0;

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
