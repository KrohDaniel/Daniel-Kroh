module.exports = function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=3600");
  res.setHeader("Access-Control-Allow-Origin", "*");

  return res.status(200).json({
    turnstileSiteKey: (process.env.TURNSTILE_SITE_KEY || "").trim(),
  });
};
