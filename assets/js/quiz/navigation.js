import { FINAL_SCREENS } from '../constants.js';
import { CONFIG } from '../config.js';
import { markQuizCompleted, state } from '../state.js';
import { cancelPartialSave } from '../services/partial-save.service.js';
import { sendFinalResults } from '../services/results.service.js';
import { trackLeadOnce } from '../services/pixel.service.js';
import { getRedirectUrl } from './redirect.js';

let renderer = null;

export function configureNavigation(adapter) {
  if (!adapter || typeof adapter.renderStep !== 'function' || typeof adapter.renderFinal !== 'function') {
    throw new Error('Adaptador de renderização inválido.');
  }

  renderer = adapter;
}

function requireRenderer() {
  if (!renderer) {
    throw new Error('A navegação foi usada antes da inicialização da interface.');
  }

  return renderer;
}

export function startQuiz() {
  if (state.isSubmitting) return;
  goTo('nome');
}

export function goTo(stepId) {
  if (state.isSubmitting || state.isCompleted) return;

  state.currentStepId = stepId;

  if (state.history[state.history.length - 1] !== stepId) {
    state.history.push(stepId);
  }

  requireRenderer().renderStep(stepId);
}

export function goBack() {
  if (state.history.length <= 1 || state.isSubmitting || state.isCompleted) return;

  state.history.pop();
  const previous = state.history[state.history.length - 1] || 'hero';
  state.currentStepId = previous;
  requireRenderer().renderStep(previous, { replaceHistory: true });
}

export async function finishQuiz(finalStatus) {
  if (state.isSubmitting) return;

  cancelPartialSave();
  state.answers.consultora = 'Calendário Free';
  state.isSubmitting = true;
  state.isCompleted = true;
  state.finalStatus = finalStatus;
  state.finalRedirectUrl = getRedirectUrl(finalStatus);
  state.currentStepId = `final_${finalStatus}`;
  state.lastSubmitError = '';

  if (state.history[state.history.length - 1] !== state.currentStepId) {
    state.history.push(state.currentStepId);
  }

  requireRenderer().renderFinal(finalStatus, { loading: true });

  try {
    if (finalStatus === 'approved') trackLeadOnce({ finalStatus });
    await sendFinalResults(finalStatus);
    markQuizCompleted();
    requireRenderer().renderFinal(finalStatus, { loading: false });
  } catch (error) {
    state.lastSubmitError = error?.message || 'Não foi possível enviar as respostas.';
    if (CONFIG.DEBUG) console.error('Erro ao enviar payload final', error);
    requireRenderer().renderFinal(finalStatus, {
      loading: false,
      error: true,
      errorMessage: state.lastSubmitError
    });
  } finally {
    state.isSubmitting = false;
  }
}

export function retryFinalSubmission() {
  state.isSubmitting = false;
  state.isCompleted = false;
  return finishQuiz(state.finalStatus || 'approved');
}

export function openFinalRedirect() {
  if (!state.isCompleted || state.lastSubmitError) return;

  const finalStatus = state.finalStatus || 'approved';
  const screen = FINAL_SCREENS[finalStatus] || FINAL_SCREENS.approved;
  const url = getRedirectUrl(screen.status);

  window.setTimeout(() => {
    window.location.href = url;
  }, CONFIG.REDIRECT_DELAY_MS);
}
