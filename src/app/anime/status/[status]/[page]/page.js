import { fetchWithRevalidate } from "@/lib/fetcher";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

export const dynamicParams = true;

export async function generateStaticParams() {
  const res = await fetchWithRevalidate("/media", {
    page: 1,
    limit: 500,
    orderDirection: "ASC",
  });

  const totalPages =
    Math.ceil(res.pagination?.total / res.pagination?.limit) || 1;
  const pages = Array.from({ length: totalPages }, (_, i) => ({
    page: `${i + 1}`,
  }));

  return pages;
}

const paramsStatusAnime = {
  limit: 20,
  search: "",
  orderBy: "latestAiredAt",
  orderDirection: "ASC",
};

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const AnimeStatusPage = async ({ params }) => {
  const { status, page } = params;
  const statusName = capitalize(status);
  const pageNumber = parseInt(page || "1");
  if (isNaN(pageNumber) || pageNumber < 1) notFound();
  let animes = [];
  let pagination = {
    total: 0,
    page: 1,
    limit: 20,
    lastPage: 1,
    next: null,
    prev: null,
  };

  try {
    const resAnimeStatus = await fetchWithRevalidate("/media", {
      page: pageNumber,
      statusName: statusName,
      ...paramsStatusAnime,
    });
    animes = resAnimeStatus.data;
    pagination = resAnimeStatus.pagination;
  } catch (err) {
    console.error(`Failed to fetch:`, err);
    return notFound();
  }

  console.log(pagination);

  return (
    <>
      <section
        aria-labelledby="completed-anime"
        className="px-6 md:px-10 mb-6 md:mb-10 mt-20 md:mt-24"
      >
        <header className="flex items-center justify-between mb-6">
          <h2
            id={`anime-${status}`}
            className="text-lg sm:text-xl md:text-2xl font-semibold inline-block"
          >
            {status === "ongoing" ? "Sedang Tayang" : "Anime Selesai"}
            <span className="block mt-2 w-full h-[3px] bg-orange-500"></span>
          </h2>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {animes.map((item, index) => (
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
        {pagination.lastPage > 1 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-4">
            {/* Teks halaman */}
            <div className="flex-1 text-sm md:text-base text-center md:text-right">
              Halaman {pagination.page} dari {pagination.lastPage}
            </div>

            {/* Pagination */}
            <div className="flex justify-center md:justify-end gap-2 md:gap-4 flex-wrap text-xs md:text-base">
              {/* Tombol ke halaman pertama */}
              {pagination.page > 3 && (
                <Link
                  href={`/`}
                  className="px-2 py-1 md:px-3 md:py-2 flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                >
                  <RiArrowLeftDoubleLine className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              )}

              {/* Tombol Previous */}
              {pagination.page > 1 && (
                <Link
                  href={
                    pagination.page === 2 ? `/` : `/page/${pagination.page - 1}`
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
                  Math.min(pagination.page - 2, pagination.lastPage - 4)
                );
                const page = startPage + i;
                return page <= pagination.lastPage ? (
                  <Link
                    key={page}
                    href={page === 1 ? "/" : `/page/${page}`}
                    className={`px-2 py-1 md:px-4 md:py-2 ${
                      page === pagination.page
                        ? "bg-white text-black font-bold border"
                        : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {page}
                  </Link>
                ) : null;
              })}

              {/* Tombol Next */}
              {pagination.page < pagination.lastPage && (
                <Link
                  href={`/page/${pagination.page + 1}`}
                  className="px-2 py-1 md:px-3 md:py-2 flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                >
                  <RiArrowRightSLine className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              )}

              {/* Tombol ke halaman terakhir */}
              {pagination.page < pagination.lastPage - 2 && (
                <Link
                  href={`/page/${pagination.lastPage}`}
                  className="px-2 py-1 md:px-3 md:py-2 flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                >
                  <RiArrowRightDoubleLine className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              )}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default AnimeStatusPage;
