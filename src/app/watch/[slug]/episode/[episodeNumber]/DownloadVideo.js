"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from "../../../../../context/socket-context";

const DownloadVideo = ({ video }) => {
  const [status, setStatus] = useState("idle");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [progress, setProgress] = useState(null);
  const [progressId, setProgressId] = useState(null);

  const { socket, ready: socketReady } = useSocket();

  // ✅ Dengarkan event dari server
  useEffect(() => {
    if (!socket) return;

    const handleProgress = (data) => {
      console.log("📡 Progress received:", data);
      setProgress(data);
      setStatus("processing");
    };

    const handleReady = (data) => {
      console.log("✅ Download ready:", data);
      setDownloadUrl(data.url);
      setStatus("ready");
    };

    const handleFailed = (data) => {
      console.error("❌ Download failed:", data);
      setStatus("failed");
    };

    socket.on("download_progress", handleProgress);
    socket.on("download_ready", handleReady);
    socket.on("download_failed", handleFailed);

    return () => {
      socket.off("download_progress", handleProgress);
      socket.off("download_ready", handleReady);
      socket.off("download_failed", handleFailed);
    };
  }, [socket]);

  // ✅ Subscribe ke progressId setelah tersedia
  useEffect(() => {
    if (progressId && socket) {
      if (socket.connected) {
        socket.emit("subscribe_download", progressId);
      } else {
        const tryEmit = () => {
          socket.emit("subscribe_download", progressId);
          socket.off("connect", tryEmit);
        };
        socket.on("connect", tryEmit);
      }
    }
  }, [progressId, socket]);

  const handleClick = async () => {
    if (!socketReady) return;

    setStatus("processing");

    try {
      const res = await fetch(
        `https://api.nimeninja.win/video-download?prefix=${video.prefix}/240p`
      );

      const json = await res.json();
      const data = json.data;

      if (data.status === "ready") {
        setDownloadUrl(data.url);
        setStatus("ready");
      } else if (data.status === "processing") {
        setProgressId(data.progressId);
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      console.error("🔥 Download error:", err);
      setStatus("failed");
    }
  };

  return (
    <div className="space-y-2">
      {status === "idle" && (
        <button
          onClick={handleClick}
          disabled={!socketReady}
          className={`px-4 py-2 rounded text-white ${
            socketReady
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {socketReady ? "Download Video" : "Connecting..."}
        </button>
      )}

      {status === "processing" && (
        <div className="text-yellow-600">
          <p>Processing... Stage: {progress?.stage || "starting"}</p>
          {progress?.percent != null && (
            <p>Progress: {Math.min(progress.percent, 100)}%</p>
          )}
        </div>
      )}

      {status === "ready" && downloadUrl && (
        <a
          href={downloadUrl}
          download
          className="bg-green-600 text-white px-4 py-2 rounded inline-block"
        >
          ✅ Download Ready - Click Here
        </a>
      )}

      {status === "failed" && (
        <p className="text-red-600">❌ Download failed. Please try again.</p>
      )}
    </div>
  );
};

export default DownloadVideo;
