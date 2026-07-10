import { ANSWER_KEYS, STORAGE_KEYS, TRACKING_KEYS } from './constants.js';
import { getOrCreateId } from './utils/ids.js';

<<<<<<< HEAD
function clearCompletedSession() {
  if (sessionStorage.getItem(STORAGE_KEYS.completed) !== 'true') return;
  Object.values(STORAGE_KEYS).forEach((key) => sessionStorage.removeItem(key));
}

function readCounter(key) {
  const value = Number.parseInt(sessionStorage.getItem(key) || '0', 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

=======
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
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

<<<<<<< HEAD
clearCompletedSession();

=======
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
export const state = {
  sessionId: getOrCreateId(STORAGE_KEYS.sessionId, 'session'),
  resultId: getOrCreateId(STORAGE_KEYS.resultId, 'result'),
  createdAt: sessionStorage.getItem(STORAGE_KEYS.createdAt) || new Date().toISOString(),
  updatedAt: '',
  currentStepId: 'hero',
  history: ['hero'],
  answers: emptyAnswers(),
  tracking: emptyTracking(),
  isSubmitting: false,
<<<<<<< HEAD
  isCompleted: false,
  finalStatus: '',
  finalRedirectUrl: '',
  finalPayload: null,
  lastSubmitError: '',
  partialSeq: readCounter(STORAGE_KEYS.partialSeq),
  eventVersion: readCounter(STORAGE_KEYS.eventVersion)
};

sessionStorage.setItem(STORAGE_KEYS.createdAt, state.createdAt);

export function nextPartialSeq() {
  state.partialSeq += 1;
  sessionStorage.setItem(STORAGE_KEYS.partialSeq, String(state.partialSeq));
  return state.partialSeq;
}

export function nextEventVersion() {
  state.eventVersion += 1;
  sessionStorage.setItem(STORAGE_KEYS.eventVersion, String(state.eventVersion));
  return state.eventVersion;
}

export function markQuizCompleted() {
  state.isCompleted = true;
  sessionStorage.setItem(STORAGE_KEYS.completed, 'true');
}
=======
  finalStatus: '',
  finalRedirectUrl: '',
  partialSeq: 0
};

sessionStorage.setItem(STORAGE_KEYS.createdAt, state.createdAt);
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
