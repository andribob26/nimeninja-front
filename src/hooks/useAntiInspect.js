"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAntiInspect() {
  const router = useRouter();

  useEffect(() => {
    let redirected = false;

    const triggerRedirect = () => {
      if (redirected) return;
      redirected = true;
      setTimeout(() => router.back(), 300);
    };

    // Anti-select
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        user-select: none !important;
        -webkit-user-select: none !important;
      }
      ::selection {
        background: none;
      }
    `;
    document.head.appendChild(style);

    // Deteksi DevTools berdasarkan console inspection (lebih aman)
    const el = new Image();
    Object.defineProperty(el, "id", {
      get: function () {
        triggerRedirect();
        return "detected";
      },
    });

    // Trigger console hanya setelah delay (menghindari salah deteksi di awal render)
    const logCheck = setTimeout(() => {
      console.clear();
      console.log(
        `
        %cAkses Ditolak
        • Jangan Menyerah, Coba Lagi!
        • Tapi bukan dengan inspect 😅
        `,
        "color: #FF8800; font-family: monospace; font-size: 14px"
      );
    }, 2000);

    // Cek `debugger` trap — hanya sekali
    const trapDebugger = () => {
      const before = performance.now();
      debugger;
      const after = performance.now();
      if (after - before > 100) {
        triggerRedirect();
      }
    };
    const debuggerTimeout = setTimeout(trapDebugger, 500); // Tunggu dulu agar false positive berkurang

    // Shortcut DevTools & Klik kanan
    const preventContext = (e) => e.preventDefault();
    const preventShortcut = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey &&
          e.shiftKey &&
          ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.metaKey && e.altKey && e.key.toUpperCase() === "I")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("contextmenu", preventContext);
    window.addEventListener("keydown", preventShortcut);

    return () => {
      clearTimeout(logCheck);
      clearTimeout(debuggerTimeout);
      document.removeEventListener("contextmenu", preventContext);
      window.removeEventListener("keydown", preventShortcut);
      style.remove();
    };
  }, [router]);
}
