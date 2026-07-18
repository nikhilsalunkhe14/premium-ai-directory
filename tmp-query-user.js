const fs = require('fs');
const path = require('path');
const env = fs.readFileSync(path.resolve('.env.local'), 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .reduce((acc, line) => {
    const [k, ...v] = line.split('=');
    acc[k] = v.join('=');
    return acc;
  }, {});
const { createClient } = require('@supabase/supabase-js');
const url = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const anon = env.SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anon) {
  console.error('Missing anon key');
  process.exit(1);
}
const client = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
(async () => {
  const q = await client.from('tool_submissions').select('*').eq('approved', true).limit(20);
  console.log('anon query tool_submissions', q.error, q.data?.length);
  console.log(q.data);
  const t = await client.from('tools').select('*').limit(20);
  console.log('anon query tools', t.error, t.data?.length);
  console.log(t.data);
})();