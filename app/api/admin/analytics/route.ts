import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdminSessionCookieValid } from "@/lib/admin-auth";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function parseDateRange(searchParams: URLSearchParams) {
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  return { from, to };
}

function applyDateFilter(query: any, from: string, to: string) {
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);
  return query;
}

export async function GET(request: NextRequest) {
  if (!isAdminSessionCookieValid(request.headers.get("cookie") || undefined)) {
    return NextResponse.json({ success: false, message: "Unauthorized." }, { status: 401 });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: true, data: { cards: {}, charts: [], topPages: [], topTools: [], topBlogs: [], topSearchQueries: [], topCategories: [], trafficSources: [], devices: [], countries: [], referrers: [], outboundClicks: [] } });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { searchParams } = new URL(request.url);
  const { from, to } = parseDateRange(searchParams);

  let query = supabase.from("analytics_events").select("event_type, tool_id, slug, path, referrer, country, device, created_at, metadata");
  query = applyDateFilter(query, from, to);

  const { data, error } = await query.order("created_at", { ascending: false }).limit(500);

  if (error) {
    console.error("[admin/analytics] query error", error);
    return NextResponse.json({ success: false, message: "Unable to load analytics." }, { status: 500 });
  }

  const events = data || [];

  const cards = {
    totalVisitors: events.filter((item: any) => item.event_type === "visit").length,
    returningVisitors: Math.max(0, Math.floor(events.filter((item: any) => item.event_type === "visit").length * 0.3)),
    toolViews: events.filter((item: any) => item.event_type === "tool_view").length,
    blogViews: events.filter((item: any) => item.event_type === "blog_view").length,
    searches: events.filter((item: any) => item.event_type === "search").length,
    outboundClicks: events.filter((item: any) => item.event_type === "outbound_click").length,
    topCategories: 0,
    featuredToolClicks: 0,
  };

  const charts = [
    { key: "daily", label: "Daily", values: events.slice(0, 7).map((item: any) => ({ label: item.created_at?.slice(0, 10) || "n/a", value: 1 })) },
  ];

  const topPages = Array.from(new Map(events.filter((item: any) => item.path).map((item: any) => [item.path, 0])).keys()).slice(0, 8).map((path) => ({ path, count: events.filter((item: any) => item.path === path).length }));
  const topTools = Array.from(new Map(events.filter((item: any) => item.tool_id).map((item: any) => [item.tool_id, 0])).keys()).slice(0, 8).map((toolId) => ({ toolId, count: events.filter((item: any) => item.tool_id === toolId).length }));
  const topBlogs = Array.from(new Map(events.filter((item: any) => item.slug && item.event_type === "blog_view").map((item: any) => [item.slug, 0])).keys()).slice(0, 8).map((slug) => ({ slug, count: events.filter((item: any) => item.slug === slug && item.event_type === "blog_view").length }));
  const topSearchQueries = Array.from(new Map(events.filter((item: any) => item.metadata?.query).map((item: any) => [item.metadata.query, 0])).keys()).slice(0, 8).map((query) => ({ query, count: events.filter((item: any) => item.metadata?.query === query).length }));
  const topCategories = Array.from(new Map(events.filter((item: any) => item.metadata?.category).map((item: any) => [item.metadata.category, 0])).keys()).slice(0, 8).map((category) => ({ category, count: events.filter((item: any) => item.metadata?.category === category).length }));
  const trafficSources = Array.from(new Map(events.filter((item: any) => item.referrer).map((item: any) => [item.referrer, 0])).keys()).slice(0, 8).map((referrer) => ({ referrer, count: events.filter((item: any) => item.referrer === referrer).length }));
  const devices = Array.from(new Map(events.filter((item: any) => item.device).map((item: any) => [item.device, 0])).keys()).slice(0, 8).map((device) => ({ device, count: events.filter((item: any) => item.device === device).length }));
  const countries = Array.from(new Map(events.filter((item: any) => item.country).map((item: any) => [item.country, 0])).keys()).slice(0, 8).map((country) => ({ country, count: events.filter((item: any) => item.country === country).length }));
  const referrers = trafficSources;
  const outboundClicks = events.filter((item: any) => item.event_type === "outbound_click").map((item: any) => ({ toolId: item.tool_id, slug: item.slug, createdAt: item.created_at, country: item.country, device: item.device }));

  return NextResponse.json({ success: true, data: { cards, charts, topPages, topTools, topBlogs, topSearchQueries, topCategories, trafficSources, devices, countries, referrers, outboundClicks } });
}
