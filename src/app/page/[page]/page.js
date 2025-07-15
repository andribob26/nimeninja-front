import React from "react";
import Image from "next/image";
import { fetchWithRevalidate } from "@/lib/fetcher";
import Link from "next/link";
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightDownLine,
  RiArrowRightSLine,
  RiPlayLargeLine,
} from "react-icons/ri";
import { notFound } from "next/navigation";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const res = await fetchWithRevalidate("/episodes", {
      page: 1,
      limit: 500,
      orderDirection: "DESC",
    });

    const totalPages =
      Math.ceil(res.pagination?.total / res.pagination?.limit) || 1;
    const pages = Array.from({ length: totalPages }, (_, i) => ({
      page: `${i + 1}`,
    }));
    return pages;
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}

const paramsOngoingAnime = {
  page: 1,
  limit: 10,
  search: "",
  orderBy: "latestAiredAt",
  orderDirection: "ASC",
  statusName: "Ongoing",
};

const paramsCompletedAnime = {
  page: 1,
  limit: 10,
  search: "",
  orderBy: "latestAiredAt",
  orderDirection: "ASC",
  statusName: "Completed",
};

const paramsLastEpisodeAnime = {
  limit: 8,
  search: "",
  orderBy: "airedAt",
  orderDirection: "DESC",
};

