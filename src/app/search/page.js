import React from "react";
import SearchPage from "./page/[page]/page";

export const metadata = {
  title: "Cari Anime Sub Indo Terlengkap - NimeNinja",
  description:
    "Temukan anime favoritmu dengan mudah. Cari anime sub Indo lengkap, ongoing, dan terbaru hanya di NimeNinja.",
  keywords: [
    "cari anime",
    "pencarian anime sub indo",
    "nonton anime sub indo",
    "anime terbaru",
    "anime subtitle indonesia",
    "anime ongoing",
    "anime HD",
    "anime gratis",
    "nonton anime tanpa iklan",
    "samehadaku",
    "otakudesu",
    "anoboy",
    "nanime",
    "nimegami",
    "nimeninja",
    "streaming anime 2025",
    "anime sub indo lengkap",
    "nonton anime kualitas tinggi",
    "anime batch sub indo",
    "download anime sub indo",
    "anime populer",
    "anime legal",
    "tempat nonton anime subtitle indonesia",
    "nonton boruto sub indo",
    "nonton one piece sub indo",
    "nonton jujutsu kaisen sub indo",
    "nonton kimetsu no yaiba sub indo",
    "nonton attack on titan sub indo",
    "anime iQIYI",
    "anime Bstation",
    "anime Netflix",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/search`,
  },
  openGraph: {
    title: "Cari Anime Sub Indo Terlengkap - NimeNinja",
    description:
      "Temukan anime favoritmu dengan mudah. Cari anime sub Indo lengkap, ongoing, dan terbaru dengan kualitas HD hanya di NimeNinja.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/search`,
    siteName: "NimeNinja",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/default-og.jpg`,
        width: 1200,
        height: 630,
        alt: "Cari Anime Sub Indo - NimeNinja",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cari Anime Sub Indo Terlengkap - NimeNinja",
    description:
      "Cari dan temukan anime sub Indo favoritmu, lengkap dan gratis di NimeNinja.",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/default-og.jpg`],
    site: "@nimeninja",
    creator: "@nimeninja",
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
      maxImagePreview: "large",
    },
  },
  other: {
    "theme-color": "#FF7F11",
    "twitter:site": "@nimeninja",
    "twitter:creator": "@nimeninja",
  },
};

const SearchDefaultPage = ({ searchParams }) => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SearchResultsPage",
            name: "Hasil Pencarian Anime - NimeNinja",
            description:
              "Halaman hasil pencarian anime subtitle Indonesia terbaru dan terlengkap di NimeNinja.",
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/search`,
          }),
        }}
      />
      <SearchPage params={{ page: "1" }} searchParams={searchParams} />
    </>
  );
};

export default SearchDefaultPage;
