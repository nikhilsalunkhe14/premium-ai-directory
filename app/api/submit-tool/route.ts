import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const RECENT_SUBMISSIONS_KEY = "submission-rate-limit";

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for") || "";
  return forwarded.split(",")[0]?.trim() || "local";
}

function isSpamLike(text: string) {
  const lowered = text.toLowerCase();
  return /https?:\/\/|\.com|\.net|\.org/.test(lowered) && lowered.includes("buy") || lowered.includes("seo") || lowered.includes("casino");
}

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitize(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { success: false, message: "Expected JSON request body." },
      { status: 400 }
    );
  }

  const payload = await request.json().catch(() => null);

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const toolName = sanitize(payload.toolName);
  const website = sanitize(payload.website);
  const category = sanitize(payload.category);
  const pricing = sanitize(payload.pricing);
  const description = sanitize(payload.description);
  const email = sanitize(payload.email);
  const submitterName = sanitize(payload.submitterName);
  const tags = sanitize(payload.tags);
  const affiliateUrl = sanitize(payload.affiliateUrl);
  const honeypot = sanitize(payload.honeypot);

  if (honeypot) {
    return NextResponse.json({ success: true, message: "Submission received." });
  }

  if (!toolName || !website || !category || !pricing || !description) {
    return NextResponse.json(
      { success: false, message: "Missing required submission fields." },
      { status: 400 }
    );
  }

  if (!isValidUrl(website) || (affiliateUrl && !isValidUrl(affiliateUrl))) {
    return NextResponse.json(
      { success: false, message: "Please provide a valid URL." },
      { status: 400 }
    );
  }

  if (toolName.length > 100 || category.length > 50 || pricing.length > 20 || description.length > 1200 || submitterName.length > 80 || tags.length > 200) {
    return NextResponse.json(
      {
        success: false,
        message: "One or more fields exceed the allowed length.",
      },
      { status: 400 }
    );
  }

  if (email && email.length > 100) {
    return NextResponse.json(
      { success: false, message: "Email is too long." },
      { status: 400 }
    );
  }

  const ipAddress = getClientIp(request);
  const existingAttempts = Number((request as Request & { headers?: Headers }).headers.get("x-submission-attempts") || "0");
  void ipAddress;
  if (existingAttempts > 4 || isSpamLike(`${toolName} ${description} ${tags}`)) {
    return NextResponse.json({ success: false, message: "Your submission looks suspicious. Please try again later." }, { status: 429 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({
      success: true,
      message:
        "Your submission was received. Optional storage is currently disabled until the server is configured.",
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const enrichedDescription = [
    description,
    submitterName ? `Submitter: ${submitterName}` : null,
    tags ? `Tags: ${tags}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const { error } = await supabase.from("tool_submissions").insert([
    {
      name: toolName,
      website,
      category,
      pricing,
      description: enrichedDescription,
      email: email || null,
      affiliate_url: affiliateUrl || null,
    },
  ]);

  if (error) {
    console.error("[submit-tool] Supabase insert error:", error);

    const storageUnavailable =
      error.code === "PGRST205" ||
      error.message?.includes("Could not find the table") ||
      error.message?.includes("schema cache");

    if (storageUnavailable) {
      return NextResponse.json({
        success: true,
        message:
          "Your submission was received. Storage is disabled because the Supabase submissions table has not been configured.",
      });
    }

    return NextResponse.json(
      { success: false, message: "Unable to save submission at this time." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
