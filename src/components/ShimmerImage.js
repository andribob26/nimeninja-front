"use client";

import { useState } from "react";
import Image from "next/image";

export default function ShimmerImage({ src, alt, className = "", ...props }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded" />
      )}

      <Image
        src={src}
        alt={alt}
        fill
        priority
        onLoad={() => setLoaded(true)}
        className={`object-cover rounded transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        {...props}
      />
    </div>
  );
}
