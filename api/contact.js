const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");

  const { name, email, phone, interesse, message, turnstileToken, website, _honey } = req.body;

  // Honeypot check — silently reject bot submissions
  if (website || _honey) {
    return res.status(200).json({ success: true });
  }

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, E-Mail und Nachricht sind Pflichtfelder." });
  }

  // Cloudflare Turnstile verification
  if (!turnstileToken) {
    return res.status(400).json({ error: "Bot-Schutz fehlt. Bitte Seite neu laden." });
  }

  try {
    const ip = req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || "";
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: (process.env.TURNSTILE_SECRET_KEY || "").trim(),
        response: turnstileToken,
        remoteip: typeof ip === "string" ? ip.split(",")[0].trim() : "",
      }).toString(),
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return res.status(403).json({ error: "Bot-Verifizierung fehlgeschlagen. Bitte erneut versuchen." });
    }
  } catch (err) {
    console.error("Turnstile verify error:", err);
    return res.status(500).json({ error: "Bot-Verifizierung nicht erreichbar." });
  }

  // Format interesse (array of checked values)
  const interesseList = Array.isArray(interesse)
    ? interesse.join(", ")
    : interesse || "Keine Angabe";

  // SMTP transporter — configure via Vercel Environment Variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Format interesse as styled list items
  const interesseTags = Array.isArray(interesse)
    ? interesse.map((i) => `<span style="display:inline-block;background:#0a0e1a;color:#5de0c0;padding:6px 14px;border-radius:20px;font-size:13px;margin:3px 4px 3px 0;">${i}</span>`).join("")
    : `<span style="display:inline-block;background:#f0f0f0;color:#666;padding:6px 14px;border-radius:20px;font-size:13px;">Keine Angabe</span>`;

  // Email to you (notification)
  const mailToMe = {
    from: `"Website Kontaktformular" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL || "info@kroh-daniel.de",
    replyTo: email,
    subject: `Neue Anfrage von ${name} — kroh-daniel.de`,
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr><td style="background:#0a0e1a;padding:32px 40px;">
          <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600;">Neue Kontaktanfrage</h1>
          <p style="margin:8px 0 0;color:#5de0c0;font-size:14px;">kroh-daniel.de/kontakt</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px 40px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f0f0f3;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;width:110px;">Name</td>
              <td style="padding:12px 0;border-bottom:1px solid #f0f0f3;color:#1a1a2e;font-size:15px;font-weight:600;">${name}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f0f0f3;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">E-Mail</td>
              <td style="padding:12px 0;border-bottom:1px solid #f0f0f3;color:#1a1a2e;font-size:15px;"><a href="mailto:${email}" style="color:#2563eb;text-decoration:none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f0f0f3;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Telefon</td>
              <td style="padding:12px 0;border-bottom:1px solid #f0f0f3;color:#1a1a2e;font-size:15px;">${phone || "—"}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #f0f0f3;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Interesse</td>
              <td style="padding:12px 0;border-bottom:1px solid #f0f0f3;">${interesseTags}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:#999;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;vertical-align:top;">Nachricht</td>
              <td style="padding:12px 0;color:#1a1a2e;font-size:15px;line-height:1.6;">${message.replace(/\n/g, "<br>")}</td>
            </tr>
          </table>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f8f8fa;padding:20px 40px;text-align:center;">
          <p style="margin:0;color:#999;font-size:12px;">Direkt antworten — Reply-To ist auf ${email} gesetzt.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>
    `,
  };

  // Confirmation email to the customer
  const mailToCustomer = {
    from: `"Daniel Kroh" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Ihre Anfrage bei Daniel Kroh — Eingangsbestätigung",
    html: `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f7;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr><td style="background:#0a0e1a;padding:40px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;letter-spacing:-0.3px;">Daniel Kroh</h1>
          <p style="margin:6px 0 0;color:#5de0c0;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Webdesign &middot; SEO &middot; K.I. Automatisierung</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:40px;">
          <h2 style="margin:0 0 8px;color:#0a0e1a;font-size:20px;font-weight:600;">Vielen Dank, ${name}!</h2>
          <p style="margin:0 0 28px;color:#555;font-size:15px;line-height:1.7;">Ich habe Ihre Anfrage erhalten und melde mich innerhalb von <strong>24 Stunden</strong> bei Ihnen.</p>

          <!-- Interesse Tags -->
          <div style="background:#f8f8fa;border-radius:8px;padding:20px 24px;margin-bottom:24px;">
            <p style="margin:0 0 10px;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Interesse an</p>
            ${interesseTags}
          </div>

          <!-- Nachricht -->
          <div style="background:#f8f8fa;border-radius:8px;padding:20px 24px;">
            <p style="margin:0 0 10px;color:#999;font-size:11px;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Ihre Nachricht</p>
            <p style="margin:0;color:#1a1a2e;font-size:14px;line-height:1.7;">${message.replace(/\n/g, "<br>")}</p>
          </div>
        </td></tr>
        <!-- CTA -->
        <tr><td style="padding:0 40px 36px;" align="center">
          <a href="https://kroh-daniel.de" style="display:inline-block;background:#0a0e1a;color:#5de0c0;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">Website besuchen</a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#0a0e1a;padding:28px 40px;text-align:center;">
          <p style="margin:0 0 4px;color:#ffffff;font-size:14px;font-weight:500;">Daniel Kroh</p>
          <p style="margin:0;color:#888;font-size:13px;">
            <a href="mailto:info@kroh-daniel.de" style="color:#5de0c0;text-decoration:none;">info@kroh-daniel.de</a> &nbsp;&middot;&nbsp; 0176 410 45 997
          </p>
          <p style="margin:12px 0 0;color:#555;font-size:12px;">
            <a href="https://kroh-daniel.de" style="color:#666;text-decoration:none;">kroh-daniel.de</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>
    `,
  };

  try {
    await transporter.sendMail(mailToMe);
    await transporter.sendMail(mailToCustomer);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: "E-Mail konnte nicht gesendet werden." });
  }
};
