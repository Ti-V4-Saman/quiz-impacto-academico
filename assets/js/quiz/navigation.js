import { FINAL_SCREENS } from '../constants.js';
import { CONFIG } from '../config.js';
<<<<<<< HEAD
import { markQuizCompleted, state } from '../state.js';
import { cancelPartialSave } from '../services/partial-save.service.js';
=======
import { state } from '../state.js';
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
import { sendFinalResults } from '../services/results.service.js';
import { trackLeadOnce } from '../services/pixel.service.js';
import { getRedirectUrl } from './redirect.js';
import { renderFinal, renderStep } from '../main.js';

export function startQuiz() {
<<<<<<< HEAD
  if (state.isSubmitting) return;
=======
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
  goTo('nome');
}

export function goTo(stepId) {
<<<<<<< HEAD
  if (state.isSubmitting || state.isCompleted) return;

=======
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
  state.currentStepId = stepId;

  if (state.history[state.history.length - 1] !== stepId) {
    state.history.push(stepId);
  }

  renderStep(stepId);
}

export function goBack() {
<<<<<<< HEAD
  if (state.history.length <= 1 || state.isSubmitting || state.isCompleted) return;
=======
  if (state.history.length <= 1 || state.isSubmitting) return;
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494

  state.history.pop();
  const previous = state.history[state.history.length - 1] || 'hero';
  state.currentStepId = previous;
  renderStep(previous, { replaceHistory: true });
}

export async function finishQuiz(finalStatus) {
<<<<<<< HEAD
  if (state.isSubmitting) return;

  cancelPartialSave();
  state.isSubmitting = true;
  state.isCompleted = true;
  state.finalStatus = finalStatus;
  state.finalRedirectUrl = getRedirectUrl(finalStatus);
  state.currentStepId = `final_${finalStatus}`;
  state.lastSubmitError = '';

  if (state.history[state.history.length - 1] !== state.currentStepId) {
    state.history.push(state.currentStepId);
  }
=======
  state.finalStatus = finalStatus;
  state.finalRedirectUrl = getRedirectUrl(finalStatus);
  state.currentStepId = `final_${finalStatus}`;
  state.history.push(state.currentStepId);
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494

  renderFinal(finalStatus, { loading: true });

  try {
    if (finalStatus === 'approved') trackLeadOnce({ finalStatus });
    await sendFinalResults(finalStatus);
<<<<<<< HEAD
    markQuizCompleted();
    renderFinal(finalStatus, { loading: false });
  } catch (error) {
    state.lastSubmitError = error?.message || 'Não foi possível enviar as respostas.';
    if (CONFIG.DEBUG) console.error('Erro ao enviar payload final', error);
    renderFinal(finalStatus, {
      loading: false,
      error: true,
      errorMessage: state.lastSubmitError
    });
  } finally {
    state.isSubmitting = false;
  }
}

export function retryFinalSubmission() {
  return finishQuiz(state.finalStatus || 'refugo');
}

export function openFinalRedirect() {
  if (!state.isCompleted || state.lastSubmitError) return;

=======
  } catch (error) {
    if (CONFIG.DEBUG) console.error('Erro ao enviar payload final', error);
  } finally {
    renderFinal(finalStatus, { loading: false });
  }
}

export function openFinalRedirect() {
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
  const finalStatus = state.finalStatus || 'refugo';
  const screen = FINAL_SCREENS[finalStatus] || FINAL_SCREENS.refugo;
  const url = getRedirectUrl(screen.status);

  window.setTimeout(() => {
    window.location.href = url;
  }, CONFIG.REDIRECT_DELAY_MS);
}
