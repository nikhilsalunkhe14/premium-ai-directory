const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync(path.resolve('.env.local'), 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .reduce((acc, line) => {
    const [k, ...v] = line.split('=');
    acc[k] = v.join('=');
    return acc;
  }, {});
const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
(async () => {
  try {
    const { data, error } = await supabase
      .from('columns')
      .schema('information_schema')
      .select('table_schema,table_name,column_name,data_type,is_nullable')
      .in('table_name', ['tools', 'tool_submissions'])
      .order('table_name', { ascending: true })
      .order('ordinal_position', { ascending: true });
    console.log(JSON.stringify({ error, data }, null, 2));
  } catch (err) {
    console.error(err);
  }
})();