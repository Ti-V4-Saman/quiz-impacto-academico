import { CONFIG } from '../config.js';
import { ANSWER_KEYS, TRACKING_KEYS } from '../constants.js';
import { nextEventVersion, nextPartialSeq, state } from '../state.js';
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
  const partialSeq = isCompleted ? null : (extra.partialSeq ?? nextPartialSeq());
  const eventVersion = extra.eventVersion ?? nextEventVersion();
  const eventName = extra.eventName || finalStatus;
  const eventId = isCompleted
    ? `${state.resultId}:final:${finalStatus}`
    : `${state.resultId}:partial:${partialSeq}`;
  const variables = buildVariables(answerMap, tracking, fullUrl);
  const queryParams = buildWebhookQueryParams(finalStatus, isCompleted);

  return {
    eventId,
    eventVersion,
    resultId: state.resultId,
    sessionId: state.sessionId,
    isCompleted,
    eventName,
    finalStatus,
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
    partialSeq
  };
}

export async function sendFinalResults(finalStatus) {
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

  if (!CONFIG.ENABLE_WEBHOOKS || !CONFIG.WEBHOOKS.PARTIAL_RESULTS_URL) {
    return { ok: true, skipped: true, reason: 'webhooks_disabled', payload };
  }

  const url = buildUrlWithQuery(CONFIG.WEBHOOKS.PARTIAL_RESULTS_URL, payload.queryParams);
  return postJson(url, payload, {
    idempotencyKey: payload.eventId,
    maxRetries: 1,
    keepalive: false
  });
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
  const parsed = new URL(url, window.location.href);
  Object.entries(queryParams)
    .filter(([, value]) => value !== '' && value != null)
    .forEach(([key, value]) => parsed.searchParams.set(key, String(value)));
  return parsed.toString();
}

function inferAnswerType(key) {
  if (key === 'email') return 'email';
  if (key === 'telefone') return 'phone';
  return 'text';
}
