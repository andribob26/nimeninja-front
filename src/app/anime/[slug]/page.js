import { fetchWithRevalidate } from "@/lib/fetcher";
import AnimePage from "./page/[page]/page";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { slug } = params;
  let anime;
  try {
    const res = await fetchWithRevalidate(`/media/${slug}`, {});
    anime = res.data;
  } catch (error) {
    return {
      title: "Anime tidak ditemukan - NimeNinja",
      description: "Anime yang Anda cari tidak tersedia di NimeNinja.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `Nonton ${anime.title} Sub Indo Episode Lengkap - NimeNinja`;
  const description =
    anime.synopsis?.substring(0, 160) ||
    "Streaming anime subtitle Indonesia kualitas HD hanya di NimeNinja.";
  const image =
    `/files/${anime.coverImage.folder}/${anime.coverImage.fileName}?h=400` ||
    `${process.env.NEXT_PUBLIC_SITE_URL}/default-og.jpg`;
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/anime/${slug}`;

  return {
    title,
    description,
    keywords: [
      anime.title,
      `${anime.title} sub indo`,
      `Nonton ${anime.title} full episode`,
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
          url: `${process.env.API_BASE_URL}${image}`,
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
      images: [`${process.env.API_BASE_URL}${image}`],
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


export default async function AnimeDefaultPage({ params }) {
  let anime;
  try {
    const res = await fetchWithRevalidate(`/media/${params.slug}`, {});
    anime = res.data;
  } catch (error) {
    console.error("Anime by slug fetch error:", error);
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TVSeries",
            name: anime.title,
            description: anime.synopsis,
            image: `${process.env.API_BASE_URL}/files/${anime.coverImage.folder}/${anime.coverImage.fileName}?h=400`,
            genre: anime.genre.map((g) => g.name),
            datePublished: anime.lastEpisodeAt || new Date().toISOString(),
          }),
        }}
      />
      <AnimePage params={{ ...params, page: "1" }} />
    </>
  );
}
