import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import { fetchWithRevalidate } from "../../lib/fetcher";

const GenrePage = async () => {
  let genres;

  try {
    const res = await fetchWithRevalidate(`/genres`);
    genres = res.data;
  } catch {
    console.error("Genre fetch error:", err);
    notFound();
  }

  return (
    <section
      aria-labelledby="genre-anime"
      className="px-6 md:px-10 mb-6 md:mb-10 mt-20 md:mt-24"
    >
      <header>
        <h2
          id="genre-anime"
          className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 inline-block"
        >
          Genre
          <span className="block mt-2 w-full h-[3px] bg-primary"></span>
        </h2>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 text-lg">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/genre/${genre.name.toLowerCase()}`}
            className="bg-gray-700 py-2 px-4 rounded-sm hover:bg-primary hover:text-white transition-colors duration-200"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default GenrePage;
