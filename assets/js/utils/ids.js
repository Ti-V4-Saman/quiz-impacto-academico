<<<<<<< HEAD
import { safeSessionStorage } from './storage.js';

export function createId(prefix = 'id') {
  const random = globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : Math.random().toString(36).slice(2);

=======
export function createId(prefix = 'id') {
  const random = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : Math.random().toString(36).slice(2);
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  return `${prefix}_${random}`;
}

export function getOrCreateId(storageKey, prefix) {
<<<<<<< HEAD
  const stored = safeSessionStorage.getItem(storageKey);
  if (stored) return stored;

  const id = createId(prefix);
  safeSessionStorage.setItem(storageKey, id);
=======
  const stored = sessionStorage.getItem(storageKey);
  if (stored) return stored;

  const id = createId(prefix);
  sessionStorage.setItem(storageKey, id);
>>>>>>> 476e01f94e7beca568a91de7e39f46c2053328b2
  return id;
}
