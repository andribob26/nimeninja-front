"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Thumnail from "../../../../public/assets/images/thumbnail.jpg";
import { useRouter, useSearchParams } from "next/navigation";

const EpisodeAnimeList = ({ slug }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [episodes, setEpisodes] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    lastPage: 1,
  });

  // Ambil dan validasi page dari URL
  const rawPage = searchParams.get("page");
  const page = Math.max(1, parseInt(rawPage || "1", 10) || 1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWithRevalidate("/episodes", {
          page: 1,
          limit: 20,
          orderDirection: "DESC",
        });

        // Cek jika page > lastPage dari server
        if (page > res.data.pagination?.lastPage) {
          // Redirect ke 404
          router.push("/not-found"); // atau gunakan `notFound()` dari next/navigation jika SSR
          return;
        }

        setEpisodes(data.data || []);
        setPagination({
          page: data.pagination?.page || 1,
          lastPage: data.pagination?.lastPage || 1,
        });
      } catch (err) {
        console.error("Gagal fetch episode:", err);
      }
    };

    fetchData();
  }, [page]);

  const handleChangePage = (newPage) => {
    if (isNaN(newPage) || newPage < 1 || newPage > pagination.lastPage) return;
    router.push(`/anime/${slug}?page=${newPage}`);
  };

  return (
    <>
      {/* Episode Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-6">
        {episodes.map((ep) => (
          <article
            key={ep.id}
            className="relative rounded overflow-hidden group cursor-pointer transition-all duration-300"
          >
            <div className="p-[1px] rounded transition-all duration-300 group-hover:border-image-glow">
              <div className="aspect-[16/9] w-full relative overflow-hidden rounded-sm">
                <Image
                  src={Thumnail}
                  alt={`Episode ${ep.id} cover`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-dark/70 backdrop-blur-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-center px-4">
                    Episode {ep.episodeNumber}.
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => handleChangePage(page - 1)}
          disabled={page <= 1}
          className={`px-4 py-2 bg-gray-700 rounded ${
            page <= 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
          }`}
        >
          Previous
        </button>

        <span className="self-center">
          Page {page} of {pagination.lastPage}
        </span>

        <button
          onClick={() => handleChangePage(page + 1)}
          disabled={page >= pagination.lastPage}
          className={`px-4 py-2 bg-gray-700 rounded ${
            page >= pagination.lastPage
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-600"
          }`}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default EpisodeAnimeList;
