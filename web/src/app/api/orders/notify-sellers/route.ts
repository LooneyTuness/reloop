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
      orderId?: number | string;
      buyerName?: string;
      totalAmount?: number;
      language?: string;
    } = await req.json();
    
    if (!sellerEmail || !Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const isMacedonian = language === "mk";
    
    const subject = isMacedonian 
      ? `Нова нарачка #${orderId ?? ""} за вашиот производ`
      : `New order #${orderId ?? ""} for your product`;

    const itemsList = items
      .map((i) => 
        isMacedonian 
          ? `• ${i.name} x${i.quantity} – ${i.price.toLocaleString()} ден`
          : `• ${i.name} x${i.quantity} – ${i.price.toLocaleString()} MKD`
      )
      .join("<br/>");

    const totalText = totalAmount 
      ? `<p style="margin: 10px 0 0 0; font-size: 18px; font-weight: bold; color: #111827;">
          ${isMacedonian ? 'Вкупно: ' : 'Total: '}${totalAmount.toLocaleString()} ${isMacedonian ? 'ден' : 'MKD'}
        </p>`
      : '';

    const html = `
      <div style="font-family: system-ui, Segoe UI, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">vtoraraka</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">${isMacedonian ? 'Кружна мода за одржливост' : 'Circular fashion for sustainability'}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
          <h2 style="color: #92400e; margin: 0 0 15px 0;">
            ${isMacedonian ? '🎉 Имате нова нарачка!' : '🎉 You have a new order!'}
          </h2>
          <p style="color: #92400e; margin: 0;">
            ${isMacedonian 
              ? 'Честитки! Некој го купил вашиот производ.'
              : 'Congratulations! Someone bought your product.'
            }
          </p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #111827; margin: 0 0 15px 0;">
            ${isMacedonian ? 'Детали за нарачката' : 'Order Details'}
          </h3>
          <p style="margin: 0 0 10px 0;">
            <strong>${isMacedonian ? 'Нарачка #' : 'Order #'}: ${orderId ?? ""}</strong>
            ${buyerName ? `<br/>${isMacedonian ? 'Купувач: ' : 'Buyer: '}${buyerName}` : ''}
          </p>
          <div style="background: #f9fafb; padding: 15px; border-radius: 6px;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">${isMacedonian ? 'Нарачани ставки:' : 'Ordered items:'}</p>
            <p style="margin: 0;">${itemsList}</p>
            ${totalText}
          </div>
        </div>

        <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="color: #059669; margin: 0 0 10px 0;">
            ${isMacedonian ? 'Следни чекори' : 'Next Steps'}
          </h4>
          <ul style="color: #374151; margin: 0; padding-left: 20px;">
            <li>${isMacedonian 
              ? 'Најавете се во vtoraraka за да ги видите деталите за нарачката'
              : 'Sign in to vtoraraka to view order details'
            }</li>
            <li>${isMacedonian 
              ? 'Контактирајте го купувачот за детали за испораката'
              : 'Contact the buyer for shipping details'
            }</li>
            <li>${isMacedonian 
              ? 'Подгответе ја стоката за испорака'
              : 'Prepare the item for shipping'
            }</li>
            <li>${isMacedonian 
              ? 'Плаќањето ќе се изврши при преземање'
              : 'Payment will be made upon delivery'
            }</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            ${isMacedonian 
              ? 'За дополнителни прашања, посетете го нашиот веб-сајт.'
              : 'For additional questions, visit our website.'
            }
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
            © 2024 vtoraraka. ${isMacedonian ? 'Сите права се задржани.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: sellerEmail,
      subject,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


