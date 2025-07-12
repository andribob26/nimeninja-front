import React from "react";
import { notFound } from "next/navigation";
import { fetchWithRevalidate } from "@/lib/fetcher";
import HlsPlayer from "@/components/HlsPlayer";
import { RiPlayLargeLine } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import formatDate from "@/utils/formatDate";

export const dynamicParams = true;

// Opsi revalidate halaman ini setiap 1 jam agar tetap fresh
// export const revalidate = 3600; // optional

export async function generateStaticParams() {
  try {
    const res = await fetchWithRevalidate("/media", { page: 1, limit: 20 }); // Limit untuk mencegah OOM
    const mediaList = res.data;

    const params = [];

    for (const media of mediaList) {
      const epRes = await fetchWithRevalidate("/episodes", {
        mediaId: media.id,
        page: 1,
        limit: 10,
        orderBy: "episodeNumber",
        orderDirection: "DESC",
      });

      for (const ep of epRes.data) {
        params.push({
          slug: media.slug,
          episodeNumber: ep.episodeNumber.toString(),
        });
      }
    }

    return params;
  } catch (err) {
    console.error("generateStaticParams error:", err);
    return [];
  }
}

const WatchEpisode = async ({ params }) => {
  const { slug, episodeNumber } = params;

  let episode;
  let episodes = [];
  let urlVideo;

  try {
    const res = await fetchWithRevalidate("/episodes", {
      mediaSlug: slug,
      episodeNumber,
    });

    episode = res.data?.[0];
    if (!episode) return notFound();

    urlVideo = episode.video.hlsObject;
  } catch (err) {
    console.error("Fetch episode error:", err);
    return notFound();
  }

  try {
    const res = await fetchWithRevalidate("/episodes", {
      mediaSlug: slug,
      episodeNumber,
      limit: 8,
      aroundEpisode: true,
    });
    episodes = res.data;
    if (!episodes) return notFound();
  } catch (err) {
    console.error(`Failed to fetch surrounding episodes:`, err);
    return notFound();
  }

  return (
    <>
      <section
        aria-labelledby="episode-player"
        className="w-full max-w-7xl mx-auto aspect-video rounded-sm overflow-hidden mt-24 mb-10 space-y-3"
      >
        <h4 className="text-left text-xl md:text-2xl font-bold drop-shadow-lg leading-snug">
          {`${episode.media.title} - Episode ${episode.episodeNumber}`}
        </h4>
        <HlsPlayer src={urlVideo} thumbnail={episode.video.thumbnailObject} />
      </section>
      <section aria-labelledby="other-episode" className="px-10 mb-8">
        <header>
          <h2
            id="other-episode"
            className="text-xl font-semibold mb-6 inline-block"
          >
            Episode Lainnya
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
                    Episode {ep.episodeNumber}
                  </div>

                  {/* Tanggal rilis di bawah kanan */}
                  <div className="absolute bottom-0 right-0 text-sm text-white px-2 py-0.5 bg-gray-700/70">
                    {ep.duration}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default WatchEpisode;
