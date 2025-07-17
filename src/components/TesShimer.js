"use client";

import { useState } from "react";
import Image from "next/image";

export default function TestShimmer() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 400,
        aspectRatio: "16/9",
        position: "relative",
      }}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded" />
      )}

      <Image
        src="/assets/images/naruto_cover.jpg"
        alt="Sample"
        fill
        className={`object-cover rounded transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadingComplete={() => setLoaded(true)}
      />
    </div>
  );
}
