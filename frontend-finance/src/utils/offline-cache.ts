const SESSION_STORAGE_KEY = "finance-offline-cache-session";
const API_CACHE_NAME = "api-cache";
const API_METADATA_CACHE_NAME = "api-cache-metadata";

function getSessionId(): string | null {
  try {
    return window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function createSessionId(): string {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function getOfflineCacheSessionHeader(apiBaseUrl: string): string | null {
  if (!navigator.serviceWorker?.controller) {
    return null;
  }

  const sessionId = getSessionId();

  if (!sessionId) {
    return null;
  }

  const apiOrigin = new URL(apiBaseUrl, window.location.href).origin;
  return `${sessionId}|${apiOrigin}`;
}

export function forgetOfflineCacheSession(): void {
  try {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch {
    // Cache remains disabled when session storage is unavailable.
  }
}

async function sendClearMessage(): Promise<boolean> {
  const controller = navigator.serviceWorker?.controller;

  if (!controller) {
    return false;
  }

  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timeout = window.setTimeout(() => {
      channel.port1.close();
      resolve(false);
    }, 1000);

    channel.port1.addEventListener(
      "message",
      () => {
        window.clearTimeout(timeout);
        channel.port1.close();
        resolve(true);
      },
      { once: true },
    );
    channel.port1.start();

    controller.postMessage({ type: "CLEAR_API_CACHE" }, [channel.port2]);
  });
}

export async function clearOfflineApiCache(): Promise<void> {
  forgetOfflineCacheSession();

  try {
    await sendClearMessage();
  } catch {
    // Cache Storage cleanup below remains the fallback.
  }

  if ("caches" in window) {
    try {
      await Promise.all([
        window.caches.delete(API_CACHE_NAME),
        window.caches.delete(API_METADATA_CACHE_NAME),
      ]);
    } catch {
      // The service worker remains responsible for cache cleanup when available.
    }
  }
}

export async function startOfflineCacheSession(): Promise<void> {
  await clearOfflineApiCache();

  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, createSessionId());
  } catch {
    // Offline API caching is skipped if the browser blocks session storage.
  }
}
