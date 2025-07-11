import HlsPlayer from "@/components/HlsPlayer";
import React from "react";

const Movie = () => {
  const baseUrl =
    "videos/anime/one-piece/3/1751527686216-CUejTO-a7979c99-53d2-4c12-8e7d-b6c738564055/master.m3u8";
  return (
    <>
      <div className="w-full max-w-7xl mx-auto aspect-video bg-red-500 rounded-sm overflow-hidden mt-24">
        <HlsPlayer src={baseUrl} />
      </div>
    </>
  );
};

export default Movie;
