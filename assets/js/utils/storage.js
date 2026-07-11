const memoryStorage = new Map();

function getNativeStorage() {
  try {
    const storage = window.sessionStorage;
    const probeKey = '__impacto_storage_probe__';
    storage.setItem(probeKey, '1');
    storage.removeItem(probeKey);
    return storage;
  } catch {
    return null;
  }
}

const nativeStorage = getNativeStorage();

export const safeSessionStorage = {
  getItem(key) {
    const normalizedKey = String(key);

    if (nativeStorage) {
      try {
        return nativeStorage.getItem(normalizedKey);
      } catch {
        // Continua usando o fallback em memória.
      }
    }

    return memoryStorage.has(normalizedKey)
      ? memoryStorage.get(normalizedKey)
      : null;
  },

  setItem(key, value) {
    const normalizedKey = String(key);
    const normalizedValue = String(value);

    memoryStorage.set(normalizedKey, normalizedValue);

    if (nativeStorage) {
      try {
        nativeStorage.setItem(normalizedKey, normalizedValue);
      } catch {
        // O fallback em memória já foi atualizado.
      }
    }
  },

  removeItem(key) {
    const normalizedKey = String(key);
    memoryStorage.delete(normalizedKey);

    if (nativeStorage) {
      try {
        nativeStorage.removeItem(normalizedKey);
      } catch {
        // O fallback em memória já foi atualizado.
      }
    }
  },

  clear() {
    memoryStorage.clear();

    if (nativeStorage) {
      try {
        nativeStorage.clear();
      } catch {
        // O fallback em memória já foi limpo.
      }
    }
  }
};
