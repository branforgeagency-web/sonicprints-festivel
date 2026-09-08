import https from 'https';

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

function money(n) {
  return '₹' + Number(n || 0).toLocaleString('en-IN');
}

/**
 * Low-level Brevo API dispatcher
 */
export async function sendEmail({ to, subject, htmlContent, replyTo }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('[mailer] BREVO_API_KEY not configured — skipping email dispatch');
    return null;
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'branforgeagency@gmail.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'Sonic Prints';

  const payload = JSON.stringify({
    sender: { name: senderName, email: senderEmail },
    to: Array.isArray(to) ? to : [{ email: to }],
    subject,
    htmlContent,
    replyTo: replyTo ? { email: replyTo } : { email: process.env.SITE_EMAIL || 'hello@sonicprints.in' }
  });

  return new Promise((resolve) => {
    const req = https.request(BREVO_ENDPOINT, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`[mailer] Email sent successfully to ${JSON.stringify(to)}:`, data.trim());
          try { resolve(JSON.parse(data)); } catch { resolve(data); }
        } else {
          console.error(`[mailer] Brevo email dispatch error (${res.statusCode}):`, data);
          resolve(null);
        }
      });
    });

    req.on('error', (err) => {
      console.error('[mailer] Network error while sending email:', err.message);
      resolve(null);
    });

    req.write(payload);
    req.end();
  });
}

/**
 * Sends order notification email to hello@sonicprints.in
 * and confirmation email to the customer if email provided.
 */
