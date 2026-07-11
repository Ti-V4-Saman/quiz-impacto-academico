import { CONFIG } from '../config.js';
import { ANSWER_KEYS, TRACKING_KEYS } from '../constants.js';
import { markBasicContactCaptured, nextEventVersion, nextPartialSeq, state } from '../state.js';
import { getPhoneCountryConfig, normalizePhone } from '../utils/phone.js';
import { getFullUrl, hydrateFacebookBrowserIds } from '../utils/utms.js';
import { postJson } from './api.js';

let basicContactPromise = null;

export function buildPayload(finalStatus = 'partial', extra = {}) {
  hydrateFacebookBrowserIds();

  const now = new Date().toISOString();
  state.updatedAt = now;

  const answerMap = buildAnswers();
  const tracking = buildTracking();
  const fullUrl = getFullUrl();
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
    eventId,
    eventVersion,
    resultId: state.resultId,
    sessionId: state.sessionId,
    processingMode,
    destination,
    hasBasicContactEvent: processingMode === 'basic_contact',
    isCompleted,
    eventName,
    finalStatus,
    createdAt: state.createdAt,
    updatedAt: now,
    typebot: {
      id: CONFIG.TYPEBOT_ID,
      name: CONFIG.BOT_NAME,
      source: CONFIG.ORIGEM,
    },
    answers: buildTypebotAnswers(answerMap),
    variables,
    answerMap,
    tracking,
    queryParams,
    metadata: {
      source: CONFIG.ORIGEM,
      finalStatus,
      processingMode,
      destination,
      pageUrl: fullUrl,
      full_url: fullUrl,
      userAgent: navigator.userAgent,
      generatedAt: now,
    },
    partialSeq,
  };
}

export async function sendFinalResults(finalStatus) {
  if (!state.finalPayload || state.finalPayload.finalStatus !== finalStatus) {
    state.finalPayload = buildPayload(finalStatus, {
      eventName: finalStatus,
      processingMode: 'calendar_final',
    });
  }

  const payload = state.finalPayload;

  if (!CONFIG.ENABLE_WEBHOOKS || !CONFIG.WEBHOOKS.FINAL_RESULTS_URL) {
    return { ok: true, skipped: true, reason: 'webhooks_disabled', payload };
  }

  const url = buildUrlWithQuery(CONFIG.WEBHOOKS.FINAL_RESULTS_URL, payload.queryParams);
  return postJson(url, payload, { idempotencyKey: payload.eventId });
}

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

export async function sendPartialResults(eventName = 'partial') {
  if (state.isSubmitting || state.isCompleted) {
    return { ok: true, skipped: true, reason: 'quiz_finalizing' };
  }

  const payload = buildPayload('partial', {
    eventName,
    processingMode: 'partial',
  });

  if (!CONFIG.ENABLE_WEBHOOKS || !CONFIG.WEBHOOKS.PARTIAL_RESULTS_URL) {
    return { ok: true, skipped: true, reason: 'webhooks_disabled', payload };
  }

  const url = buildUrlWithQuery(CONFIG.WEBHOOKS.PARTIAL_RESULTS_URL, payload.queryParams);
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
    answer: answerMap[key] || '',
  }));
}

function buildVariables(answerMap, tracking, fullUrl) {
  const answerVars = ANSWER_KEYS.map((key) => ({ name: key, value: answerMap[key] || '' }));
  const trackingVars = TRACKING_KEYS.map((key) => ({ name: key, value: tracking[key] || '' }));

  return [
    ...answerVars,
    ...trackingVars,
    { name: 'full_url', value: fullUrl },
  ];
}

function buildWebhookQueryParams(finalStatus, isCompleted) {
  if (!isCompleted) return {};

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
}

function inferAnswerType(key) {
  if (key === 'email') return 'email';
  if (key === 'telefone') return 'phone';
  return 'text';
}
