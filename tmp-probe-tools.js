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
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing env vars');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function testSelect(cols) {
  const query = `id,name${cols ? ',' + cols : ''}`;
  const result = await supabase.from('tools').select(query).limit(1);
  console.log(query, result.error ? result.error.message : 'OK');
}

(async () => {
  const tests = [
    'category',
    'description',
    'pricing',
    'website',
    'url',
    'href',
    'link',
    'source',
    'affiliateUrl',
    'affiliate_url',
    'featured',
    'sponsored',
    'published_at',
    'created_at',
    'updated_at',
    'slug',
    'icon',
    'logo',
  ];

  for (const col of tests) {
    await testSelect(col);
  }
  process.exit(0);
})();