export async function sendOrderNotification(order, cfg = {}) {
  try {
    const orderRef = order.orderId || order._id;
    const storeEmail = process.env.ORDER_NOTIFICATION_EMAIL || process.env.SITE_EMAIL || cfg.email || 'hello@sonicprints.in';
    const storePhone = cfg.whatsapp || process.env.SITE_WHATSAPP || '+91 63850 54514';
    const cleanPhone = String(order.customer.phone || '').replace(/[^0-9]/g, '');

    // 1. Admin Notification Email
    const adminSubject = `🛒 New Order: #${orderRef} — ${money(order.total)} by ${order.customer.name}`;
    
    const itemsRows = order.items.map(it => {
      const bits = [it.variantName, it.designName].filter(Boolean).join(' · ');
      return `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #EAEAEA; font-weight: 600; color: #1B2E2B;">
            ${it.name}
            ${bits ? `<div style="font-size: 12px; color: #7A8B88; font-weight: 400; margin-top: 2px;">${bits}</div>` : ''}
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #EAEAEA; text-align: center; color: #333;">${it.qty}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #EAEAEA; text-align: right; color: #333;">${money(it.unitPrice)}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #EAEAEA; text-align: right; font-weight: 700; color: #0A2E2B;">${money(it.lineTotal)}</td>
        </tr>
      `;
    }).join('');

    const adminHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
        <!-- Header -->
        <div style="background: #0A2E2B; padding: 24px; text-align: center; border-bottom: 3px solid #D4AF37;">
          <h1 style="color: #F8E8C6; margin: 0; font-size: 22px; letter-spacing: 0.5px;">SONIC PRINTS</h1>
          <p style="color: #EFD199; margin: 6px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Ganesh Festival Collection 2026</p>
        </div>

        <!-- Banner -->
        <div style="background: #FDF9F0; padding: 16px 24px; border-bottom: 1px solid #F0E4D0; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 12px; color: #8A6D3B; text-transform: uppercase; font-weight: 700;">Order Reference</span>
            <div style="font-size: 20px; font-weight: 800; color: #0A2E2B; font-family: monospace;">#${orderRef}</div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 12px; color: #8A6D3B; text-transform: uppercase; font-weight: 700;">Payment Mode</span>
            <div style="font-size: 14px; font-weight: 700; color: ${order.paymentMethod === 'online' ? '#1E7E34' : '#B8860B'};">
              ${order.paymentMethod === 'online' ? 'Online Payment' : 'WhatsApp Order'} (${order.paymentStatus})
            </div>
          </div>
        </div>

        <div style="padding: 24px;">
          <!-- Customer Details -->
          <h3 style="color: #0A2E2B; font-size: 15px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #0A2E2B; padding-bottom: 6px;">Customer & Delivery Details</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #666; width: 130px;">Customer Name:</td><td style="padding: 6px 0; font-weight: 700; color: #111;">${order.customer.name}</td></tr>
            <tr>
              <td style="padding: 6px 0; color: #666;">Mobile Number:</td>
              <td style="padding: 6px 0; font-weight: 700; color: #0A2E2B;">
                <a href="tel:${order.customer.phone}" style="color: #0A2E2B; text-decoration: none;">${order.customer.phone}</a>
                <span style="margin: 0 8px; color: #CCC;">|</span>
                <a href="https://wa.me/${cleanPhone}" target="_blank" style="color: #25D366; font-weight: 700; text-decoration: none;">💬 WhatsApp Chat</a>
              </td>
            </tr>
            ${order.customer.email ? `<tr><td style="padding: 6px 0; color: #666;">Email:</td><td style="padding: 6px 0; color: #111;"><a href="mailto:${order.customer.email}" style="color: #0066CC;">${order.customer.email}</a></td></tr>` : ''}
            ${order.customer.city ? `<tr><td style="padding: 6px 0; color: #666;">City / Pincode:</td><td style="padding: 6px 0; font-weight: 600; color: #111;">${order.customer.city}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; color: #666; vertical-align: top;">Delivery Address:</td><td style="padding: 6px 0; font-weight: 600; color: #111; line-height: 1.4;">${order.customer.address}</td></tr>
            ${order.customer.mapUrl ? `<tr><td style="padding: 6px 0; color: #666;">GPS Map:</td><td style="padding: 6px 0;"><a href="${order.customer.mapUrl}" target="_blank" style="color: #D4AF37; font-weight: 700;">📍 Open in Google Maps</a></td></tr>` : ''}
            <tr><td style="padding: 6px 0; color: #666;">Buyer Category:</td><td style="padding: 6px 0; color: #555;">${order.customer.buyerType || 'Household'}</td></tr>
            ${order.note ? `<tr><td style="padding: 6px 0; color: #666; vertical-align: top;">Customer Note:</td><td style="padding: 6px 0; color: #C0392B; font-style: italic;">"${order.note}"</td></tr>` : ''}
          </table>

          <!-- Items Table -->
          <h3 style="color: #0A2E2B; font-size: 15px; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #0A2E2B; padding-bottom: 6px;">Ordered Items</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13.5px;">
            <thead>
              <tr style="background: #F4F6F6;">
                <th style="padding: 10px 14px; text-align: left; color: #0A2E2B;">Item</th>
                <th style="padding: 10px 14px; text-align: center; color: #0A2E2B; width: 50px;">Qty</th>
                <th style="padding: 10px 14px; text-align: right; color: #0A2E2B; width: 85px;">Price</th>
                <th style="padding: 10px 14px; text-align: right; color: #0A2E2B; width: 95px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 10px 14px 4px; text-align: right; color: #666;">Subtotal:</td>
                <td style="padding: 10px 14px 4px; text-align: right; font-weight: 600; color: #333;">${money(order.subtotal)}</td>
              </tr>
              <tr>
                <td colspan="3" style="padding: 4px 14px; text-align: right; color: #666;">Shipping:</td>
                <td style="padding: 4px 14px; text-align: right; font-weight: 600; color: #1E7E34;">${order.shipping ? money(order.shipping) : 'FREE'}</td>
              </tr>
              <tr style="font-size: 17px; background: #FFF8EC;">
                <td colspan="3" style="padding: 12px 14px; text-align: right; font-weight: 800; color: #0A2E2B;">Grand Total:</td>
                <td style="padding: 12px 14px; text-align: right; font-weight: 800; color: #8C651F;">${money(order.total)}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Actions -->
          <div style="text-align: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid #EAEAEA;">
            <a href="https://wa.me/${cleanPhone}?text=Namaste%20${encodeURIComponent(order.customer.name)},%20we%20received%20your%20Sonic%20Prints%20Ganesh%20order%20%23${orderRef}!%20Confirming%20your%20delivery%20details." target="_blank" style="display: inline-block; background: #25D366; color: #FFFFFF; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin: 4px;">
              💬 WhatsApp Customer
            </a>
            <a href="tel:${order.customer.phone}" style="display: inline-block; background: #0A2E2B; color: #FFFFFF; font-weight: 700; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin: 4px;">
              📞 Call Customer
            </a>
          </div>
        </div>

        <div style="background: #F8F9F9; padding: 14px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #EAEAEA;">
          Sonic Prints India Pvt Ltd · Automated Store Notification · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
        </div>
      </div>
    `;

    // Send to admin email (hello@sonicprints.in)
    await sendEmail({
      to: storeEmail,
      subject: adminSubject,
      htmlContent: adminHtml,
      replyTo: order.customer.email || undefined
    });

    // 2. Customer Confirmation Email (if customer provided their email)
    if (order.customer.email && order.customer.email.includes('@')) {
      const customerSubject = `Order Confirmation #${orderRef} — Sonic Prints Ganesh Festival Collection`;
      const customerHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
          <div style="background: #0A2E2B; padding: 26px 20px; text-align: center; border-bottom: 3px solid #D4AF37;">
            <h1 style="color: #F8E8C6; margin: 0; font-size: 24px;">Sonic Prints</h1>
            <p style="color: #EFD199; margin: 6px 0 0; font-size: 13px; letter-spacing: 0.5px;">Eco-Friendly Ganesh Festival Collection 2026</p>
          </div>

          <div style="padding: 24px 20px;">
            <p style="font-size: 16px; color: #1B2E2B; margin-top: 0;">Namaste <strong>${order.customer.name}</strong>,</p>
            <p style="color: #4A5B58; line-height: 1.6;">
              Thank you for ordering with Sonic Prints! Your order <strong>#${orderRef}</strong> has been received successfully through our website.
            </p>

            <div style="background: #FFF8EC; border: 1.5px solid #D4AF37; border-radius: 8px; padding: 14px 18px; margin: 18px 0; text-align: center;">
              <span style="font-size: 12px; text-transform: uppercase; color: #8A6D3B; font-weight: 700;">Your Order Reference</span>
              <div style="font-size: 22px; font-weight: 800; color: #0A2E2B; font-family: monospace; letter-spacing: 1px;">#${orderRef}</div>
              <div style="font-size: 14px; font-weight: 700; color: #B8860B; margin-top: 4px;">Grand Total: ${money(order.total)}</div>
            </div>

            <h3 style="color: #0A2E2B; font-size: 14px; text-transform: uppercase; border-bottom: 1.5px solid #0A2E2B; padding-bottom: 4px; margin-top: 24px;">Items in Your Order</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; margin-bottom: 16px;">
              ${itemsRows}
            </table>

            <p style="font-size: 13.5px; color: #555; background: #F8F9F9; padding: 12px 16px; border-radius: 6px; line-height: 1.5;">
              <strong>Delivery Address:</strong><br/>
              ${order.customer.address}${order.customer.city ? `, ${order.customer.city}` : ''}
            </p>

            <p style="color: #4A5B58; font-size: 14px; line-height: 1.6; margin-top: 20px;">
              Our delivery team is preparing your package. If you have any questions, feel free to WhatsApp us directly at <strong>${storePhone}</strong> or email us at <strong>${storeEmail}</strong>.
            </p>

            <p style="text-align: center; margin: 28px 0 10px; font-size: 20px; font-weight: 800; color: #8C651F; font-family: Georgia, serif;">
              Ganpati Bappa Morya! 🙏
            </p>
          </div>

          <div style="background: #0A2E2B; color: #DCEBE8; padding: 16px; text-align: center; font-size: 12px;">
            Sonic Prints · Coimbatore, Tamil Nadu · <a href="mailto:${storeEmail}" style="color: #EFD199;">${storeEmail}</a> · ${storePhone}
          </div>
        </div>
      `;

      await sendEmail({
        to: order.customer.email,
        subject: customerSubject,
        htmlContent: customerHtml,
        replyTo: storeEmail
      });
    }
  } catch (err) {
    console.error('[mailer] Error in sendOrderNotification:', err.message);
  }
}

/**
 * Sends bulk / corporate enquiry notification to hello@sonicprints.in
 */
export async function sendEnquiryNotification(enquiry, cfg = {}) {
  try {
    const storeEmail = process.env.ORDER_NOTIFICATION_EMAIL || process.env.SITE_EMAIL || cfg.email || 'hello@sonicprints.in';
    const cleanPhone = String(enquiry.phone || '').replace(/[^0-9]/g, '');
    const subject = `📋 New Bulk / Corporate Enquiry: ${enquiry.name} (${enquiry.organisation || enquiry.segment})`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden;">
        <div style="background: #0A2E2B; padding: 20px; text-align: center; border-bottom: 3px solid #D4AF37;">
          <h2 style="color: #F8E8C6; margin: 0; font-size: 20px;">SONIC PRINTS — BULK ENQUIRY</h2>
          <p style="color: #EFD199; margin: 4px 0 0; font-size: 12px;">Ganesh Festival Corporate / Institutional Lead</p>
        </div>

        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #666; width: 140px;">Segment:</td><td style="padding: 6px 0; font-weight: 700; color: #0A2E2B;">${enquiry.segment}</td></tr>
            ${enquiry.organisation ? `<tr><td style="padding: 6px 0; color: #666;">Organisation:</td><td style="padding: 6px 0; font-weight: 700; color: #111;">${enquiry.organisation}</td></tr>` : ''}
            <tr><td style="padding: 6px 0; color: #666;">Contact Person:</td><td style="padding: 6px 0; font-weight: 700; color: #111;">${enquiry.name}</td></tr>
            <tr>
              <td style="padding: 6px 0; color: #666;">Phone:</td>
              <td style="padding: 6px 0; font-weight: 700;">
                <a href="tel:${enquiry.phone}" style="color: #0A2E2B;">${enquiry.phone}</a>
                <span style="margin: 0 8px; color: #CCC;">|</span>
                <a href="https://wa.me/${cleanPhone}" target="_blank" style="color: #25D366;">💬 WhatsApp</a>
              </td>
            </tr>
            ${enquiry.email ? `<tr><td style="padding: 6px 0; color: #666;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${enquiry.email}">${enquiry.email}</a></td></tr>` : ''}
            ${enquiry.city ? `<tr><td style="padding: 6px 0; color: #666;">City:</td><td style="padding: 6px 0;">${enquiry.city}</td></tr>` : ''}
            ${enquiry.kitsInterested?.length ? `<tr><td style="padding: 6px 0; color: #666;">Kits Interested:</td><td style="padding: 6px 0; font-weight: 600; color: #0A2E2B;">${enquiry.kitsInterested.join(', ')}</td></tr>` : ''}
            ${enquiry.approxQty ? `<tr><td style="padding: 6px 0; color: #666;">Approx Quantity:</td><td style="padding: 6px 0; font-weight: 700; color: #B8860B;">${enquiry.approxQty}</td></tr>` : ''}
            ${enquiry.neededBy ? `<tr><td style="padding: 6px 0; color: #666;">Needed By Date:</td><td style="padding: 6px 0;">${enquiry.neededBy}</td></tr>` : ''}
            ${enquiry.brandingRequired ? `<tr><td style="padding: 6px 0; color: #666;">Custom Branding:</td><td style="padding: 6px 0; font-weight: 600;">${enquiry.brandingRequired}</td></tr>` : ''}
            ${enquiry.note ? `<tr><td style="padding: 6px 0; color: #666; vertical-align: top;">Requirement Note:</td><td style="padding: 6px 0; color: #333; font-style: italic;">"${enquiry.note}"</td></tr>` : ''}
          </table>

          <div style="text-align: center; margin-top: 24px; padding-top: 18px; border-top: 1px solid #EAEAEA;">
            <a href="https://wa.me/${cleanPhone}?text=Namaste%20${encodeURIComponent(enquiry.name)},%20thank%20you%20for%20your%20bulk%20enquiry%20with%20Sonic%20Prints!" target="_blank" style="display: inline-block; background: #25D366; color: #FFFFFF; font-weight: 700; text-decoration: none; padding: 10px 20px; border-radius: 6px; margin: 4px;">
              💬 Reply via WhatsApp
            </a>
          </div>
        </div>
      </div>
    `;

    await sendEmail({
      to: storeEmail,
      subject,
      htmlContent: html,
      replyTo: enquiry.email || undefined
    });
  } catch (err) {
    console.error('[mailer] Error in sendEnquiryNotification:', err.message);
  }
}
