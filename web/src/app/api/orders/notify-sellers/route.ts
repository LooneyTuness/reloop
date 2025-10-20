import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { 
      sellerEmail, 
      items, 
      orderId, 
      buyerName, 
      totalAmount,
      language = "mk"
    }: {
      sellerEmail: string;
      items: Array<{ name: string; quantity: number; price: number }>;
      orderId: number | string;
      buyerName: string;
      totalAmount: number;
      language?: string;
    } = await req.json();

    if (!sellerEmail || !Array.isArray(items) || !buyerName) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Email content based on language
    const isMacedonian = language === "mk";
    
    const subject = isMacedonian 
      ? `Нова нарачка #${orderId} - vtoraraka`
      : `New Order #${orderId} - vtoraraka`;

    const itemsList = items
      .map((i) => 
        isMacedonian 
          ? `• ${i.name} x${i.quantity} – ${i.price.toLocaleString()} MKD`
          : `• ${i.name} x${i.quantity} – ${i.price.toLocaleString()} MKD`
      )
      .join("<br/>");

    const html = `
      <div style="font-family: system-ui, Segoe UI, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">vtoraraka</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Circular fashion for sustainability</p>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #0ea5e9;">
          <h2 style="color: #111827; margin: 0 0 15px 0;">
            ${isMacedonian ? '🎉 Нова нарачка!' : '🎉 New Order!'}
          </h2>
          <p style="color: #374151; margin: 0 0 10px 0;">
            ${isMacedonian ? 'Здраво,' : 'Hello,'}
          </p>
          <p style="color: #374151; margin: 0;">
            ${isMacedonian 
              ? `Имате нова нарачка од ${buyerName}. Ве молиме проверете ги деталите подолу и контактирајте го купувачот за испорака.`
              : `You have a new order from ${buyerName}. Please review the details below and contact the buyer for shipping.`
            }
          </p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #111827; margin: 0 0 15px 0;">
            ${isMacedonian ? 'Детали за нарачката' : 'Order Details'}
          </h3>
          <p style="margin: 0 0 10px 0;"><strong>${isMacedonian ? 'Нарачка #' : 'Order #'}: ${orderId}</strong></p>
          <p style="margin: 0 0 10px 0;"><strong>${isMacedonian ? 'Купувач' : 'Buyer'}: ${buyerName}</strong></p>
          <p style="margin: 0 0 15px 0;">${itemsList}</p>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 10px;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #111827;">
              ${isMacedonian ? 'Вкупно' : 'Total'}: ${totalAmount.toLocaleString()} MKD
            </p>
          </div>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
          <h4 style="color: #92400e; margin: 0 0 10px 0;">
            ${isMacedonian ? '⚠️ Важно' : '⚠️ Important'}
          </h4>
          <ul style="color: #92400e; margin: 0; padding-left: 20px;">
            <li>${isMacedonian ? 'Контактирајте го купувачот во рок од 24 часа' : 'Contact the buyer within 24 hours'}</li>
            <li>${isMacedonian ? 'Договорете детали за испорака и плаќање' : 'Arrange shipping and payment details'}</li>
            <li>${isMacedonian ? 'Плаќањето се врши при доставка' : 'Payment is made upon delivery'}</li>
            <li>${isMacedonian ? 'За прашања, одете во вашиот продавачки панел' : 'For questions, go to your seller dashboard'}</li>
          </ul>
        </div>

        <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="color: #059669; margin: 0 0 10px 0;">
            ${isMacedonian ? 'Следни чекори' : 'Next Steps'}
          </h4>
          <ol style="color: #374151; margin: 0; padding-left: 20px;">
            <li>${isMacedonian ? 'Проверете ги деталите за нарачката' : 'Review the order details'}</li>
            <li>${isMacedonian ? 'Контактирајте го купувачот за испорака' : 'Contact the buyer for shipping'}</li>
            <li>${isMacedonian ? 'Договорете време и место за доставка' : 'Arrange delivery time and location'}</li>
            <li>${isMacedonian ? 'Одете во вашиот панел за да ја означите нарачката како завршена' : 'Go to your dashboard to mark the order as completed'}</li>
          </ol>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            ${isMacedonian ? 'За дополнителни прашања, посетете го вашиот продавачки панел.' : 'For additional questions, visit your seller dashboard.'}
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
            © 2024 vtoraraka. ${isMacedonian ? 'Сите права се задржани.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        to: sellerEmail,
        subject,
        html,
      });
      return NextResponse.json({ ok: true });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Unknown error';
      console.warn('Email send failed (seller) - non-blocking:', message);
      return NextResponse.json({ ok: true, warning: message });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Soft-fail: do not block order creation if email config is missing
    console.warn('notify-sellers payload/processing error - non-blocking:', message);
    return NextResponse.json({ ok: true, warning: message });
  }
}
