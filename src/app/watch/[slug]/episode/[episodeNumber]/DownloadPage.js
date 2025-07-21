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
    <div className="p-10">
      <button
        onClick={handleShorten}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {loading ? "Memproses..." : "Dapatkan Link Download"}
      </button>
    </div>
  );
};

export default DownloadPage;
