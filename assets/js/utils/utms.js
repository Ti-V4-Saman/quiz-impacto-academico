import { TRACKING_KEYS } from '../constants.js';
import { state } from '../state.js';

export function hydrateTrackingFromUrl() {
  const params = new URLSearchParams(window.location.search);

  TRACKING_KEYS.forEach((key) => {
    const valueFromUrl = params.get(key) || '';
    const cookieValue = readCookie(key) || '';
    const value = valueFromUrl || cookieValue || '';
    state.tracking[key] = value;

    if (valueFromUrl) writeCookie(key, valueFromUrl, 90);
  });

  hydrateFacebookBrowserIds();
}

export function hydrateFacebookBrowserIds() {
  if (!state.tracking.fbp) state.tracking.fbp = readCookie('_fbp') || readCookie('fbp') || '';
  if (!state.tracking.fbc) state.tracking.fbc = readCookie('_fbc') || readCookie('fbc') || '';
}

export function getFullUrl() {
  return window.location.href;
}

function readCookie(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : '';
}

function writeCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}
