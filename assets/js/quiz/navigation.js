import { FINAL_SCREENS } from '../constants.js';
import { CONFIG } from '../config.js';
import { state } from '../state.js';
import { sendFinalResults } from '../services/results.service.js';
import { trackLeadOnce } from '../services/pixel.service.js';
import { getRedirectUrl } from './redirect.js';
import { renderFinal, renderStep } from '../main.js';

export function startQuiz() {
  goTo('nome');
}

export function goTo(stepId) {
  state.currentStepId = stepId;

  if (state.history[state.history.length - 1] !== stepId) {
    state.history.push(stepId);
  }

  renderStep(stepId);
}

export function goBack() {
  if (state.history.length <= 1 || state.isSubmitting) return;

  state.history.pop();
  const previous = state.history[state.history.length - 1] || 'hero';
  state.currentStepId = previous;
  renderStep(previous, { replaceHistory: true });
}

export async function finishQuiz(finalStatus) {
  state.finalStatus = finalStatus;
  state.finalRedirectUrl = getRedirectUrl(finalStatus);
  state.currentStepId = `final_${finalStatus}`;
  state.history.push(state.currentStepId);

  renderFinal(finalStatus, { loading: true });

  try {
    if (finalStatus === 'approved') trackLeadOnce({ finalStatus });
    await sendFinalResults(finalStatus);
  } catch (error) {
    if (CONFIG.DEBUG) console.error('Erro ao enviar payload final', error);
  } finally {
    renderFinal(finalStatus, { loading: false });
  }
}

export function openFinalRedirect() {
  const finalStatus = state.finalStatus || 'refugo';
  const screen = FINAL_SCREENS[finalStatus] || FINAL_SCREENS.refugo;
  const url = getRedirectUrl(screen.status);

  window.setTimeout(() => {
    window.location.href = url;
  }, CONFIG.REDIRECT_DELAY_MS);
}
