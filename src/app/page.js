import HomePage from "./page/[page]/page";

// SEO metadata khusus halaman home

const title = `NimeNinja - Nonton Anime Sub Indo Gratis & Terlengkap Kualitas HD`;
const description =
  "NimeNinja adalah tempat terbaik untuk streaming anime sub indo gratis tanpa iklan. Nikmati anime populer seperti One Piece, Boruto, Jujutsu Kaisen, Demon Slayer, Attack on Titan, Naruto, Bleach, Tokyo Revengers, My Hero Academia, Spy x Family, Chainsaw Man, dan banyak lagi. Tersedia anime ongoing dan completed dengan kualitas HD, update cepat setiap hari, dan tampilan nyaman di semua perangkat.";
const image = "nanti";
const url = `${process.env.NEXT_PUBLIC_SITE_URL}`;

export const metadata = {
  title,
  description,
  keywords: [
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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL
  ),
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
        alt: `NimeNinja - Nonton Anime Sub Indo Gratis`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}${image}`],//gambar
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

const HomeDefaultPage = async () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "NimeNinja",
            url: process.env.NEXT_PUBLIC_SITE_URL,
            description,
            potentialAction: {
              "@type": "SearchAction",
              target:
                (process.env.NEXT_PUBLIC_SITE_URL) +
                "/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <HomePage params={{ page: "1" }} />
    </>
  );
};

export default HomeDefaultPage;
