import {
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { fetchWithRevalidate } from "../../../../lib/fetcher";
import { notFound } from "next/navigation";
import Link from "next/link";
import ShimmerImage from "../../../../components/ShimmerImage";

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

const SearchPage = async ({ params, searchParams }) => {
  const page = Number(params.page || 1);
  const query = searchParams?.q || "";

  if (isNaN(page) || page < 1) notFound();

  if (!query || query.trim().length < 2) notFound();

  let results = [];
  let pagination = {
    total: 0,
    page,
    limit: 20,
    lastPage: 1,
    next: null,
    prev: null,
  };

  try {
    const res = await fetchWithRevalidate(
      "/media",
      {
        search: query,
        page,
        limit: 20,
        orderDirection: "DESC",
      },
      {
        tags: [`media`],
      }
    );

    results = res.data;
    pagination = res.pagination;
  } catch (err) {
    console.error("❌ SearchPage fetch error:", err);
    notFound();
  }
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
      <section
        aria-labelledby="search-results"
        className="px-6 md:px-10 mb-6 md:mb-10 mt-20 md:mt-24"
      >
        <header>
          <h2
            id="search-results"
            className="text-lg sm:text-xl md:text-2xl font-semibold mb-6 inline-block"
          >
            Hasil pencarian:{" "}
            <span className="text-primary">{query || "(kosong)"}</span>
            <span className="block mt-2 w-full h-[3px] bg-primary"></span>
          </h2>
        </header>

        {results.length === 0 ? (
          <p className="col-span-2 text-white/60">Tidak ada hasil ditemukan.</p>
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {results.map((item) => (
              <li
                key={item.id}
                className="px-3 py-4 text-sm text-white/80 hover:bg-white/10 cursor-pointer transition-all duration-200"
              >
                <Link
                  href={`/anime/${item.slug}`}
                  passHref
                  className="flex items-start gap-4"
                >
                  {/* Poster */}
                  <div className="relative w-20 h-28 md:w-24 md:h-36 flex-shrink-0 rounded overflow-hidden">
                    <ShimmerImage
                      src={`/files/${item.coverImage.folder}/${item.coverImage.fileName}?h=400`}
                      alt={item.coverImage.fileName}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  {/* Detail Info */}
                  <div className="flex flex-col gap-1 flex-1">
                    {/* Title */}
                    <h3 className="text-base md:text-lg font-semibold line-clamp-2">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm md:text-sm">
                      {item.score && (
                        <div className="flex gap-1 text-yellow-400 items-center">
                          <dt className="font-semibold">Score:</dt>
                          <dd>{parseFloat(item.score).toFixed(1)}</dd>
                        </div>
                      )}
                      {item.year && (
                        <div className="flex gap-1 items-center text-white/60">
                          <dt className="font-semibold">Year:</dt>
                          <dd>{item.year}</dd>
                        </div>
                      )}
                    </div>
                    {/* Deskripsi jika ada */}
                    {item.description && (
                      <p className="text-white/60 text-sm md:text-sm line-clamp-3 md:line-clamp-4">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* ///// */}
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
                  href={`/search?q=${encodeURIComponent(query)}`}
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
                      ? `/search?q=${encodeURIComponent(query)}`
                      : `/search/page/${
                          pagination.page - 1
                        }?q=${encodeURIComponent(query)}`
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
                        ? `/search?q=${encodeURIComponent(query)}`
                        : `/search/page/${page}?q=${encodeURIComponent(query)}`
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
                  href={`/search/page/${
                    pagination.page + 1
                  }?q=${encodeURIComponent(query)}`}
                  className="px-2 py-1 md:px-3 md:py-2 flex items-center justify-center bg-gray-700 hover:bg-gray-600"
                >
                  <RiArrowRightSLine className="w-4 h-4 md:w-5 md:h-5" />
                </Link>
              )}

              {/* Tombol ke halaman terakhir */}
              {pagination.page < pagination.lastPage - 2 && (
                <Link
                  href={`/search/page/${
                    pagination.lastPage
                  }?q=${encodeURIComponent(query)}`}
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

export default SearchPage;
