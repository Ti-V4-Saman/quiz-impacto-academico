import { CONFIG } from '../config.js';
import { STORAGE_KEYS } from '../constants.js';
import { safeSessionStorage } from '../utils/storage.js';

export function initMetaPixels() {
  if (!Array.isArray(CONFIG.META_PIXEL_IDS) || CONFIG.META_PIXEL_IDS.length === 0) return;

  if (!window.fbq) {
    /* eslint-disable */
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
    (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
  }

  CONFIG.META_PIXEL_IDS.forEach((pixelId) => window.fbq('init', pixelId));
}

export function trackPageView() {
  if (window.fbq) window.fbq('track', 'PageView');
  pushDataLayer('QuizPageView');
}

export function trackLeadOnce(data = {}) {
  if (safeSessionStorage.getItem(STORAGE_KEYS.leadEventSent) === '1') return;

  if (window.fbq) window.fbq('track', 'Lead', data);
  pushDataLayer('Lead', data);
  safeSessionStorage.setItem(STORAGE_KEYS.leadEventSent, '1');
}

export function pushDataLayer(event, data = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}
