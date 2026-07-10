import { CONFIG } from '../config.js';
import { sendPartialResults } from './results.service.js';

let timer = null;

export function schedulePartialSave(eventName = 'partial', options = {}) {
  if (!CONFIG.ENABLE_WEBHOOKS) return;

  window.clearTimeout(timer);

  const run = () => {
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
