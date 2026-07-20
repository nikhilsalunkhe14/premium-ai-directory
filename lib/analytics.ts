import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type AnalyticsEventPayload = {
  eventType: "visit" | "tool_view" | "blog_view" | "search" | "outbound_click";
  toolId?: string | null;
  slug?: string | null;
  path?: string | null;
  referrer?: string | null;
  country?: string | null;
  device?: string | null;
  metadata?: Record<string, unknown>;
  createdAt?: string;
};

export async function trackAnalyticsEvent(payload: AnalyticsEventPayload) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return;

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    await supabase.from("analytics_events").insert([
      {
        event_type: payload.eventType,
        tool_id: payload.toolId || null,
        slug: payload.slug || null,
        path: payload.path || null,
        referrer: payload.referrer || null,
        country: payload.country || null,
        device: payload.device || null,
        metadata: payload.metadata || {},
        created_at: payload.createdAt || new Date().toISOString(),
      },
    ]);
  } catch (error) {
    console.error("[analytics] tracking failed", error);
  }
}
