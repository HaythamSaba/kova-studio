"use client";

import Lenis from "lenis";

let globalLenis: Lenis | null = null;

export function setGlobalLenis(lenis: Lenis) {
  globalLenis = lenis;
}

export function useLenis() {
  return globalLenis;
}