import { CONFIG } from '../config.js';
import { FINAL_SCREENS } from '../constants.js';

export function getRedirectUrl(finalStatus) {
  const finalScreen = FINAL_SCREENS[finalStatus] || FINAL_SCREENS.refugo;
  return CONFIG.REDIRECTS[finalScreen.redirectKey] || CONFIG.REDIRECTS.EBOOK_URL;
}

export function redirectToFinalUrl(finalStatus) {
  const url = getRedirectUrl(finalStatus);
  window.location.href = url;
}
