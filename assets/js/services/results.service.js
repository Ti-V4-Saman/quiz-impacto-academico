import { CONFIG } from '../config.js';
import { ANSWER_KEYS, TRACKING_KEYS } from '../constants.js';
<<<<<<< HEAD
import { markBasicContactCaptured, nextEventVersion, nextPartialSeq, state } from '../state.js';
=======
<<<<<<< HEAD
import { markBasicContactCaptured, nextEventVersion, nextPartialSeq, state } from '../state.js';
=======
<<<<<<< HEAD
import { nextEventVersion, nextPartialSeq, state } from '../state.js';
=======
import { state } from '../state.js';
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
import { getPhoneCountryConfig, normalizePhone } from '../utils/phone.js';
import { getFullUrl, hydrateFacebookBrowserIds } from '../utils/utms.js';
import { postJson } from './api.js';

<<<<<<< HEAD
let basicContactPromise = null;

=======
<<<<<<< HEAD
let basicContactPromise = null;

=======
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
export function buildPayload(finalStatus = 'partial', extra = {}) {
  hydrateFacebookBrowserIds();

  const now = new Date().toISOString();
  state.updatedAt = now;

  const answerMap = buildAnswers();
  const tracking = buildTracking();
  const fullUrl = getFullUrl();
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  const processingMode = extra.processingMode || (finalStatus === 'partial' ? 'partial' : 'calendar_final');
  const isCompleted = processingMode === 'calendar_final';
  const partialSeq = processingMode === 'partial'
    ? (extra.partialSeq ?? nextPartialSeq())
    : null;
  const eventVersion = extra.eventVersion ?? nextEventVersion();
  const eventName = extra.eventName || finalStatus;
  const eventId = extra.eventId || buildEventId({
    processingMode,
    finalStatus,
    eventVersion,
    partialSeq,
  });
  const variables = buildVariables(answerMap, tracking, fullUrl);
  const queryParams = buildWebhookQueryParams(finalStatus, isCompleted);
  const destination = isCompleted ? 'google_calendar' : '';

  return {
<<<<<<< HEAD
=======
=======
  const isCompleted = finalStatus !== 'partial';
<<<<<<< HEAD
  const partialSeq = isCompleted ? null : (extra.partialSeq ?? nextPartialSeq());
  const eventVersion = extra.eventVersion ?? nextEventVersion();
  const eventName = extra.eventName || finalStatus;
  const eventId = isCompleted
    ? `${state.resultId}:final:${finalStatus}`
    : `${state.resultId}:partial:${partialSeq}`;
=======
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
  const variables = buildVariables(answerMap, tracking, fullUrl);
  const queryParams = buildWebhookQueryParams(finalStatus, isCompleted);

  return {
<<<<<<< HEAD
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
    eventId,
    eventVersion,
    resultId: state.resultId,
    sessionId: state.sessionId,
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
    processingMode,
    destination,
    hasBasicContactEvent: processingMode === 'basic_contact',
    isCompleted,
    eventName,
    finalStatus,
<<<<<<< HEAD
=======
=======
    isCompleted,
    eventName,
    finalStatus,
=======
    resultId: state.resultId,
    sessionId: state.sessionId,
    isCompleted,
    eventName: extra.eventName || finalStatus,
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
    createdAt: state.createdAt,
    updatedAt: now,
    typebot: {
      id: CONFIG.TYPEBOT_ID,
      name: CONFIG.BOT_NAME,
<<<<<<< HEAD
      source: CONFIG.ORIGEM,
=======
<<<<<<< HEAD
      source: CONFIG.ORIGEM,
=======
      source: CONFIG.ORIGEM
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
    },
    answers: buildTypebotAnswers(answerMap),
    variables,
    answerMap,
    tracking,
    queryParams,
    metadata: {
      source: CONFIG.ORIGEM,
      finalStatus,
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
      processingMode,
      destination,
      pageUrl: fullUrl,
      full_url: fullUrl,
      userAgent: navigator.userAgent,
      generatedAt: now,
    },
    partialSeq,
<<<<<<< HEAD
=======
=======
      pageUrl: fullUrl,
      full_url: fullUrl,
      userAgent: navigator.userAgent,
      generatedAt: now
    },
<<<<<<< HEAD
    partialSeq
=======
    partialSeq: extra.partialSeq || null
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  };
}

