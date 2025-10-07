import { NextRequest, NextResponse } from "next/server";

// Minimal Resend API client using fetch to avoid extra deps
async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Missing RESEND_API_KEY");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || "vtoraraka <noreply@vtoraraka.app>",
      to: [to],
      subject,
      html,
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend error: ${text}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sellerEmail, items, orderId }: {
      sellerEmail: string;
      items: Array<{ name: string; quantity: number; price: number }>;
      orderId?: number | string;
    } = await req.json();
    if (!sellerEmail || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const subject = `Нова нарачка #${orderId ?? ""} за вашиот производ`;
    const list = items
      .map((i) => `• ${i.name} x${i.quantity} – ${i.price} ден`)
      .join("<br/>");
    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial,sans-serif">
        <h2>Имате нова нарачка</h2>
        <p>Следниве ставки се нарачани:</p>
        <p>${list}</p>
        <p>Ве молиме најавете се во vtoraraka за детали и испорака.</p>
      </div>
    `;

    await sendEmail(sellerEmail, subject, html);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


