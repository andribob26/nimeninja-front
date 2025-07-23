"use client";
import React, { useEffect, useRef, useState } from "react";
import ShimmerImage from "./ShimmerImage";
import Link from "next/link";
import { RiSearchLine } from "react-icons/ri";

const InputSearch = () => {
  const searchButtonRef = useRef(null);
  const searchRef = useRef(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        !searchButtonRef.current?.contains(e.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${query}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        setResults(data?.data || []);
        setIsOpen(true);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching search:", err);
        setError("Gagal memuat hasil pencarian.");
        setResults([]);
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <>
      <div className="relative hidden md:block w-80">
        <div className="relative w-full">
          {/* Input + Spinner Container */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari anime..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => setTimeout(() => setIsOpen(false), 200)}
              onFocus={() => query.length > 1 && setIsOpen(true)}
              className="w-full pr-10 px-3 py-2 text-sm rounded-sm border border-white/[0.08] shadow-[inset_2px_4px_16px_0px_#f8f8f80f] backdrop-blur-[20px] bg-[#ffffff14] outline-0 focus:outline-none placeholder-white/60"
            />

            {/* Spinner loading */}
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Dropdown hasil pencarian */}
          {isOpen && results.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 z-10 bg-dark border border-white/[0.1] rounded-sm shadow-lg">
              <ul className="divide-y divide-white/[0.05]">
                {results.map((item) => (
                  <li
                    key={item.id}
                    className="px-3 py-2 text-sm text-white/80 hover:bg-white/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {/* Gambar */}
                      <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                        <ShimmerImage
                          src={`/files/${item.coverImage.folder}/${item.coverImage.fileName}?h=400`}
                          alt={item.coverImage.fileName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>

                      {/* Judul */}
                      <span className="line-clamp-2">
                        {item.title || item.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Link ke semua hasil */}
              <div className="border-t border-white/[0.08]">
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="block text-center text-xs text-orange-500 italic py-2 hover:underline"
                >
                  Lihat semua hasil
                </Link>
              </div>
            </div>
          )}
          {/* Error message */}
          {error && (
            <div className="absolute text-sm text-red-500">{error}</div>
          )}
        </div>
      </div>
      <div className="md:hidden">
        <button
          ref={searchButtonRef}
          onClick={() => {
            setIsSearchOpen((prev) => !prev);
          }}
        >
          <RiSearchLine size={28} />
        </button>
      </div>

      {/* Input & hasil pencarian (mobile only) */}
      <div
        ref={searchRef}
        className={`md:hidden fixed top-16 left-0 right-0 z-[99] px-4 py-3 border-b border-white/[0.08] bg-dark transform transition-all duration-300 ease-in-out ${
          isSearchOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Cari..."
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            onFocus={() => query.length > 1 && setIsOpen(true)}
            className="w-full px-3 py-2 text-sm rounded-sm border border-white/[0.08] shadow-[inset_2px_4px_16px_0px_#f8f8f80f] backdrop-blur-[20px] bg-[#ffffff14] outline-0 focus:outline-none placeholder-white/60"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>

        {/* Contoh hasil pencarian */}
        {isOpen && results.length > 0 && (
          <div className="absolute mt-3 left-0 right-0 z-10 bg-dark border border-white/[0.1] rounded-sm shadow-lg">
            <ul className="divide-y divide-white/[0.05]">
              {results.map((item) => (
                <li
                  key={item.id}
                  className="px-3 py-2 text-sm text-white/80 hover:bg-white/10 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {/* Gambar */}
                    <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                      <ShimmerImage
                        src={`/files/${item.coverImage.folder}/${item.coverImage.fileName}?h=400`}
                        alt={item.coverImage.fileName}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>

                    {/* Judul */}
                    <span className="line-clamp-2">
                      {item.title || item.name}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            {/* Link ke semua hasil */}
            <div className="border-t border-white/[0.08]">
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="block text-center text-xs text-orange-500 italic py-2 hover:underline"
              >
                Lihat semua hasil
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InputSearch;