export async function sendFinalResults(finalStatus) {
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  if (!state.finalPayload || state.finalPayload.finalStatus !== finalStatus) {
    state.finalPayload = buildPayload(finalStatus, {
      eventName: finalStatus,
      processingMode: 'calendar_final',
    });
<<<<<<< HEAD
=======
=======
<<<<<<< HEAD
  if (!state.finalPayload || state.finalPayload.finalStatus !== finalStatus) {
    state.finalPayload = buildPayload(finalStatus, { eventName: finalStatus });
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  }

  const payload = state.finalPayload;

  if (!CONFIG.ENABLE_WEBHOOKS || !CONFIG.WEBHOOKS.FINAL_RESULTS_URL) {
    return { ok: true, skipped: true, reason: 'webhooks_disabled', payload };
  }

  const url = buildUrlWithQuery(CONFIG.WEBHOOKS.FINAL_RESULTS_URL, payload.queryParams);
  return postJson(url, payload, { idempotencyKey: payload.eventId });
}

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
export async function sendBasicContactResults() {
  const answerMap = buildAnswers();
  const fingerprint = buildBasicContactFingerprint(answerMap);

  if (!answerMap.nome || !answerMap.telefone || !answerMap.email) {
    return { ok: true, skipped: true, reason: 'basic_contact_incomplete' };
  }

  if (state.basicContactFingerprint === fingerprint) {
    return { ok: true, skipped: true, reason: 'basic_contact_already_sent' };
  }

  if (basicContactPromise) return basicContactPromise;

  const payload = buildPayload('partial', {
    eventName: 'basic_contact_captured',
    processingMode: 'basic_contact',
    eventId: `${state.resultId}:basic-contact:${hashFingerprint(fingerprint)}`,
  });

  if (!CONFIG.ENABLE_WEBHOOKS || !CONFIG.WEBHOOKS.PARTIAL_RESULTS_URL) {
    markBasicContactCaptured(fingerprint);
    return { ok: true, skipped: true, reason: 'webhooks_disabled', payload };
  }

  const url = buildUrlWithQuery(CONFIG.WEBHOOKS.PARTIAL_RESULTS_URL, payload.queryParams);

  basicContactPromise = postJson(url, payload, {
    idempotencyKey: payload.eventId,
    maxRetries: 2,
    keepalive: true,
  })
    .then((result) => {
      markBasicContactCaptured(fingerprint);
      return result;
    })
    .finally(() => {
      basicContactPromise = null;
    });

  return basicContactPromise;
}

<<<<<<< HEAD
=======
=======
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
export async function sendPartialResults(eventName = 'partial') {
  if (state.isSubmitting || state.isCompleted) {
    return { ok: true, skipped: true, reason: 'quiz_finalizing' };
  }

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  const payload = buildPayload('partial', {
    eventName,
    processingMode: 'partial',
  });
<<<<<<< HEAD
=======
=======
  const payload = buildPayload('partial', { eventName });
=======
  const payload = buildPayload(finalStatus, { eventName: finalStatus });
  if (!CONFIG.ENABLE_WEBHOOKS || !CONFIG.WEBHOOKS.FINAL_RESULTS_URL) {
    return { ok: true, skipped: true, reason: 'webhooks_disabled', payload };
  }
  const url = buildUrlWithQuery(CONFIG.WEBHOOKS.FINAL_RESULTS_URL, payload.queryParams);
  return postJson(url, payload);
}

export async function sendPartialResults(eventName = 'partial') {
  const payload = buildPayload('partial', {
    eventName,
    partialSeq: ++state.partialSeq
  });
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2

  if (!CONFIG.ENABLE_WEBHOOKS || !CONFIG.WEBHOOKS.PARTIAL_RESULTS_URL) {
    return { ok: true, skipped: true, reason: 'webhooks_disabled', payload };
  }

  const url = buildUrlWithQuery(CONFIG.WEBHOOKS.PARTIAL_RESULTS_URL, payload.queryParams);
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  return postJson(url, payload, {
    idempotencyKey: payload.eventId,
    maxRetries: 1,
    keepalive: false,
  });
}

function buildEventId({ processingMode, finalStatus, eventVersion, partialSeq }) {
  if (processingMode === 'calendar_final') {
    return `${state.resultId}:final:${finalStatus}`;
  }

  if (processingMode === 'basic_contact') {
    return `${state.resultId}:basic-contact:${eventVersion}`;
  }

  return `${state.resultId}:partial:${partialSeq ?? eventVersion}`;
<<<<<<< HEAD
=======
=======
<<<<<<< HEAD
  return postJson(url, payload, {
    idempotencyKey: payload.eventId,
    maxRetries: 1,
    keepalive: false
  });
=======
  return postJson(url, payload);
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
}

function buildAnswers() {
  const country = state.answers.telefone_pais || 'BR';
  const phoneConfig = getPhoneCountryConfig(country);

  return ANSWER_KEYS.reduce((acc, key) => {
    if (key === 'telefone') {
      acc[key] = normalizePhone(state.answers.telefone, country);
      return acc;
    }

    if (key === 'telefone_pais') {
      acc[key] = phoneConfig.code;
      return acc;
    }

    if (key === 'telefone_ddi') {
      acc[key] = phoneConfig.ddi;
      return acc;
    }

    acc[key] = state.answers[key] || '';
    return acc;
  }, {});
}

function buildTracking() {
  return TRACKING_KEYS.reduce((acc, key) => {
    acc[key] = state.tracking[key] || '';
    return acc;
  }, {});
}

function buildTypebotAnswers(answerMap) {
  return ANSWER_KEYS.map((key) => ({
    field: key,
    type: inferAnswerType(key),
<<<<<<< HEAD
    answer: answerMap[key] || '',
=======
<<<<<<< HEAD
    answer: answerMap[key] || '',
=======
    answer: answerMap[key] || ''
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  }));
}

function buildVariables(answerMap, tracking, fullUrl) {
  const answerVars = ANSWER_KEYS.map((key) => ({ name: key, value: answerMap[key] || '' }));
  const trackingVars = TRACKING_KEYS.map((key) => ({ name: key, value: tracking[key] || '' }));

  return [
    ...answerVars,
    ...trackingVars,
<<<<<<< HEAD
    { name: 'full_url', value: fullUrl },
=======
<<<<<<< HEAD
    { name: 'full_url', value: fullUrl },
=======
    { name: 'full_url', value: fullUrl }
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  ];
}

function buildWebhookQueryParams(finalStatus, isCompleted) {
  if (!isCompleted) return {};
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2

  return {
    'free-consultation': 'free-consultation',
    final_status: finalStatus,
  };
}

function buildUrlWithQuery(url, queryParams = {}) {
  const parsed = new URL(url, window.location.href);

  Object.entries(queryParams)
    .filter(([, value]) => value !== '' && value != null)
    .forEach(([key, value]) => parsed.searchParams.set(key, String(value)));

  return parsed.toString();
}

function buildBasicContactFingerprint(answerMap) {
  return [answerMap.nome, answerMap.telefone, answerMap.email]
    .map((value) => String(value || '').trim().toLocaleLowerCase('pt-BR'))
    .join('|');
}

function hashFingerprint(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16);
<<<<<<< HEAD
=======
=======
  return { 'free-consultation': 'free-consultation', final_status: finalStatus };
}

function buildUrlWithQuery(url, queryParams = {}) {
<<<<<<< HEAD
  const parsed = new URL(url, window.location.href);
  Object.entries(queryParams)
    .filter(([, value]) => value !== '' && value != null)
    .forEach(([key, value]) => parsed.searchParams.set(key, String(value)));
  return parsed.toString();
=======
  const entries = Object.entries(queryParams).filter(([, value]) => value !== '' && value != null);
  if (!entries.length) return url;
  const qs = new URLSearchParams(entries).toString();
  return `${url}?${qs}`;
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
}

function inferAnswerType(key) {
  if (key === 'email') return 'email';
  if (key === 'telefone') return 'phone';
  return 'text';
}
