import { NextResponse } from "next/server";

/**
 * "Bring City App to your city" — the petition form on the landing page.
 *
 * TODO: persist. Nothing is stored yet — wire this to a `city_waitlist` table
 * in Supabase (or push to Brevo) before the campaign goes live, otherwise
 * submissions are only visible in the server logs.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { name, email, city, message, locale } = (body ?? {}) as {
    name?: string;
    email?: string;
    city?: string;
    message?: string;
    locale?: string;
  };

  const validEmail = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  const validCity = typeof city === "string" && city.trim().length > 1 && city.length < 120;
  const validName = typeof name === "string" && name.trim().length > 1 && name.length < 120;

  if (!validEmail || !validCity || !validName) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  console.info("[waitlist] signup", {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    city: city.trim(),
    message: typeof message === "string" ? message.trim().slice(0, 2000) : "",
    locale: locale === "es" ? "es" : "en",
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
