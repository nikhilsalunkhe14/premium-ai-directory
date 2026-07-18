const { createClient } = require("@supabase/supabase-js");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;
if (!url || !key) {
  throw new Error("Set SUPABASE_URL and SUPABASE_KEY in your environment before running this script.");
}

const client = createClient(url, key);

async function getExactSchema() {
  // Test with required fields only
  console.log("Inserting with required fields: name, slug, category, description, pricing_type, tool_url");
  const result = await client.from("tools").insert([{
    name: "Test Tool",
    slug: "test-tool",
    category: "Testing",
    description: "A test tool",
    pricing_type: "Free",
    tool_url: "https://example.com",
  }]).select();
  
  if (result.data && result.data[0]) {
    const row = result.data[0];
    console.log("\n✓ SUCCESS! Actual tools table columns and types:");
    console.log(JSON.stringify(row, null, 2));
    
    console.log("\n✓ Columns (sorted):");
    console.log(Object.keys(row).sort().join(", "));
    
    // Cleanup
    await client.from("tools").delete().eq("id", row.id);
  } else {
    console.log("❌ Error:", result.error.message);
  }
}

getExactSchema().catch(console.error);
