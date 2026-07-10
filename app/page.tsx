import { getSupabase } from "@/lib/supabase";
import { MOCKUP_TOOLS, type Tool } from "@/lib/mockup-tools";
import HomePageContent from "@/components/HomePageContent";

async function fetchTools(): Promise<Tool[]> {
  const db = getSupabase();

  if (!db) {
    return MOCKUP_TOOLS;
  }

  const { data, error } = await db
    .from("tools")
    .select("id, name, category, description, pricing, website");

  if (error || !data || data.length === 0) {
    return MOCKUP_TOOLS;
  }

  return data;
}

export default async function Home() {
  const tools = await fetchTools();

  return <HomePageContent tools={tools} />;
}
