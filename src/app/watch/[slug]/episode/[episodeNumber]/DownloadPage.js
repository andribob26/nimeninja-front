"use client";
import { useState } from "react";

const DownloadPage = ({ slug, episode, prefix }) => {
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/shortlink?url=https://player-hls-three.vercel.app/download/${prefix}&alias=${slug}-${episode}`
      );

      const data = await res.json();

      if (data?.shortenedUrl) {
        // 🆕 Buka di tab baru
        window.open(data.shortenedUrl, "_blank");
      } else {
        alert("Gagal membuat shortlink");
      }
    } catch (error) {
      alert("Terjadi kesalahan saat memproses.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleShorten}
      disabled={loading}
      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 transition-all duration-200 w-44"
    >
      {loading ? "Memproses..." : "Link Download"}
    </button>
  );
};

export default DownloadPage;
