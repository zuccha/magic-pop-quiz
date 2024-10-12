type Callback<T> = (value: T) => void;

const appId = "sq";
const listeners = new Map<string, Set<Callback<any>>>();

const Storage = {
  clear: (): void => {
    Object.keys(localStorage)
      .filter((item) => item.startsWith(`${appId}/`))
      .forEach((item) => localStorage.removeItem(item));
    window.location.reload();
  },

  load: <T>(id: string, defaultValue: T, parse: (maybeT: unknown) => T): T => {
    id = `${appId}/${id}`;
    try {
      const stringOrNull = localStorage.getItem(id);
      return stringOrNull === null
        ? defaultValue
        : parse(JSON.parse(stringOrNull));
    } catch {
      localStorage.removeItem(id);
      return defaultValue;
    }
  },

  save: <T>(id: string, value: T): void => {
    id = `${appId}/${id}`;
    localStorage.setItem(id, JSON.stringify(value));
    listeners.get(id)?.forEach((callback) => callback(value));
  },

  subscribe: <T>(id: string, callback: Callback<T>): (() => void) => {
    id = `${appId}/${id}`;
    if (!listeners.has(id)) listeners.set(id, new Set());
    listeners.get(id)!.add(callback);

    return () => {
      listeners.get(id)?.delete(callback);
      if (listeners.get(id)?.size === 0) listeners.delete(id);
    };
  },

  getIdsStartingWith: (prefix: string): string[] => {
    prefix = `${appId}/${prefix}`;
    return Object.keys(localStorage)
      .filter((id) => id.startsWith(prefix))
      .map((id) => id.substring(appId.length + 1));
  },
};

export default Storage;
