/**
 * Runs `callback` once the window has fully loaded (fonts + images included),
 * or immediately if the load event has already fired. Use this instead of a
 * fixed-duration timer to trigger a deterministic ScrollTrigger.refresh().
 */
export function onWindowLoad(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  if (document.readyState === "complete") {
    callback();
    return () => {};
  }

  window.addEventListener("load", callback, { once: true });
  return () => window.removeEventListener("load", callback);
}
