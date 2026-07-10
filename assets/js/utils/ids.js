export function createId(prefix = 'id') {
  const random = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : Math.random().toString(36).slice(2);
  return `${prefix}_${random}`;
}

export function getOrCreateId(storageKey, prefix) {
  const stored = sessionStorage.getItem(storageKey);
  if (stored) return stored;

  const id = createId(prefix);
  sessionStorage.setItem(storageKey, id);
  return id;
}
