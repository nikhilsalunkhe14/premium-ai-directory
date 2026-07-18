import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminSessionCookieValid } from "@/lib/admin-auth";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function slugify(text: string) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!isAdminSessionCookieValid(request.headers.get("cookie") || undefined)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: false, message: "Server not configured." }, { status: 500 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ success: false, message: "Missing tool identifier." }, { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const normalizedId = slugify(id);
  const isNumericId = /^\d+$/.test(id);

  const fetchCondition = isNumericId
    ? `slug.eq.${normalizedId},id.eq.${id}`
    : `slug.eq.${normalizedId}`;

  const { data: existingTool, error: fetchError } = await supabase
    .from("tools")
    .select("id, slug, name, tool_url")
    .or(fetchCondition)
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error("[admin/tools:id] fetch existing tool error:", fetchError);
    return NextResponse.json({ success: false, message: "Unable to locate tool." }, { status: 500 });
  }

  const deleteConditions = [];
  if (existingTool?.slug) deleteConditions.push(`slug.eq.${existingTool.slug}`);
  if (isNumericId) deleteConditions.push(`id.eq.${id}`);
  if (deleteConditions.length === 0) deleteConditions.push(`slug.eq.${normalizedId}`);

  const { data: deletedTools, error: deleteError } = await supabase
    .from("tools")
    .delete()
    .or(deleteConditions.join(","))
    .limit(1);

  if (deleteError) {
    console.error("[admin/tools:id] delete error:", deleteError);
    return NextResponse.json({ success: false, message: "Unable to remove tool." }, { status: 500 });
  }

  const submissionErrors: any[] = [];
  if (isNumericId) {
    const { error } = await supabase
      .from("tool_submissions")
      .update({ approved: false })
      .eq("approved", true)
      .eq("id", id);
    if (error) submissionErrors.push(error);
  }

  if (existingTool?.tool_url) {
    const { error } = await supabase
      .from("tool_submissions")
      .update({ approved: false })
      .eq("approved", true)
      .eq("website", existingTool.tool_url);
    if (error) submissionErrors.push(error);
  }

  if (existingTool?.name) {
    const escapedName = existingTool.name.replace(/%/g, "\\%").replace(/_/g, "\\_");
    const { error } = await supabase
      .from("tool_submissions")
      .update({ approved: false })
      .eq("approved", true)
      .ilike("name", `%${escapedName}%`);
    if (error) submissionErrors.push(error);
  }

  if (submissionErrors.length > 0) {
    console.error("[admin/tools:id] submission update errors:", submissionErrors);
  }

  return NextResponse.json({ success: true, data: deletedTools });
}
