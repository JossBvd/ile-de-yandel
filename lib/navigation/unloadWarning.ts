/**
 * Avertissement beforeunload uniquement quand la session (sessionStorage) risque
 * d’être perdue : fermeture d’onglet / fenêtre, navigation hors origine.
 * Pas d’avertissement : navigation interne (router, liens même origine, barre d’URL vers le site).
 */

const SUPPRESS_MS = 1500;

let suppressUntil = 0;
let pendingReload = false;
let guardsInstalled = false;

export function markSuppressUnloadWarning(): void {
  suppressUntil = Date.now() + SUPPRESS_MS;
}

export function shouldWarnBeforeUnload(): boolean {
  if (Date.now() < suppressUntil) return false;
  if (pendingReload) {
    pendingReload = false;
    return false;
  }
  return true;
}

function isSameOriginHref(href: string): boolean {
  try {
    return new URL(href, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

export function installUnloadWarningGuards(): void {
  if (typeof window === "undefined" || guardsInstalled) return;
  guardsInstalled = true;

  const originalPushState = history.pushState.bind(history);
  const originalReplaceState = history.replaceState.bind(history);

  history.pushState = (...args) => {
    markSuppressUnloadWarning();
    return originalPushState(...args);
  };

  history.replaceState = (...args) => {
    markSuppressUnloadWarning();
    return originalReplaceState(...args);
  };

  window.addEventListener("popstate", () => {
    markSuppressUnloadWarning();
  });

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (!isSameOriginHref(anchor.href)) return;
      markSuppressUnloadWarning();
    },
    true,
  );

  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "F5") {
        pendingReload = true;
        markSuppressUnloadWarning();
        return;
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "r") {
        pendingReload = true;
        markSuppressUnloadWarning();
      }
    },
    true,
  );

  type NavigationWithEvents = {
    addEventListener: (
      type: "navigate",
      listener: (event: {
        destination: { url: string };
        navigationType: string;
      }) => void,
    ) => void;
  };

  const nav = (window as Window & { navigation?: NavigationWithEvents })
    .navigation;
  if (nav?.addEventListener) {
    nav.addEventListener("navigate", (event) => {
      try {
        const dest = new URL(event.destination.url);
        if (dest.origin === window.location.origin) {
          markSuppressUnloadWarning();
        }
      } catch {
        /* ignore */
      }
      if (event.navigationType === "reload") {
        pendingReload = true;
        markSuppressUnloadWarning();
      }
    });
  }
}
