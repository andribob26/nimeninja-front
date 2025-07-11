import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchWithRevalidate } from "@/lib/fetcher";
import Link from "next/link";
import RelatedAnimeSlider from "../../RelatedAnimeSlider";
import { Fragment } from "react";
import { RiPlayLargeLine } from "react-icons/ri";

export const dynamicParams = true;

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }); // Hasil: 7 Juli 2025
};

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

export default async function AnimePage({ params }) {
  const { slug, page } = params;
  const pageNumber = Number(page || 1);
  if (isNaN(pageNumber) || pageNumber < 1) notFound();

  let anime;
  try {
    const res = await fetchWithRevalidate(`/media/${slug}`, {});
    anime = res.data;
  } catch {
    notFound();
  }

  let episodes = [];
  let pagination = {
    total: 0,
    page: pageNumber,
    limit: 20,
    lastPage: 1,
    next: null,
    prev: null,
  };

  try {
    const resEpisodes = await fetchWithRevalidate(`/episodes`, {
      ...paramsEpisodeAnime,
      page: pageNumber,
      mediaId: anime.id,
    });

    episodes = resEpisodes.data;
    pagination = resEpisodes.pagination;

    if (!episodes.length || pageNumber > pagination.lastPage) {
      notFound(); // 👈 tetap di sini
    }
  } catch (err) {
    console.error("Episode fetch error:", err);
    notFound(); // 👈 pastikan ini ada juga
  }

  return (
    <>
      {/* Header Section */}
      <div className="relative w-full min-h-[620px] overflow-hidden rounded shadow-lg flex flex-col mb-10 mt-24">
        <p className="text-white">{`/files/${anime.heroImage.folder}/${anime.heroImage.fileName}?h=400`}</p>
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

        <section className="relative z-30 px-4 md:px-10 py-10 flex-grow flex items-end">
          <div className="flex flex-col md:flex-row items-stretch gap-6 max-w-7xl mx-auto text-white w-full">
            <figure className="relative w-full max-w-[250px] aspect-[2/3] flex-shrink-0 rounded overflow-hidden shadow-lg mx-auto md:mx-0">
              <Image
                src={`/files/${anime.coverImage.folder}/${anime.coverImage.fileName}?h=400`}
                alt={anime.coverImage.fileName}
                fill
                sizes="(min-width: 768px) 250px, 100vw"
                className="object-cover"
              />
            </figure>

            <div className="flex flex-col justify-between flex-1 text-left">
              <header className="space-y-3">
                <h1 className="text-center md:text-left text-3xl md:text-4xl font-bold drop-shadow-lg leading-snug">
                  {anime.title}
                </h1>

                <p className="text-sm md:text-base drop-shadow-md leading-relaxed max-w-2xl mx-auto md:mx-0">
                  {anime.description
                    .match(/[^.]+(?:\.(?!\s[a-z]))?/g)
                    ?.map((sentence, index) => (
                      <Fragment key={index}>
                        {sentence.trim()} <br />
                      </Fragment>
                    ))}
                </p>
              </header>

              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-6 text-xs sm:text-sm md:text-base text-left max-w-2xl mx-auto md:mx-0 pt-6">
                <div className="flex gap-2">
                  <dt className="font-semibold text-white/90 whitespace-nowrap">
                    Season:
                  </dt>
                  <dd className="text-gray-300">{anime.season.name}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Year:</dt>
                  <dd className="text-gray-300">{anime.year}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Format:</dt>
                  <dd className="text-gray-300">{anime.type.name}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Studio:</dt>
                  <dd className="text-gray-300">{anime.studio}</dd>
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
                  <dt className="font-semibold whitespace-nowrap text-white/90">
                    Genre:
                  </dt>
                  <dd className="flex flex-wrap gap-2 text-gray-300">
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
      <section className="px-10 mb-10">
        <header>
          <h2
            id="anime-episode"
            className="text-xl font-semibold mb-6 inline-block"
          >
            Episode
            <span className="block mt-2 w-full h-[3px] bg-orange-500 rounded-full"></span>
          </h2>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {episodes.map((ep) => (
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
                  <div className="absolute inset-0 bg-dark/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition-opacity">
                    <div className="text-white group-hover:scale-110 transition-all duration-200">
                      <RiPlayLargeLine className="h-10 w-10 md:h-16 md:w-16" />
                    </div>
                  </div>

                  {/* Label info di bawah kiri */}
                  <div className="absolute bottom-0 left-0 text-sm text-white px-2 py-0.5 bg-gray-700/70">
                    Ep {ep.episodeNumber}
                  </div>

                  {/* Tanggal rilis di bawah kanan */}
                  <div className="absolute bottom-0 right-0 text-sm text-white px-2 py-0.5 bg-gray-700/70">
                    {formatDate(ep.airedAt)}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end gap-4 mt-6 text-white">
          {pagination.page > 1 && (
            <Link
              href={`/anime/${slug}/page/${pagination.page - 1}`}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600"
            >
              Previous
            </Link>
          )}
          <span className="self-center">
            Page {pagination.page} of {pagination.lastPage}
          </span>
          {pagination.page < pagination.lastPage && (
            <Link
              href={`/anime/${slug}/page/${pagination.page + 1}`}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600"
            >
              Next
            </Link>
          )}
        </div>
      </section>

      {/* Related */}
      <section className="px-10 mb-8">
        <header>
          <h2
            id="anime-completed"
            className="text-xl font-semibold mb-6 inline-block"
          >
            Anime Terkait
            <span className="block mt-2 w-full h-[3px] bg-orange-500 rounded-full"></span>
          </h2>
        </header>
        <RelatedAnimeSlider />
      </section>
    </>
  );
}
