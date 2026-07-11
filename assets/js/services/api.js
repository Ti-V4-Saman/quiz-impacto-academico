<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
import { CONFIG } from '../config.js';

const TRANSIENT_STATUS_CODES = new Set([408, 425, 429, 500, 502, 503, 504]);

export class HttpRequestError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'HttpRequestError';
    this.status = details.status || 0;
    this.body = details.body || {};
    this.cause = details.cause;
  }
}

export async function postJson(url, payload, options = {}) {
  if (!url) return { ok: false, skipped: true };

  const maxRetries = options.maxRetries ?? CONFIG.REQUEST.MAX_RETRIES;
  const timeoutMs = options.timeoutMs ?? CONFIG.REQUEST.TIMEOUT_MS;
  const retryBaseMs = options.retryBaseMs ?? CONFIG.REQUEST.RETRY_BASE_MS;

  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': options.idempotencyKey || payload.eventId || ''
        },
        body: JSON.stringify(payload),
        keepalive: options.keepalive ?? true,
        signal: controller.signal
      });

      const body = await safeJson(response);

      if (response.ok) {
        return { ok: true, status: response.status, body, attempts: attempt + 1 };
      }

      const error = new HttpRequestError(`Webhook retornou HTTP ${response.status}.`, {
        status: response.status,
        body
      });

      if (!TRANSIENT_STATUS_CODES.has(response.status) || attempt >= maxRetries) {
        throw error;
      }

      lastError = error;
    } catch (error) {
      const normalizedError = error instanceof HttpRequestError
        ? error
        : new HttpRequestError(
          error?.name === 'AbortError' ? 'Tempo limite excedido ao enviar o webhook.' : 'Falha de rede ao enviar o webhook.',
          { cause: error }
        );

      lastError = normalizedError;

      const isRetryableNetworkError = !normalizedError.status;
      if ((!isRetryableNetworkError && !TRANSIENT_STATUS_CODES.has(normalizedError.status)) || attempt >= maxRetries) {
        throw normalizedError;
      }
    } finally {
      window.clearTimeout(timeout);
    }

    await sleep(withJitter(retryBaseMs * (2 ** attempt)));
  }

  throw lastError || new HttpRequestError('Falha desconhecida ao enviar o webhook.');
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
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
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function withJitter(ms) {
  return Math.round(ms * (0.8 + Math.random() * 0.4));
}
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
=======
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
