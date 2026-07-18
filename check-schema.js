const { createClient } = require("@supabase/supabase-js");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;
if (!url || !key) {
  throw new Error("Set SUPABASE_URL and SUPABASE_KEY in your environment before running this script.");
}
const client = createClient(url, key);

const candidates = [
  "affiliate_url",
  "affiliateUrl",
  "website",
  "url",
  "link",
  "slug",
  "id",
  "name",
  "category",
  "description",
  "pricing",
  "featured",
  "sponsored",
  "created_at",
  "createdAt",
];

async function checkSchema() {
  console.log("=== Checking Tools Table ===");

  const toolsCheck = await client.from("tools").select("*").limit(1);
  if (toolsCheck.error) {
    console.log("ERROR:", toolsCheck.error.message);
  } else {
    console.log("✓ Tools table exists");
    console.log("  Data count:", toolsCheck.data?.length || 0);
  }

  console.log("\n=== Candidate Column Tests ===");
  for (const cols of [
    ["id", "name", "slug", "category", "description", "pricing", "website", "featured", "sponsored", "created_at"],
    ["id", "name", "category", "description", "pricing", "website", "created_at"],
    ["id", "name", "category", "description", "pricing", "url", "created_at"],
    ["id", "name", "category", "description", "pricing", "website", "affiliate_url", "created_at"],
    ["id", "name", "category", "description", "pricing", "website", "affiliateUrl", "created_at"],
  ]) {
    const columnList = cols.join(",");
    const result = await client.from("tools").select(columnList).limit(1);
    console.log(`- select(${columnList}) ->`, result.error ? result.error.message : "ok");
  }

  console.log("\n=== Testing Safe Insert ===");
  const testTool = {
    id: "test-tool-" + Date.now(),
    name: "Test Tool",
    category: "Testing",
    description: "Test description",
    pricing: "Free",
    website: "https://example.com",
    slug: "test-tool",
  };
  const insertResult = await client.from("tools").insert([testTool]);
  if (insertResult.error) {
    console.log("❌ Insert error:", insertResult.error.message);
  } else {
    console.log("✓ Insert succeeded");
    await client.from("tools").delete().eq("id", testTool.id);
  }
}

checkSchema().catch(console.error);
