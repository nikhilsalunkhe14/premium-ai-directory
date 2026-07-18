const fetch = globalThis.fetch;
const BASE = 'http://localhost:3000';

async function submitTool() {
  const payload = {
    toolName: 'Test Flow Tool ' + Date.now(),
    website: 'https://example.com',
    category: 'Coding',
    pricing: 'Paid',
    description: 'This tool should appear after approval.',
    email: 'test@example.com',
    affiliateUrl: 'https://example.com/ref',
    honeypot: '',
  };

  const res = await fetch(`${BASE}/api/submit-tool`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  console.log('submit', res.status, body);
  return payload.toolName;
}

async function adminLogin() {
  const res = await fetch(`${BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: process.env.ADMIN_PASSWORD || 'Nikhil0914' }),
  });
  const body = await res.json();
  console.log('login', res.status, body);
  const cookie = res.headers.get('set-cookie');
  return cookie;
}

async function listSubmissions(cookie) {
  const res = await fetch(`${BASE}/api/admin/submissions`, {
    headers: { cookie },
  });
  const body = await res.json();
  console.log('submissions', res.status, body?.data?.length);
  return body.data;
}

async function approveSubmission(id, cookie) {
  const res = await fetch(`${BASE}/api/admin/submissions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', cookie },
    body: JSON.stringify({ approved: true }),
  });
  const body = await res.json();
  console.log('approve', res.status, body);
  return body;
}

async function checkHome(name) {
  const res = await fetch(`${BASE}/`);
  const text = await res.text();
  const found = text.includes(name);
  console.log('home status', res.status, 'contains', found);
  if (!found) {
    console.log('home snippet:', text.slice(0, 2000));
  }
  return found;
}

(async () => {
  try {
    const toolName = await submitTool();
    const cookie = await adminLogin();
    if (!cookie) {
      console.error('no cookie');
      process.exit(1);
    }
    const subs = await listSubmissions(cookie);
    const my = subs?.find((s) => s.name === toolName);
    console.log('found submission id', my?.id);
    if (!my) {
      console.error('submission not found');
      process.exit(1);
    }
    await approveSubmission(my.id, cookie);
    const visible = await checkHome(toolName);
    console.log('visible on home page?', visible);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();