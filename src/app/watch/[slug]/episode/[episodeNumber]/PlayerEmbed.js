"use client";
import { useState } from "react";

export default function PlayerEmbed({ src }) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full aspect-video">
      {/* Spinner overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Iframe */}
      <iframe
        src={src}
        width="100%"
        height="100%"
        className="absolute inset-0 w-full h-full"
        style={{ border: "none" }}
        sandbox="allow-scripts allow-same-origin allow-presentation allow-top-navigation-by-user-activation"
        allowFullScreen
        onLoad={() => setLoading(false)} // ✅ matikan loading ketika iframe ready
      />
    </div>
  );
}
