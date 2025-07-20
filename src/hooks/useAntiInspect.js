"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import devtools from "../utils/devtools";

export default function useAntiInspect() {
  const router = useRouter();

  useEffect(() => {
    console.log(window);

    // ⛔ Detect DevTools status on mount
    if (devtools.isOpen) {
      console.clear();
      console.log(
        `%c⚠️ Akses Ditolak ⚠️\n  Jangan Menyerah, Coba Lagi!\n  Tapi bukan dengan inspect 😅`,
        "color: #FF8800; font-family: monospace; font-size: 14px"
      );
      router.replace("/");
    }

    const onChange = (e) => {
      if (e.detail.isOpen) {
        console.clear();
        console.log(
          `%c⚠️ Akses Ditolak ⚠️\n\n  Jangan Menyerah, Coba Lagi!\n  Tapi bukan dengan inspect 😅`,
          "color: #FF8800; font-family: monospace; font-size: 14px"
        );
        router.replace("/");
      }
    };

    window.addEventListener("devtoolschange", onChange);

    window.addEventListener("devicemotion", (e) => {
      const motion = e.accelerationIncludingGravity;
      if (motion && (motion.x !== null || motion.y !== null)) {
        console.log("Sensor aktif. Ini kemungkinan besar HP asli.");
      } else {
        console.log("Tidak ada sensor nyata.");
      }
    });

    // 🛡️ Disable text selection
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

    // 🚫 Blok shortcut & klik kanan
    const preventContext = (e) => e.preventDefault();
    const preventShortcut = (e) => {
      const key = e.key.toUpperCase();
      if (
        key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(key)) ||
        (e.metaKey && e.altKey && key === "I")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("contextmenu", preventContext);
    window.addEventListener("keydown", preventShortcut);

    return () => {
      window.removeEventListener("devtoolschange", onChange);
      document.removeEventListener("contextmenu", preventContext);
      window.removeEventListener("keydown", preventShortcut);
      style.remove();
    };
  }, [router]);
}
