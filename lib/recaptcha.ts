const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return true; // Skip verification when not configured
  }

  try {
    const res = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });

    const data = await res.json();
    return data.success === true && (data.score ?? 1) >= 0.5;
  } catch (err) {
    console.error("reCAPTCHA verification error:", err);
    return false;
  }
}
