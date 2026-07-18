export const dynamic = "force-dynamic";

import { MOCKUP_TOOLS, type Tool } from "@/lib/mockup-tools";
import { getPublicTools } from "@/lib/public-tools";
import HomePageContent from "@/components/HomePageContent";

async function fetchTools(): Promise<Tool[]> {
  const tools = await getPublicTools();
  return tools.length > 0 ? tools : MOCKUP_TOOLS;
}

export default async function Home() {
  const tools = await fetchTools();

  return <HomePageContent tools={tools} />;
}
