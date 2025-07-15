import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchWithRevalidate } from "@/lib/fetcher";
import Link from "next/link";
import RelatedAnimeSlider from "../../RelatedAnimeSlider";
import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiPlayLargeLine,
} from "react-icons/ri";
import AnimeDescription from "./AnimeDescription";

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const res = await fetchWithRevalidate("/media", {
      page: 1,
      limit: 500,
      orderDirection: "DESC",
    });

    const params = res.data.map((anime) => ({ slug: anime.slug, page: "1" }));
    return params;
  } catch (err) {
    console.error("generateStaticParams error:", err);
    return [];
  }
}

const paramsEpisodeAnime = {
  limit: 20,
  search: "",
  orderBy: "episodeNumber",
  orderDirection: "DESC",
};

const paramsAnimeRelate = {
  page: 1,
  limit: 10,
  orderDirection: "ASC",
};

export default async function AnimePage({ params }) {
  const { slug, page } = params;
  const pageNumber = Number(page || 1);
  if (isNaN(pageNumber) || pageNumber < 1) notFound();

  let anime;
  let episodes = [];
  let pagination = {
    total: 0,
    page: pageNumber,
    limit: 20,
    lastPage: 1,
    next: null,
    prev: null,
  };
  let animeRelate = [];

  try {
    const res = await fetchWithRevalidate(`/media/${slug}`, {});
    anime = res.data;
  } catch {
    console.error("Anime by slug fetch error:", err);
    notFound();
  }
  try {
    const resEpisodes = await fetchWithRevalidate(`/episodes`, {
      ...paramsEpisodeAnime,
      page: pageNumber,
      mediaId: anime.id,
    });
    episodes = resEpisodes.data;
    pagination = resEpisodes.pagination;
  } catch (err) {
    console.error("Episode fetch error:", err);
    notFound();
  }
  try {
    const title = anime.title;
    const studio = anime.studio;
    const genres = anime.genre.map((g) => g.name);
    const resAnimeRelate = await fetchWithRevalidate(`/media`, {
      ...paramsAnimeRelate,
      search: title,
      studio: studio,
      genres: genres,
    });
    const filterAnimeRelate = resAnimeRelate.data.filter(
      (item) => item.slug !== slug
    );
    animeRelate = filterAnimeRelate;
  } catch (err) {
    console.error("Anime Relate fetch error:", err);
    notFound(); 
  }

  return (
    <>
      {/* Header Section */}
      <div className="relative w-full min-h-[620px] overflow-hidden rounded shadow-lg flex flex-col mb-6 md:mb-10 mt-20 md:mt-24">
        <p>{`/files/${anime.heroImage.folder}/${anime.heroImage.fileName}?h=400`}</p>
        <Image
          src={`/files/${anime.heroImage.folder}/${anime.heroImage.fileName}?h=400`}
          alt={anime.heroImage.fileName}
          priority
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_40%,#070710_100%)]" />
        </div>
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="w-full h-full bg-gradient-to-t from-dark/100 via-dark/60 to-transparent" />
        </div>

        <section className="relative z-30 px-4 md:px-10 pb-10 flex-grow flex items-end">
          <div className="flex flex-col md:flex-row items-stretch gap-6 max-w-7xl mx-auto w-full">
            <figure className="relative w-full max-w-[250px] h-[375px] flex-shrink-0 rounded overflow-hidden shadow-lg mx-auto md:mx-0 bg-neutral-800">
              <Image
                src={`/files/${anime.coverImage.folder}/${anime.coverImage.fileName}?h=400`}
                alt={anime.coverImage.fileName}
                fill
                sizes="(min-width: 768px) 250px, 100vw"
                className="object-cover"
              />
            </figure>

            <div className="flex flex-col justify-between flex-1 text-left">
              <AnimeDescription anime={anime} />

              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-6 text-xs sm:text-sm md:text-base text-left max-w-2xl mx-auto md:mx-0 pt-6">
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Season:</dt>
                  <dd className="text-white/60 ">{anime.season.name}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Year:</dt>
                  <dd className="text-white/60">{anime.year}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Format:</dt>
                  <dd className="text-white/60 ">{anime.type.name}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Studio:</dt>
                  <dd className="text-white/60">{anime.studio}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Score:</dt>
                  <dd className="text-yellow-400 font-semibold">
                    {anime.score ? parseFloat(anime.score).toFixed(1) : "-"}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Status:</dt>
                  <dd className="text-green-400 font-semibold">
                    {anime.status.name}
                  </dd>
                </div>
                <div className="col-span-3 grid grid-cols-[auto_1fr] gap-x-2 pt-1">
                  <dt className="font-semibold whitespace-nowrap">Genre:</dt>
                  <dd className="flex flex-wrap gap-2 text-white/60 ">
                    {anime.genre.map((genre, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-xs sm:text-sm px-2 py-0.5 whitespace-nowrap select-none"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </div>

      {/* Episode List */}
      <section className="px-6 md:px-10 mb-6 md:mb-10">
        <header>
          <h2
            id="anime-episode"
            className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 inline-block"
          >
            Episode
            <span className="block mt-2 w-full h-[3px] bg-orange-500"></span>
          </h2>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {episodes.length > 0 ? (
            episodes.map((ep) => (
              <Link
                href={`/watch/${slug}/episode/${ep.episodeNumber}`}
                key={ep.id}
              >
                <article
                  key={ep.id}
                  className="group cursor-pointer relative overflow-hidden rounded"
                >
                  <div className="aspect-[16/9] w-full relative rounded-sm overflow-hidden">
                    <Image
                      src={`/${ep.video.thumbnailObject}`}
                      alt={`Episode ${ep.episodeNumber}`}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-dark/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-sm transition-opacity">
                      <div className="group-hover:scale-110 transition-all duration-200">
                        <RiPlayLargeLine className="h-10 w-10 md:h-16 md:w-16" />
                      </div>
                    </div>

                    {/* Label info di bawah kiri */}
                    <div className="absolute bottom-0 left-0 text-sm px-2 py-0.5 bg-gray-700/70">
                      Episode {ep.episodeNumber}
                    </div>

                    {/* Tanggal rilis di bawah kanan */}
                    <div className="absolute bottom-0 right-0 text-sm px-2 py-0.5 bg-gray-700/70">
                      {ep.duration}
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <span>Belum ada episode</span>
          )}
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
                  href={`/anime/${slug}`}
                  className="px-2 py-1 md:px-3 md:py-2 flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                >
                  <RiArrowLeftDoubleLine className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              )}

              {/* Tombol Previous */}
              {pagination.page > 1 && (
                <Link
                  href={
                    pagination.page === 2
                      ? `/anime/${slug}`
                      : `/anime/${slug}/page/${pagination.page - 1}`
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
                    href={
                      page === 1
                        ? `/anime/${slug}`
                        : `/anime/${slug}/page/${page}`
                    }
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
                  href={`/anime/${slug}/page/${pagination.page + 1}`}
                  className="px-2 py-1 md:px-3 md:py-2 flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                >
                  <RiArrowRightSLine className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              )}

              {/* Tombol ke halaman terakhir */}
              {pagination.page < pagination.lastPage - 2 && (
                <Link
                  href={`/anime/${slug}/page/${pagination.lastPage}`}
                  className="px-2 py-1 md:px-3 md:py-2 flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                >
                  <RiArrowRightDoubleLine className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Related */}
      <section className="px-6 md:px-10 mb-6 md:mb-10">
        <header>
          <h2
            id="anime-related"
            className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 inline-block"
          >
            Anime Terkait
            <span className="block mt-2 w-full h-[3px] bg-orange-500"></span>
          </h2>
        </header>
        <RelatedAnimeSlider data={animeRelate} />
      </section>
    </>
  );
}
