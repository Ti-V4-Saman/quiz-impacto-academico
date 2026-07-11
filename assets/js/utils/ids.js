import { safeSessionStorage } from './storage.js';

export function createId(prefix = 'id') {
  const random = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2);

  return `${prefix}_${random}`;
}

export function getOrCreateId(storageKey, prefix) {
  const stored = safeSessionStorage.getItem(storageKey);
  if (stored) return stored;

  const id = createId(prefix);
  safeSessionStorage.setItem(storageKey, id);
  return id;
}
