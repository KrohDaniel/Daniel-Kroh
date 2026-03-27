const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");

  const { name, email, phone, interesse, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, E-Mail und Nachricht sind Pflichtfelder." });
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

  // Email to you (notification)
  const mailToMe = {
    from: `"Website Kontaktformular" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL || "info@kroh-daniel.de",
    replyTo: email,
    subject: `Neue Anfrage von ${name} — danielkroh.de`,
    html: `
      <h2>Neue Kontaktanfrage</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;">
        <tr><td style="padding:8px;font-weight:bold;">Name:</td><td style="padding:8px;">${name}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">E-Mail:</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Telefon:</td><td style="padding:8px;">${phone || "—"}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;">Interesse an:</td><td style="padding:8px;">${interesseList}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Nachricht:</td><td style="padding:8px;">${message.replace(/\n/g, "<br>")}</td></tr>
      </table>
    `,
  };

  // Confirmation email to the customer
  const mailToCustomer = {
    from: `"Daniel Kroh" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Ihre Anfrage bei Daniel Kroh — Eingangsbestätigung",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e;">
        <h2 style="color:#0a0a1a;">Vielen Dank für Ihre Anfrage, ${name}!</h2>
        <p>Ich habe Ihre Nachricht erhalten und melde mich innerhalb von 24 Stunden bei Ihnen.</p>
        <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;">
        <p style="font-size:14px;color:#666;"><strong>Ihre Angaben:</strong></p>
        <p style="font-size:14px;color:#666;">Interesse an: ${interesseList}</p>
        <p style="font-size:14px;color:#666;">Nachricht: ${message}</p>
        <hr style="border:none;border-top:1px solid #e0e0e0;margin:24px 0;">
        <p style="font-size:13px;color:#999;">Daniel Kroh — Webdesign, SEO & K.I. Automatisierung<br>info@kroh-daniel.de | 0176 410 45 997</p>
      </div>
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
