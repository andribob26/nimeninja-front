import React from "react";
import { notFound } from "next/navigation";
import { fetchWithRevalidate } from "@/lib/fetcher";
import HlsPlayer from "@/components/HlsPlayer";

export const dynamicParams = true;

// Opsi revalidate halaman ini setiap 1 jam agar tetap fresh
export const revalidate = 3600; // optional

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

  try {
    const res = await fetchWithRevalidate("/episodes", {
      mediaSlug: slug,
      episodeNumber,
    });

    const episode = res.data?.[0];
    if (!episode) return notFound();

    const urlVideo = episode.video.hlsObject;
    return (
      <>
        <div className="w-full max-w-7xl mx-auto aspect-video rounded-sm overflow-hidden mt-24">
          <HlsPlayer src={urlVideo} thumbnail={episode.video.thumbnailObject} />
        </div>
      </>
    );
  } catch (err) {
    console.error("Fetch episode error:", err);
    return notFound();
  }
};

export default WatchEpisode;
