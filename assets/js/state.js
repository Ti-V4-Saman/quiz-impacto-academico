import { ANSWER_KEYS, STORAGE_KEYS, TRACKING_KEYS } from './constants.js';
import { getOrCreateId } from './utils/ids.js';

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
  finalStatus: '',
  finalRedirectUrl: '',
  partialSeq: 0
};

sessionStorage.setItem(STORAGE_KEYS.createdAt, state.createdAt);
