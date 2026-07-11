import { FINAL_SCREENS } from '../constants.js';
import { CONFIG } from '../config.js';
<<<<<<< HEAD
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
=======
<<<<<<< HEAD
import { markQuizCompleted, state } from '../state.js';
import { cancelPartialSave } from '../services/partial-save.service.js';
=======
<<<<<<< HEAD
import { markQuizCompleted, state } from '../state.js';
import { cancelPartialSave } from '../services/partial-save.service.js';
=======
import { state } from '../state.js';
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
import { sendFinalResults } from '../services/results.service.js';
import { trackLeadOnce } from '../services/pixel.service.js';
import { getRedirectUrl } from './redirect.js';
import { renderFinal, renderStep } from '../main.js';

export function startQuiz() {
<<<<<<< HEAD
  if (state.isSubmitting) return;
=======
<<<<<<< HEAD
  if (state.isSubmitting) return;
=======
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  goTo('nome');
}

export function goTo(stepId) {
<<<<<<< HEAD
  if (state.isSubmitting || state.isCompleted) return;

=======
<<<<<<< HEAD
  if (state.isSubmitting || state.isCompleted) return;

=======
<<<<<<< HEAD
  if (state.isSubmitting || state.isCompleted) return;

=======
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  state.currentStepId = stepId;

  if (state.history[state.history.length - 1] !== stepId) {
    state.history.push(stepId);
  }

<<<<<<< HEAD
  requireRenderer().renderStep(stepId);
}

export function goBack() {
  if (state.history.length <= 1 || state.isSubmitting || state.isCompleted) return;
=======
  renderStep(stepId);
}

export function goBack() {
<<<<<<< HEAD
  if (state.history.length <= 1 || state.isSubmitting || state.isCompleted) return;
=======
<<<<<<< HEAD
  if (state.history.length <= 1 || state.isSubmitting || state.isCompleted) return;
=======
  if (state.history.length <= 1 || state.isSubmitting) return;
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2

  state.history.pop();
  const previous = state.history[state.history.length - 1] || 'hero';
  state.currentStepId = previous;
<<<<<<< HEAD
  requireRenderer().renderStep(previous, { replaceHistory: true });
}

export async function finishQuiz(finalStatus) {
=======
  renderStep(previous, { replaceHistory: true });
}

export async function finishQuiz(finalStatus) {
<<<<<<< HEAD
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  if (state.isSubmitting) return;

  cancelPartialSave();
  state.answers.consultora = 'Calendário Free';
<<<<<<< HEAD
=======
=======
<<<<<<< HEAD
  if (state.isSubmitting) return;

  cancelPartialSave();
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  state.isSubmitting = true;
  state.isCompleted = true;
  state.finalStatus = finalStatus;
  state.finalRedirectUrl = getRedirectUrl(finalStatus);
  state.currentStepId = `final_${finalStatus}`;
  state.lastSubmitError = '';

  if (state.history[state.history.length - 1] !== state.currentStepId) {
    state.history.push(state.currentStepId);
  }
<<<<<<< HEAD

  requireRenderer().renderFinal(finalStatus, { loading: true });
=======
<<<<<<< HEAD
=======
=======
  state.finalStatus = finalStatus;
  state.finalRedirectUrl = getRedirectUrl(finalStatus);
  state.currentStepId = `final_${finalStatus}`;
  state.history.push(state.currentStepId);
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e

  renderFinal(finalStatus, { loading: true });
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2

  try {
    if (finalStatus === 'approved') trackLeadOnce({ finalStatus });
    await sendFinalResults(finalStatus);
<<<<<<< HEAD
    markQuizCompleted();
    requireRenderer().renderFinal(finalStatus, { loading: false });
  } catch (error) {
    state.lastSubmitError = error?.message || 'Não foi possível enviar as respostas.';
    if (CONFIG.DEBUG) console.error('Erro ao enviar payload final', error);
    requireRenderer().renderFinal(finalStatus, {
=======
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
    markQuizCompleted();
    renderFinal(finalStatus, { loading: false });
  } catch (error) {
    state.lastSubmitError = error?.message || 'Não foi possível enviar as respostas.';
    if (CONFIG.DEBUG) console.error('Erro ao enviar payload final', error);
    renderFinal(finalStatus, {
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
      loading: false,
      error: true,
      errorMessage: state.lastSubmitError
    });
  } finally {
    state.isSubmitting = false;
  }
}

export function retryFinalSubmission() {
<<<<<<< HEAD
  state.isSubmitting = false;
  state.isCompleted = false;
  return finishQuiz(state.finalStatus || 'approved');
=======
  return finishQuiz(state.finalStatus || 'refugo');
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
}

export function openFinalRedirect() {
  if (!state.isCompleted || state.lastSubmitError) return;

<<<<<<< HEAD
  const finalStatus = state.finalStatus || 'approved';
  const screen = FINAL_SCREENS[finalStatus] || FINAL_SCREENS.approved;
=======
<<<<<<< HEAD
=======
=======
  } catch (error) {
    if (CONFIG.DEBUG) console.error('Erro ao enviar payload final', error);
  } finally {
    renderFinal(finalStatus, { loading: false });
  }
}

export function openFinalRedirect() {
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
>>>>>>> 633d536e8834b1d696353ab96dd64c55b8acfe2e
  const finalStatus = state.finalStatus || 'refugo';
  const screen = FINAL_SCREENS[finalStatus] || FINAL_SCREENS.refugo;
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  const url = getRedirectUrl(screen.status);

  window.setTimeout(() => {
    window.location.href = url;
  }, CONFIG.REDIRECT_DELAY_MS);
}
