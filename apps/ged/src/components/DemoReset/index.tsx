"use client";

// React
import { useEffect } from "react";

// Data
import { resetState } from "@/data/persistence";

/**
 * Gatilho ESCONDIDO para resetar a demonstração (sem entrada visível na UI).
 * Atalho: Ctrl + Shift + Alt + R — combinação improvável de disparar por acidente,
 * ainda protegida por um confirm(). Também disponível via console: window.__gedReset().
 */
export default function DemoReset() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.altKey && e.key.toLowerCase() === "r") {
        e.preventDefault();
        if (window.confirm("Resetar a demonstração aos dados originais? Alterações locais serão perdidas.")) {
          resetState();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
