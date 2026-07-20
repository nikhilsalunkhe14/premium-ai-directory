import { NextResponse, type NextRequest } from "next/server";
import { isAdminSessionCookieValid } from "@/lib/admin-auth";
import { getAdminSupabase, getAdminStorageBucket } from "@/lib/admin-utils";

export async function POST(request: NextRequest) {
  if (!isAdminSessionCookieValid(request.headers.get("cookie") || undefined)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ success: false, message: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ success: false, message: "No file provided." }, { status: 400 });
  }

  if (file.size > 5_242_880) {
    return NextResponse.json({ success: false, message: "File is too large (max 5MB)." }, { status: 400 });
  }

  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!validTypes.includes(file.type)) {
    return NextResponse.json({ success: false, message: "Invalid file type. Use JPEG, PNG, GIF, or WebP." }, { status: 400 });
  }

  try {
    const supabase = getAdminSupabase();
    const bucket = getAdminStorageBucket();
    const filename = `${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "-").toLowerCase()}`;
    const path = `admin-uploads/${filename}`;

    const bytes = await file.arrayBuffer();
    const { error, data } = await supabase.storage
      .from(bucket)
      .upload(path, new Uint8Array(bytes), {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("[admin/images] upload error:", error);
      return NextResponse.json(
        { success: false, message: "Unable to upload image." },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
    const url = urlData?.publicUrl || "";

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("[admin/images] error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to upload image. Try again." },
      { status: 500 }
    );
  }
}
