import { ANSWER_KEYS, STORAGE_KEYS, TRACKING_KEYS } from './constants.js';
import { getOrCreateId } from './utils/ids.js';
import { safeSessionStorage } from './utils/storage.js';

function clearCompletedSession() {
  if (safeSessionStorage.getItem(STORAGE_KEYS.completed) !== 'true') return;
  Object.values(STORAGE_KEYS).forEach((key) => safeSessionStorage.removeItem(key));
}

function readCounter(key) {
  const value = Number.parseInt(safeSessionStorage.getItem(key) || '0', 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function emptyAnswers() {
  return ANSWER_KEYS.reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {
    telefone_pais: 'BR',
    telefone_ddi: '+55'
  });
}

function emptyTracking() {
  return TRACKING_KEYS.reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {});
}

clearCompletedSession();

export const state = {
  sessionId: getOrCreateId(STORAGE_KEYS.sessionId, 'session'),
  resultId: getOrCreateId(STORAGE_KEYS.resultId, 'result'),
  createdAt: safeSessionStorage.getItem(STORAGE_KEYS.createdAt) || new Date().toISOString(),
  updatedAt: '',
  currentStepId: 'hero',
  history: ['hero'],
  answers: emptyAnswers(),
  tracking: emptyTracking(),
  isSubmitting: false,
  isCompleted: false,
  finalStatus: '',
  finalRedirectUrl: '',
  finalPayload: null,
  basicContactFingerprint: safeSessionStorage.getItem(STORAGE_KEYS.basicContactFingerprint) || '',
  lastSubmitError: '',
  partialSeq: readCounter(STORAGE_KEYS.partialSeq),
  eventVersion: readCounter(STORAGE_KEYS.eventVersion)
};

safeSessionStorage.setItem(STORAGE_KEYS.createdAt, state.createdAt);

export function nextPartialSeq() {
  state.partialSeq += 1;
  safeSessionStorage.setItem(STORAGE_KEYS.partialSeq, String(state.partialSeq));
  return state.partialSeq;
}

export function nextEventVersion() {
  state.eventVersion += 1;
  safeSessionStorage.setItem(STORAGE_KEYS.eventVersion, String(state.eventVersion));
  return state.eventVersion;
}

export function markQuizCompleted() {
  state.isCompleted = true;
  safeSessionStorage.setItem(STORAGE_KEYS.completed, 'true');
}

export function markBasicContactCaptured(fingerprint) {
  state.basicContactFingerprint = String(fingerprint || '');
  safeSessionStorage.setItem(STORAGE_KEYS.basicContactFingerprint, state.basicContactFingerprint);
}
