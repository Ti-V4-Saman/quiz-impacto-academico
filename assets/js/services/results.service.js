import { CONFIG } from '../config.js';
import { ANSWER_KEYS, TRACKING_KEYS } from '../constants.js';
<<<<<<< HEAD
import { nextEventVersion, nextPartialSeq, state } from '../state.js';
=======
import { state } from '../state.js';
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
import { getPhoneCountryConfig, normalizePhone } from '../utils/phone.js';
import { getFullUrl, hydrateFacebookBrowserIds } from '../utils/utms.js';
import { postJson } from './api.js';

export function buildPayload(finalStatus = 'partial', extra = {}) {
  hydrateFacebookBrowserIds();

  const now = new Date().toISOString();
  state.updatedAt = now;

  const answerMap = buildAnswers();
  const tracking = buildTracking();
  const fullUrl = getFullUrl();
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
    eventId,
    eventVersion,
    resultId: state.resultId,
    sessionId: state.sessionId,
    isCompleted,
    eventName,
    finalStatus,
=======
    resultId: state.resultId,
    sessionId: state.sessionId,
    isCompleted,
    eventName: extra.eventName || finalStatus,
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
    createdAt: state.createdAt,
    updatedAt: now,
    typebot: {
      id: CONFIG.TYPEBOT_ID,
      name: CONFIG.BOT_NAME,
      source: CONFIG.ORIGEM
    },
    answers: buildTypebotAnswers(answerMap),
    variables,
    answerMap,
    tracking,
    queryParams,
    metadata: {
      source: CONFIG.ORIGEM,
      finalStatus,
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
  };
}

export async function sendFinalResults(finalStatus) {
<<<<<<< HEAD
  if (!state.finalPayload || state.finalPayload.finalStatus !== finalStatus) {
    state.finalPayload = buildPayload(finalStatus, { eventName: finalStatus });
  }

  const payload = state.finalPayload;

  if (!CONFIG.ENABLE_WEBHOOKS || !CONFIG.WEBHOOKS.FINAL_RESULTS_URL) {
    return { ok: true, skipped: true, reason: 'webhooks_disabled', payload };
  }

  const url = buildUrlWithQuery(CONFIG.WEBHOOKS.FINAL_RESULTS_URL, payload.queryParams);
  return postJson(url, payload, { idempotencyKey: payload.eventId });
}

export async function sendPartialResults(eventName = 'partial') {
  if (state.isSubmitting || state.isCompleted) {
    return { ok: true, skipped: true, reason: 'quiz_finalizing' };
  }

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

  if (!CONFIG.ENABLE_WEBHOOKS || !CONFIG.WEBHOOKS.PARTIAL_RESULTS_URL) {
    return { ok: true, skipped: true, reason: 'webhooks_disabled', payload };
  }

  const url = buildUrlWithQuery(CONFIG.WEBHOOKS.PARTIAL_RESULTS_URL, payload.queryParams);
<<<<<<< HEAD
  return postJson(url, payload, {
    idempotencyKey: payload.eventId,
    maxRetries: 1,
    keepalive: false
  });
=======
  return postJson(url, payload);
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
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
    answer: answerMap[key] || ''
  }));
}

function buildVariables(answerMap, tracking, fullUrl) {
  const answerVars = ANSWER_KEYS.map((key) => ({ name: key, value: answerMap[key] || '' }));
  const trackingVars = TRACKING_KEYS.map((key) => ({ name: key, value: tracking[key] || '' }));

  return [
    ...answerVars,
    ...trackingVars,
    { name: 'full_url', value: fullUrl }
  ];
}

function buildWebhookQueryParams(finalStatus, isCompleted) {
  if (!isCompleted) return {};
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
}

function inferAnswerType(key) {
  if (key === 'email') return 'email';
  if (key === 'telefone') return 'phone';
  return 'text';
}
