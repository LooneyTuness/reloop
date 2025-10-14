import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { 
      buyerEmail, 
      buyerName, 
      items, 
      orderId, 
      totalAmount, 
      shippingAddress,
      language = "mk"
    }: {
      buyerEmail: string;
      buyerName: string;
      items: Array<{ name: string; quantity: number; price: number }>;
      orderId: number | string;
      totalAmount: number;
      shippingAddress: {
        full_name: string;
        address_line1: string;
        address_line2?: string;
        city: string;
        postal_code: string;
        phone: string;
      };
      language?: string;
    } = await req.json();

    if (!buyerEmail || !Array.isArray(items) || !buyerName) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Email content based on language
    const isMacedonian = language === "mk";
    
    const subject = isMacedonian 
      ? `Потврда за нарачка #${orderId} - vtoraraka`
      : `Order Confirmation #${orderId} - vtoraraka`;

    const itemsList = items
      .map((i) => 
        isMacedonian 
          ? `• ${i.name} x${i.quantity} – ${i.price.toLocaleString()} MKD`
          : `• ${i.name} x${i.quantity} – ${i.price.toLocaleString()} MKD`
      )
      .join("<br/>");

    const addressText = `
      <p><strong>Shipping Address:</strong></p>
      <p>
        ${shippingAddress.full_name}<br/>
        ${shippingAddress.address_line1}<br/>
        ${shippingAddress.address_line2 ? shippingAddress.address_line2 + '<br/>' : ''}
        ${shippingAddress.postal_code} ${shippingAddress.city}<br/>
        Phone: ${shippingAddress.phone}
      </p>
    `;

    const html = `
      <div style="font-family: system-ui, Segoe UI, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">vtoraraka</h1>
          <p style="color: #6b7280; margin: 5px 0 0 0;">Circular fashion for sustainability</p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #111827; margin: 0 0 15px 0;">
            Thank you for your order!
          </h2>
          <p style="color: #374151; margin: 0 0 10px 0;">
            Hello ${buyerName},
          </p>
          <p style="color: #374151; margin: 0;">
            Your order has been successfully received and will be processed shortly.
          </p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3 style="color: #111827; margin: 0 0 15px 0;">
            Order Details
          </h3>
          <p style="margin: 0 0 10px 0;"><strong>Order #: ${orderId}</strong></p>
          <p style="margin: 0 0 15px 0;">${itemsList}</p>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 10px;">
            <p style="margin: 0; font-size: 18px; font-weight: bold; color: #111827;">
              Total: ${totalAmount.toLocaleString()} MKD
            </p>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          ${addressText}
        </div>

        <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="color: #059669; margin: 0 0 10px 0;">
            Next Steps
          </h4>
          <ul style="color: #374151; margin: 0; padding-left: 20px;">
            <li>The seller will contact you with shipping details</li>
            <li>Payment is made upon delivery</li>
            <li>For questions, contact the seller directly</li>
          </ul>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            For additional questions, visit our website or contact us.
          </p>
          <p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">
            © 2024 vtoraraka. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await sendEmail({
      to: buyerEmail,
      subject,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
