const { createClient } = require("@supabase/supabase-js");

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;
if (!url || !key) {
  throw new Error("Set SUPABASE_URL and SUPABASE_KEY in your environment before running this script.");
}

const client = createClient(url, key);

async function findRealSchema() {
  // Test 1: Just name
  console.log("Test 1: Just name");
  let result = await client.from("tools").insert([{
    name: "Test 1",
  }]).select();
  
  if (result.data) {
    console.log("✓ Success");
    const row = result.data[0];
    console.log("  Returned columns:", Object.keys(row).sort());
    console.log("  Full row:", JSON.stringify(row, null, 2));
    await client.from("tools").delete().eq("id", row.id);
  } else {
    console.log("❌ " + result.error.message);
  }

  // Test 2: With more fields one by one
  console.log("\nTest 2: name + description");
  result = await client.from("tools").insert([{
    name: "Test 2",
    description: "A test tool",
  }]).select();
  
  if (result.data) {
    console.log("✓ Success");
    const row = result.data[0];
    console.log("  Returned columns:", Object.keys(row).sort());
    await client.from("tools").delete().eq("id", row.id);
  } else {
    console.log("❌ " + result.error.message);
  }

  // Test 3: Try slug
  console.log("\nTest 3: name + slug");
  result = await client.from("tools").insert([{
    name: "Test 3",
    slug: "test-3",
  }]).select();
  
  if (result.data) {
    console.log("✓ Success");
    const row = result.data[0];
    console.log("  Returned columns:", Object.keys(row).sort());
    await client.from("tools").delete().eq("id", row.id);
  } else {
    console.log("❌ " + result.error.message);
  }
}

findRealSchema().catch(console.error);
