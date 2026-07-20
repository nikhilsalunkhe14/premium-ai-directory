import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminSessionCookieValid } from "@/lib/admin-auth";
import { sendSubmissionStatusEmail } from "@/lib/notifications";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function slugify(text: string) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function mapSubmissionToToolRow(submission: Record<string, any>) {
  const name = String(submission.name ?? "Untitled");
  const slug = slugify(name) || `tool-${submission.id}`;
  const website = String(
    submission.website ??
      submission.url ??
      submission.href ??
      submission.link ??
      submission.source ??
      ""
  ).trim();

  return {
    slug,
    name,
    category: String(submission.category ?? "Other"),
    description: String(submission.description ?? ""),
    pricing_type: String(submission.pricing ?? "Free"),
    tool_url: website || "https://example.com",
    tags: Array.isArray(submission.tags) ? submission.tags : [],
    affiliate_url: submission.affiliate_url ? String(submission.affiliate_url) : null,
  };
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;

  if (!isAdminSessionCookieValid(request.headers.get("cookie") || undefined)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: false, message: "Server not configured." }, { status: 500 });
  }

  const id = params?.id;
  if (!id) return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body.approved !== "boolean") {
    return NextResponse.json({ success: false, message: "Invalid body" }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: submission, error: fetchError } = await supabase
    .from("tool_submissions")
    .select("*")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (fetchError || !submission) {
    console.error("[admin/submissions:id] fetch error:", fetchError);
    return NextResponse.json({ success: false, message: "Unable to find submission." }, { status: 500 });
  }

  const updatePayload = { approved: body.approved };
  const { data, error } = await supabase
    .from("tool_submissions")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[admin/submissions:id] update error:", error);
    return NextResponse.json({ success: false, message: "Unable to update submission." }, { status: 500 });
  }

  if (body.approved) {
    try {
      const toolRow = mapSubmissionToToolRow(submission);
      await supabase.from("tools").upsert(toolRow, { onConflict: "slug" });
    } catch (publishError) {
      console.error("[admin/submissions:id] publish error:", publishError);
    }
  } else {
    try {
      const toolRow = mapSubmissionToToolRow(submission);
      await supabase.from("tools").delete().eq("slug", toolRow.slug);
    } catch (deleteError) {
      console.error("[admin/submissions:id] delete published tool error:", deleteError);
    }
  }

  if (submission.email) {
    try {
      await sendSubmissionStatusEmail(submission.email, submission.name, body.approved);
    } catch (emailError) {
      console.error("[admin/submissions:id] email error:", emailError);
    }
  }

  return NextResponse.json({ success: true, data });
}
