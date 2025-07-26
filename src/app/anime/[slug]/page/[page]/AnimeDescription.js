"use client";
import React, { useState, useEffect, useRef } from "react";

const AnimeDescription = ({ anime }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const el = descriptionRef.current;
    if (el) {
      setIsOverflowing(el.scrollHeight > el.clientHeight);
    }
  }, [anime.description]);

  return (
    <header className="space-y-3">
      <h1 className="text-center md:text-left text-3xl md:text-4xl font-bold drop-shadow-lg leading-snug">
        {anime.title}
      </h1>

      <div className="max-w-2xl mx-auto md:mx-0">
        <p
          ref={descriptionRef}
          className={`text-sm md:text-base drop-shadow-md leading-relaxed transition-all duration-300 ${
            expanded ? "" : "line-clamp-6"
          }`}
        >
          {anime.description}
        </p>

        {isOverflowing && (
          <button
            className="text-primary mt-2 text-sm focus:outline-none"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Sembunyikan" : "Lihat selengkapnya"}
          </button>
        )}
      </div>
    </header>
  );
};

export default AnimeDescription;
