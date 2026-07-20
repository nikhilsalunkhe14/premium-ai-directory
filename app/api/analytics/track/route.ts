import { NextResponse } from "next/server";
import { trackAnalyticsEvent, type AnalyticsEventPayload } from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    if (!payload || typeof payload !== "object") {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const eventType = (payload as { eventType?: string }).eventType;
    const normalizedEventType: AnalyticsEventPayload["eventType"] =
      eventType === "search" || eventType === "visit" || eventType === "tool_view" || eventType === "blog_view" || eventType === "outbound_click"
        ? eventType
        : "visit";

    await trackAnalyticsEvent({
      eventType: normalizedEventType,
      toolId: (payload as any).toolId || null,
      slug: (payload as any).slug || null,
      path: (payload as any).path || null,
      referrer: (payload as any).referrer || null,
      country: (payload as any).country || null,
      device: (payload as any).device || null,
      metadata: (payload as any).metadata || {},
      createdAt: (payload as any).createdAt || new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[analytics/track] failed", error);
    return NextResponse.json({ success: false, message: "Tracking failed" }, { status: 500 });
  }
}