const HomePage = async ({ params }) => {
  const page = parseInt(params.page || "1");
  if (isNaN(page) || page < 1) notFound();

  let lastEpisodeAnime = [];
  let paginationLastEpisode = {
    total: 0,
    page: 1,
    limit: 8,
    lastPage: 1,
    next: null,
    prev: null,
  };
  let animeOngoing = [];
  let animeCompleted = [];

  try {
    const resLastEpisodeAnime = await fetchWithRevalidate("/episodes", {
      page: page,
      ...paramsLastEpisodeAnime,
    });
    lastEpisodeAnime = resLastEpisodeAnime.data;
    paginationLastEpisode = resLastEpisodeAnime.pagination;
  } catch (error) {
    console.error(`Last episode failed to fetch:`, error);
    return notFound();
  }

  try {
    const resAnimeOngoing = await fetchWithRevalidate(
      "/media",
      paramsOngoingAnime
    );

    animeOngoing = resAnimeOngoing.data;
  } catch (error) {
    console.error(`Anime ongoing failed to fetch:`, error);
    return notFound();
  }

  try {
    const resAnimeCompleted = await fetchWithRevalidate(
      "/media",
      paramsCompletedAnime
    );
    animeCompleted = resAnimeCompleted.data;
  } catch (error) {
    console.error(`Anime completed failed to fetch:`, error);
    return notFound();
  }

  return (
    <>
      <section className="px-6 md:px-10 mb-6 md:mb-10 mt-20 md:mt-24">
        <header>
          <h2
            id="last-episode"
            className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 inline-block"
          >
            Episode Terbaru
            <span className="block mt-2 w-full h-[3px] bg-orange-500"></span>
          </h2>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {lastEpisodeAnime.length > 0 ? (
            lastEpisodeAnime.map((ep) => (
              <Link
                href={`/watch/${ep.media.slug}/episode/${ep.episodeNumber}`}
                key={ep.id}
              >
                <article
                  key={ep.id}
                  className="group cursor-pointer relative overflow-hidden rounded-sm"
                >
                  <div className="aspect-[16/9] w-full relative rounded-sm overflow-hidden">
                    <Image
                      src={`/${ep.video.thumbnailObject}`}
                      alt={`Episode ${ep.episodeNumber}`}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />

                    {/* Label info di bawah kiri */}
                    <div className="absolute bottom-0 left-0 text-sm px-2 py-0.5 bg-gray-700/70">
                      Episode {ep.episodeNumber}
                    </div>

                    {/* Tanggal rilis di bawah kanan */}
                    <div className="absolute bottom-0 right-0 text-sm px-2 py-0.5 bg-gray-700/70">
                      {ep.duration}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-dark/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm transition-opacity">
                      <div className="group-hover:scale-110 transition-all duration-200">
                        <RiPlayLargeLine className="h-10 w-10 md:h-16 md:w-16" />
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-1 font-semibold text-sm md:text-base">
                    {ep.media.title}
                  </h3>
                </article>
              </Link>
            ))
          ) : (
            <span>Belum ada episode</span>
          )}
        </div>
        {paginationLastEpisode.lastPage > 1 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-4">
            {/* Teks halaman */}
            <div className="flex-1 text-sm md:text-base text-center md:text-right">
              Halaman {paginationLastEpisode.page} dari{" "}
              {paginationLastEpisode.lastPage}
            </div>

            {/* Pagination */}
            <div className="flex justify-center md:justify-end gap-2 md:gap-4 flex-wrap text-xs md:text-base">
              {/* Tombol ke halaman pertama */}
              {paginationLastEpisode.page > 3 && (
                <Link
                  href={`/`}
                  className="px-2 py-1 md:px-3 md:py-2 flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                >
                  <RiArrowLeftDoubleLine className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              )}

              {/* Tombol Previous */}
              {paginationLastEpisode.page > 1 && (
                <Link
                  href={
                    paginationLastEpisode.page === 2
                      ? `/`
                      : `/page/${paginationLastEpisode.page - 1}`
                  }
                  className="px-2 py-1 md:px-3 md:py-2 flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                >
                  <RiArrowLeftSLine className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              )}

              {/* Nomor halaman */}
              {Array.from({ length: 5 }, (_, i) => {
                const startPage = Math.max(
                  1,
                  Math.min(
                    paginationLastEpisode.page - 2,
                    paginationLastEpisode.lastPage - 4
                  )
                );
                const page = startPage + i;
                return page <= paginationLastEpisode.lastPage ? (
                  <Link
                    key={page}
                    href={page === 1 ? "/" : `/page/${page}`}
                    className={`px-2 py-1 md:px-4 md:py-2 ${
                      page === paginationLastEpisode.page
                        ? "bg-white text-black font-bold border"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {page}
                  </Link>
                ) : null;
              })}

              {/* Tombol Next */}
              {paginationLastEpisode.page < paginationLastEpisode.lastPage && (
                <Link
                  href={`/page/${paginationLastEpisode.page + 1}`}
                  className="px-2 py-1 md:px-3 md:py-2 flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                >
                  <RiArrowRightSLine className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              )}

              {/* Tombol ke halaman terakhir */}
              {paginationLastEpisode.page <
                paginationLastEpisode.lastPage - 2 && (
                <Link
                  href={`/page/${paginationLastEpisode.lastPage}`}
                  className="px-2 py-1 md:px-3 md:py-2 flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                >
                  <RiArrowRightDoubleLine className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              )}
            </div>
          </div>
        )}
      </section>
      <section
        aria-labelledby="currently-airing"
        className="px-6 md:px-10 mb-6 md:mb-10"
      >
        <header className="flex items-center justify-between mb-6">
          <h2
            id="anime-ongoing"
            className="text-lg sm:text-xl md:text-2xl font-semibold inline-block"
          >
            Sedang Tayang
            <span className="block mt-2 w-full h-[3px] bg-orange-500"></span>
          </h2>
          <Link
            href={`/anime/status/ongoing`}
            className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-sm transition-all duration-200"
          >
            Lihat Lainnya
          </Link>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {animeOngoing.map((item, index) => (
            <Link key={item.id} href={`/anime/${item.slug}`} passHref>
              <article
                key={item.id}
                className="relative rounded overflow-hidden group cursor-pointer transition-all duration-300"
              >
                <div className="p-[1px] rounded transition-all duration-300 group-hover:border-image-glow">
                  <div className="aspect-[2/3] w-full relative overflow-hidden rounded-sm">
                    <Image
                      src={`/files/${item.coverImage.folder}/${item.coverImage.fileName}?h=400`}
                      alt={item.coverImage.fileName}
                      fill
                      sizes="(min-width: 1280px) 256px, (min-width: 768px) 20vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-center px-4 font-semibold">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
                <h3 className="mt-1 font-semibold text-sm md:text-base">
                  {item.title}
                </h3>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="completed-anime"
        className="px-6 md:px-10 mb-6 md:mb-10"
      >
        <header className="flex items-center justify-between mb-6">
          <h2
            id="anime-completed"
            className="text-lg sm:text-xl md:text-2xl font-semibold inline-block"
          >
            Anime Selesai
            <span className="block mt-2 w-full h-[3px] bg-orange-500"></span>
          </h2>
          <Link
            href={`/anime/status/completed`}
            className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-sm transition-all duration-200"
          >
            Lihat Lainnya
          </Link>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {animeCompleted.map((item, index) => (
            <Link key={item.id} href={`/anime/${item.slug}`} passHref>
              <article
                key={item.id}
                className="relative rounded overflow-hidden group cursor-pointer transition-all duration-300"
              >
                <div className="p-[1px] rounded transition-all duration-300 group-hover:border-image-glow">
                  <div className="aspect-[2/3] w-full relative overflow-hidden rounded-sm">
                    <Image
                      src={`/files/${item.coverImage.folder}/${item.coverImage.fileName}?h=400`}
                      alt={item.coverImage.fileName}
                      fill
                      sizes="(min-width: 1280px) 256px, (min-width: 768px) 20vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-center px-4 font-semibold">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
                <h3 className="mt-1 font-semibold text-sm md:text-base">
                  {item.title}
                </h3>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
