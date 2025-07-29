import React from "react";
import AnimeGenrePage from "../[genre]/page/[page]/page"
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export async function generateMetadata({ params }) {
  const { genre } = params;
  const genreName = capitalize(genre);

  const title = `Nonton Anime Genre ${genreName} Sub Indo Terbaru - NimeNinja`;
  const description = `Streaming anime genre ${genreName} subtitle Indonesia lengkap dan kualitas HD. Koleksi terbaik anime ${genreName} hanya di NimeNinja.`;

  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/genre/${genre}`;
  const image = "/default-og.jpg";

  return {
    title,
    description,
    keywords: [
      `Anime genre ${genreName}`,
      `Nonton anime ${genreName} sub indo`,
      `Streaming anime genre ${genreName}`,
      "Nonton anime sub indo",
      "Streaming anime gratis",
      "Anime subtitle Indonesia",
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
      type: "website",
      locale: "id_ID",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: `Cover koleksi anime genre ${genreName}`,
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

const GenreDefaultPage = ({ params }) => {
  const genre = capitalize(params.genre);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Anime Genre ${genre} Sub Indo`,
            description: `Kumpulan anime genre ${genre} subtitle Indonesia terbaru di NimeNinja.`,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/genre/${genre}`,
          }),
        }}
      />
      <AnimeGenrePage params={{ ...params, page: "1" }} />
    </>
  );
};

export default GenreDefaultPage;
