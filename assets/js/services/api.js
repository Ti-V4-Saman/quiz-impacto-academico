export async function postJson(url, payload, options = {}) {
  if (!url) return { ok: false, skipped: true };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: options.keepalive ?? true
  });

  const body = await safeJson(response);
  return { ok: response.ok, status: response.status, body };
}

async function safeJson(response) {
  const text = await response.text().catch(() => '');
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}
