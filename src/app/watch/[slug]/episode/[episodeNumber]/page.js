import React from "react";
import { notFound } from "next/navigation";
import { fetchWithRevalidate } from "../../../../../lib/fetcher";
import { RiPlayLargeLine } from "react-icons/ri";
import Link from "next/link";
// import formatDate from "@/utils/formatDate";
import WatchEpisodeClient from "./WatchEpisodeClient";
import ShimmerImage from "../../../../../components/ShimmerImage";
import PlayerEmbed from "./PlayerEmbed";
import DownloadPage from "./DownloadPage";

export async function generateMetadata({ params }) {
  const { slug, episodeNumber } = params;

  let episode;

  try {
    const res = await fetchWithRevalidate("/episodes", {
      mediaSlug: slug,
      episodeNumber,
    });

    episode = res.data?.[0];
  } catch (error) {
    return {
      title: "Episode tidak ditemukan - NimeNinja",
      description: "Episode yang Anda cari tidak tersedia.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  if (!episode) throw new Error("Episode not found");
  const anime = episode.media;

  const title = `Nonton ${anime.title} Episode ${episode.episodeNumber} Sub Indo - NimeNinja`;
  const description =
    anime.description?.substring(0, 160) ||
    "Streaming anime subtitle Indonesia kualitas HD hanya di NimeNinja.";
  const image = `/${episode.video.thumbnailObject}`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/watch/${slug}/episode/${episode.episodeNumber}`;

  return {
    title,
    description,
    keywords: [
      anime.title,
      `${anime.title} sub indo`,
      `Nonton ${anime.title} episode ${episode.episodeNumber}`,
      "Nonton anime sub indo",
      "Streaming anime gratis",
      "Anime subtitle Indonesia",
      "Anime ongoing terbaru",
      "Anime lengkap kualitas HD",
      "Samehadaku",
      "Otakudesu",
      "Anoboy",
      "Nanime",
      "Nimegami",
      "NimeNinja",
      "Nonton anime 2025",
      "Nonton anime gratis tanpa iklan",
      "Download anime sub indo",
      "Streaming anime Bstation",
      "Anime Muse Indonesia",
      "Nonton anime iQIYI",
      "Nonton anime di Netflix",
      "Anime legal sub indo",
      "Nonton anime terbaru gratis",
      "Streaming anime cepat",
      "Situs nonton anime terbaik",
      "Nonton anime HD 1080p",
      "Nonton Boruto sub indo",
      "Nonton One Piece episode terbaru",
      "Nonton Kimetsu no Yaiba sub indo",
      "Tempat nonton anime subtitle Indonesia",
    ],
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "NimeNinja",
      type: "video.episode",
      locale: "id_ID",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: `Cover ${anime.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${process.env.NEXT_PUBLIC_SITE_URL}${image}`],
      site: "@nimeninja",
      creator: "@nimeninja",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        maxImagePreview: "large",
      },
    },
    other: {
      "theme-color": "#FF7F11",
      "fb:app_id": "123456789",
      "twitter:site": "@nimeninja",
      "twitter:creator": "@nimeninja",
    },
  };
}

export const dynamicParams = true;

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
  let total;
  let episodes = [];
  let urlVideo;

  try {
    const res = await fetchWithRevalidate("/episodes", {
      mediaSlug: slug,
      episodeNumber,
    });

    const resTotal = await fetchWithRevalidate("/episodes/total", {
      mediaSlug: slug,
    });
    episode = res.data?.[0];
    total = resTotal.data;

    if (!episode || !episodes) return notFound();

    urlVideo = episode.video.hlsObject;
  } catch (error) {
    console.error("Episode by slug fetch error:", error);
    return notFound();
  }

  try {
    const resEpisodes = await fetchWithRevalidate("/episodes", {
      mediaSlug: slug,
      episodeNumber,
      limit: 8,
      aroundEpisode: true,
    });
    episodes = resEpisodes.data;
  } catch (error) {
    console.error("Fetch episode error:", error);
    return notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Episode",
            name: `${episode.media.title} Episode ${episode.episodeNumber}`,
            episodeNumber: episode.episodeNumber,
            partOfSeries: {
              "@type": "TVSeries",
              name: episode.media.title,
            },
            description: episode.media.description,
            image: `${process.env.NEXT_PUBLIC_SITE_URL}/${episode.video.thumbnailObject}`,
            datePublished: episode.airedAt || new Date().toISOString(),
          }),
        }}
      />
      {/* <WatchEpisodeClient /> */}
      <section
        aria-labelledby="episode-player"
        className="mt-20 md:mt-24 mb-6 md:mb-10"
      >
        <div className="w-full max-w-7xl mx-auto aspect-video rounded-sm overflow-hidden mb-6">
          <PlayerEmbed
            src={`https://player-hls-three.vercel.app/player/${episode.video.prefix}`}
          />
        </div>

        {/* <a
          href="https://link-to.net/1373195/download/videos/anime/one-piece/21/1751872868639-l1Sdhl-768fb40f-4f0e-4726-a594-917aefc78a68"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Download via Linkvertise
        </a>

        <DownloadVideo video={episode.video} /> */}

        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 md:px-10">
       
        </div> */}

        <div className="mt-4 flex flex-col gap-4 px-6 md:px-10">
          {/* Bagian Judul dan Tombol Download */}
          <div className="flex flex-col gap-4">
            {/* Judul & Tombol Download */}
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-center">
              <div className="flex-1 w-full">
                <h4 className="text-left text-lg sm:text-xl md:text-2xl font-bold drop-shadow-lg leading-snug">
                  {`${episode.media.title} Episode ${episode.episodeNumber}`}
                </h4>
              </div>

              <div className="flex justify-center md:justify-end">
                <DownloadPage
                  slug={slug}
                  episode={episodeNumber}
                  prefix={episode.video.prefix}
                />
              </div>
            </div>

            {/* Tombol Navigasi Episode */}
            <div className="flex justify-center md:justify-end flex-wrap gap-4">
              {episode.episodeNumber > 1 && (
                <Link
                  href={`/watch/${slug}/episode/${episode.episodeNumber - 1}`}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600"
                >
                  Sebelumnya
                </Link>
              )}
              {episode.episodeNumber < total && (
                <Link
                  href={`/watch/${slug}/episode/${episode.episodeNumber + 1}`}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600"
                >
                  Selanjutnya
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="other-episode"
        className="px-6 md:px-10 mb-6 md:mb-10"
      >
        <header className="flex items-center justify-between mb-6">
          <h2
            id="other-episode"
            className="text-lg sm:text-xl md:text-2xl font-semibold inline-block"
          >
            Episode Lainnya
            <span className="block mt-2 w-full h-[3px] bg-orange-500"></span>
          </h2>
          <Link
            href={`/anime/${slug}`}
            className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-sm transition-all duration-200"
          >
            Lihat Lainnya
          </Link>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {episodes.map((ep) => (
            <Link
              href={`/watch/${slug}/episode/${ep.episodeNumber}`}
              key={ep.id}
            >
              <article
                key={ep.id}
                className="group cursor-pointer relative overflow-hidden rounded-sm"
              >
                <div className="aspect-[16/9] w-full relative rounded-sm overflow-hidden">
                  <ShimmerImage
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
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default WatchEpisode;
