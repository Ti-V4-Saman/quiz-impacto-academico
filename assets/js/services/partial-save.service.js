import { CONFIG } from '../config.js';
<<<<<<< HEAD
import { state } from '../state.js';
import { sendPartialResults } from './results.service.js';

let timer = null;
let generation = 0;

export function cancelPartialSave() {
  generation += 1;
  window.clearTimeout(timer);
  timer = null;
}

export function schedulePartialSave(eventName = 'partial', options = {}) {
  if (!CONFIG.ENABLE_WEBHOOKS || state.isSubmitting || state.isCompleted) return;

  cancelPartialSave();
  const scheduledGeneration = generation;

  const run = () => {
    timer = null;
    if (scheduledGeneration !== generation || state.isSubmitting || state.isCompleted) return;

=======
import { sendPartialResults } from './results.service.js';

let timer = null;

export function schedulePartialSave(eventName = 'partial', options = {}) {
  if (!CONFIG.ENABLE_WEBHOOKS) return;

  window.clearTimeout(timer);

  const run = () => {
>>>>>>> d3d3880abb39b317b80fc1521e707c08c5c29494
    sendPartialResults(eventName).catch((error) => {
      if (CONFIG.DEBUG) console.error('Erro ao salvar parcial', error);
    });
  };

  if (options.immediate) {
    run();
    return;
  }

  timer = window.setTimeout(run, CONFIG.PARTIAL_DEBOUNCE_MS);
}
