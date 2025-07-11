"use client";

import { useEffect, useRef, useState } from "react";
import Tippy, { tippy } from "@tippyjs/react";
import { followCursor } from "tippy.js";
import "tippy.js/dist/tippy.css";
import { useHlsToken } from "@/hooks/useHlsToken";
import {
  RiForward15Line,
  RiFullscreenExitLine,
  RiFullscreenLine,
  RiPauseLine,
  RiPlayLargeLine,
  RiPlayLine,
  RiReplay15Fill,
  RiVolumeMuteLine,
  RiVolumeUpLine,
} from "react-icons/ri";
import Image from "next/image";

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function HlsPlayer({ src, thumbnail }) {
  const hasInteractedRef = useRef(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  // const tokenRef = useRef(null);
  const HlsClassRef = useRef(null);
  const controlTimerRef = useRef(null);
  const lastVolumeRef = useRef(1);
  const isShowPopperRef = useRef(false);

  const [isReady, setIsReady] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverTime, setHoverTime] = useState(null);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [qualityLevels, setQualityLevels] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hideControls, setHideControls] = useState(false);
  const [hideToolTipDuration, setHideToolTipDuration] = useState(true);
  const [isShowQualityPopper, setIsShowQualityPopper] = useState(false);
  const [isShowSpeedPopper, setIsShowSpeedPopper] = useState(false);
  const [isInitialBuffering, setIsInitialBuffering] = useState(false);

  // const token = useHlsToken(isReady);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    hasInteractedRef.current = true;
    video.paused ? video.play() : video.pause();
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!document.fullscreenElement && container?.requestFullscreen) {
      container.requestFullscreen().then(() => {
        // Jika belum ada interaksi, pastikan video tidak main otomatis
        if (!hasInteractedRef.current && videoRef.current?.paused) {
          videoRef.current.pause();
        }
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    const video = videoRef.current;
    if (video) {
      setIsSeeking(true);
      video.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSeekRelative = (offset) => {
    const video = videoRef.current;
    if (video) {
      setIsSeeking(true);
      video.currentTime = Math.max(
        0,
        Math.min(video.duration, video.currentTime + offset)
      );
    }
  };

  const handleVolume = (valueOrEvent) => {
    // const vol = parseFloat(e.target.value);
    // setVolume(vol);
    // if (videoRef.current) videoRef.current.volume = vol;

    const vol =
      typeof valueOrEvent === "number"
        ? valueOrEvent
        : parseFloat(valueOrEvent.target.value);
    setVolume(vol);
    if (videoRef.current) videoRef.current.volume = vol;
    if (vol === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const handleSelectQuality = (index) => {
    const video = videoRef.current;
    if (!hlsRef.current || !video) return;
    const currentTime = video.currentTime;
    const currentVolume = video.volume;
    const wasPaused = video.paused;
    hlsRef.current.currentLevel = index;
    setSelectedQuality(index);
    setTimeout(() => {
      video.currentTime = currentTime;
      video.volume = currentVolume;
      if (!wasPaused) video.play().catch(() => {});
    }, 100);
  };

  const handlePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (videoRef.current) videoRef.current.playbackRate = rate;
  };

  useEffect(() => {
    if (!isReady) return;
    const setupHls = async () => {
      HlsClassRef.current = (
        await import("/public/libs/dataWorker.js")
      ).default;
      setInitialLoading(false);
    };
    setupHls();
  }, [isReady]);

  // useEffect(() => {
  //   tokenRef.current = token;
  // }, [token]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || initialLoading || !HlsClassRef.current || !src || !isReady)
      return;

    const Hls = HlsClassRef.current;
    const masterUrl = `/api/hls/${src}`;

    console.log(masterUrl, "okkkk");

    let hls;
    let isCancelled = false;

    if (Hls.isSupported()) {
      hls = new Hls();

      hlsRef.current = hls;
      hls.attachMedia(video);
      hls.loadSource(masterUrl);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (isCancelled) return;

        setQualityLevels(hls.levels);
        if (hasInteractedRef.current) {
          video.play().catch((err) => {
            if (err.name !== "AbortError") {
              console.warn("Autoplay error:", err);
            }
          });
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = masterUrl;
    }

    return () => {
      isCancelled = true;
      if (hls) {
        hls.destroy();
      }
      hlsRef.current = null;
    };
  }, [src, initialLoading, isReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateState = () => {
      setCurrentTime(video.currentTime);
      if (video.buffered.length > 0) {
        setBufferedTime(video.buffered.end(video.buffered.length - 1));
      }
    };

    const setMeta = () => {
      setDuration(video.duration);
      video.volume = volume;
      video.playbackRate = playbackRate;
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => {
      setIsBuffering(false);
      setIsSeeking(false);
      setIsInitialBuffering(false);
    };
    const handleSeeked = () => {
      setIsBuffering(false);
      setIsSeeking(false);
      setIsInitialBuffering(false);
    };

    const handleEnd = () => {
      setIsReady(false);
    };

    video.addEventListener("timeupdate", updateState);
    video.addEventListener("progress", updateState);
    video.addEventListener("loadedmetadata", setMeta);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("seeked", handleSeeked);
    video.addEventListener("ended", handleEnd);

    return () => {
      video.removeEventListener("timeupdate", updateState);
      video.removeEventListener("progress", updateState);
      video.removeEventListener("loadedmetadata", setMeta);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("ended", handleEnd);
    };
  }, [volume, playbackRate]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const resetControls = () => {
      setHideControls(false);
      clearTimeout(controlTimerRef.current);
      controlTimerRef.current = setTimeout(() => {
        if (!videoRef.current?.paused) {
          setHideControls(true);
        }
      }, 2000);
    };
    const handleMouseMove = () => resetControls();
    const handleFullscreenChange = () => {
      const full = document.fullscreenElement === containerRef.current;
      setIsFullscreen(full);
      resetControls();
    };
    const container = containerRef.current;
    container?.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      container?.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      clearTimeout(controlTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const tryPlay = () => {
      // Jangan mainkan jika tidak dalam dokumen (unmounted)
      if (!document.contains(video)) return;

      video.play().catch((err) => {
        if (!cancelled && err.name !== "AbortError") {
          console.warn("Autoplay error (isReady effect):", err);
        }
      });
    };

    tryPlay();

    return () => {
      cancelled = true;
    };
  }, [isReady]);

  useEffect(() => {
    isShowPopperRef.current = isShowQualityPopper || isShowSpeedPopper;
  }, [isShowQualityPopper, isShowSpeedPopper]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden flex items-center justify-center ${
        isFullscreen
          ? "fixed inset-0 w-screen h-screen z-[9999]"
          : "w-full h-full mx-auto rounded-sm"
      }`}
    >
      <video
        ref={videoRef}
        className="w-full h-full block object-contain"
        controls={false}
        onClick={(e) => {
          if (isReady) {
            if (isShowPopperRef.current) {
              e.stopPropagation();
              setIsShowQualityPopper(false);
              setIsShowSpeedPopper(false);
              return;
            }

            togglePlay();
          }
        }}
      />
      {(isInitialBuffering || isBuffering || isSeeking) && (
        <div
          onClick={() => {
            setIsShowSpeedPopper(false);
            setIsShowQualityPopper(false);
          }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
        >
          <div className="h-8 w-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {isReady ? (
        !isPlaying &&
        !isBuffering &&
        !isSeeking && (
          <div
            onClick={(e) => {
              if (isReady) {
                if (isShowPopperRef.current) {
                  e.stopPropagation();
                  setIsShowQualityPopper(false);
                  setIsShowSpeedPopper(false);
                  return;
                }

                togglePlay();
              }
            }}
            className="absolute cursor-pointer inset-0 flex items-center justify-center z-30"
          >
            {!isInitialBuffering && (
              <div className="hover:scale-110 hover:text-orange-500 transition-all duration-200">
                <RiPlayLargeLine className="h-10 w-10 md:h-16 md:w-16" />
              </div>
            )}
          </div>
        )
      ) : (
        <div
          className={`absolute inset-0 z-50 cursor-pointer transition-opacity duration-500 ${
            isReady ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onClick={(e) => {
            e.preventDefault();
            hasInteractedRef.current = true;
            setIsInitialBuffering(true);
            setIsReady(true);
          }}
        >
          {/* Thumbnail image */}
          <Image
            src={`/${thumbnail}`}
            alt="Thumbnail"
            fill
            className="object-cover w-full h-full rounded shadow-md"
          />

          {/* Overlay & Play Button */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="text-white hover:scale-110 transition-all duration-200 hover:text-orange-500">
              <RiPlayLargeLine className="h-10 w-10 md:h-16 md:w-16" />
            </div>
          </div>
        </div>
      )}

      {isReady && duration !== 0 && (
        <div
          onClick={() => {
            setIsShowQualityPopper(false);
            setIsShowSpeedPopper(false);
          }}
          className={`absolute bottom-0 left-0 w-full z-40 transition-opacity duration-300 ${
            hideControls ? "opacity-0 pointer-events-none" : "opacity-100"
          } bg-dark bg-opacity-50 text-white py-2 px-4 flex flex-col gap-1 md:gap-2`}
        >
          <span className="text-[10px] md:text-xs">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <Tippy
            content={
              hoverTime !== null ? (
                <span className="px-2 py-1">{formatTime(hoverTime)}</span>
              ) : (
                ""
              )
            }
            visible={hoverTime !== null && hideToolTipDuration}
            placement="top"
            duration={0} //
            animation={false}
            followCursor="horizontal"
            plugins={[followCursor]}
          >
            <div
              className="relative w-full h-[14px] group"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = e.clientX - rect.left;
                const percent = pos / rect.width;
                setHoverTime(percent * duration);
                setHideToolTipDuration(true);
              }}
              onMouseLeave={() => {
                setHideToolTipDuration(false);
              }}
            >
              {/* Background track (pink) */}
              <div className="absolute inset-y-1/2 -translate-y-1/2 left-0 right-0 h-[4px] group-hover:h-[6px] bg-orange-500/30 transition-all duration-200" />

              {/* Buffered bar */}
              <div
                className="absolute top-1/2 left-0 h-[4px] group-hover:h-[6px] -translate-y-1/2 bg-orange-500/50 transition-all duration-200"
                style={{ width: `${(bufferedTime / duration) * 100 || 0}%` }}
              />

              {/* Progress bar */}
              <div
                className="absolute top-1/2 left-0 h-[4px] group-hover:h-[6px] -translate-y-1/2 bg-orange-500 transition-all duration-200"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
              />

              {/* Indicator bulat */}
              <div
                className="absolute top-1/2 left-0 h-[14px] w-[14px] scale-0 group-hover:scale-100 translate-x-[-50%] translate-y-[-50%] rounded-full bg-orange-500 z-10 pointer-events-none transition-transform duration-200"
                style={{
                  left: `${(currentTime / duration) * 100 || 0}%`,
                }}
              />

              {/* Input transparan untuk kontrol */}
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                step="0.1"
                onChange={handleSeek}
                onMouseDown={(e) => {
                  if (isShowPopperRef.current) {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsShowQualityPopper(false);
                    setIsShowSpeedPopper(false);
                    return;
                  }
                }}
                onClick={(e) => {
                  if (isShowPopperRef.current) {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsShowQualityPopper(false);
                    setIsShowSpeedPopper(false);
                    return;
                  }
                }}
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </Tippy>

          <div className="flex justify-between items-center h-full text-sm gap-3">
            <div className="flex items-center gap-4 md:gap-6">
              <button
                className="hover:scale-110 hover:text-orange-500 transition-all duration-200"
                onClick={(e) => {
                  if (isReady) {
                    if (isShowPopperRef.current) {
                      e.stopPropagation();
                      setIsShowQualityPopper(false);
                      setIsShowSpeedPopper(false);
                      return;
                    }
                    togglePlay();
                  }
                }}
              >
                {isPlaying ? (
                  <RiPauseLine className="h-5 w-5 md:h-6 md:w-6" />
                ) : (
                  <RiPlayLargeLine className="h-5 w-5 md:h-6 md:w-6" />
                )}
              </button>
              <button
                className="hover:scale-110 hover:text-orange-500 transition-all duration-200"
                onClick={(e) => {
                  if (isReady) {
                    if (isShowPopperRef.current) {
                      e.stopPropagation();
                      setIsShowQualityPopper(false);
                      setIsShowSpeedPopper(false);
                      return;
                    }
                    handleSeekRelative(-15);
                  }
                }}
              >
                <RiReplay15Fill className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              <button
                className="hover:scale-110 hover:text-orange-500 transition-all duration-200"
                onClick={(e) => {
                  if (isReady) {
                    if (isShowPopperRef.current) {
                      e.stopPropagation();
                      setIsShowQualityPopper(false);
                      setIsShowSpeedPopper(false);
                      return;
                    }
                    handleSeekRelative(15);
                  }
                }}
              >
                <RiForward15Line className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              <button
                className="hover:scale-110 hover:text-orange-500 transition-all duration-200"
                onClick={(e) => {
                  if (isReady) {
                    if (isShowPopperRef.current) {
                      e.stopPropagation();
                      setIsShowQualityPopper(false);
                      setIsShowSpeedPopper(false);
                      return;
                    }
                    if (isMuted) {
                      handleVolume(lastVolumeRef.current || 1);
                    } else {
                      lastVolumeRef.current = volume;
                      handleVolume(0);
                    }
                  }
                  // setIsMuted((prev) => !prev);
                }}
              >
                {isMuted ? (
                  <RiVolumeMuteLine className="h-5 w-5 md:h-6 md:w-6" />
                ) : (
                  <RiVolumeUpLine className="h-5 w-5 md:h-6 md:w-6" />
                )}
              </button>
              <div className="hls-player">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolume}
                  onMouseDown={(e) => {
                    if (isShowPopperRef.current) {
                      e.stopPropagation();
                      e.preventDefault();
                      setIsShowQualityPopper(false);
                      setIsShowSpeedPopper(false);
                      return;
                    }
                  }}
                  onClick={(e) => {
                    if (isShowPopperRef.current) {
                      e.stopPropagation();
                      e.preventDefault();
                      setIsShowQualityPopper(false);
                      setIsShowSpeedPopper(false);
                      return;
                    }
                  }}
                  className="custom-slider relative top-[-1.7px] z-10 w-28 h-2 appearance-none bg-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              {qualityLevels.length > 0 && (
                <div>
                  <Tippy
                    visible={isShowQualityPopper}
                    content={
                      <div className="bg-dark text-white rounded-sm overflow-hidden py-2 shadow">
                        <div
                          onClick={() => {
                            handleSelectQuality(-1);
                          }}
                          className={`cursor-pointer py-1 px-4 ${
                            selectedQuality === -1
                              ? "bg-orange-500"
                              : "hover:bg-orange-500"
                          }`}
                        >
                          Auto
                        </div>
                        {qualityLevels.map((q, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleSelectQuality(idx)}
                            className={`cursor-pointer py-1 px-4 ${
                              selectedQuality === idx
                                ? "bg-orange-500"
                                : "hover:bg-orange-500"
                            }`}
                          >
                            {q.height}p
                          </div>
                        ))}
                      </div>
                    }
                    interactive={true}
                    appendTo="parent"
                    placement="top-end"
                  >
                    <span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsShowSpeedPopper(false);
                          setIsShowQualityPopper(!isShowQualityPopper);
                        }}
                        className="flex items-center justify-center whitespace-nowrap border md:border-[2px] border-white hover:text-orange-500 hover:border-orange-500 rounded-sm text-[6px] md:text-[8px] h-5 md:h-6 font-medium hover:scale-110 px-2 transition-all duration-200"
                      >
                        {selectedQuality === -1
                          ? "Auto"
                          : `${qualityLevels[selectedQuality]?.height}p`}
                      </button>
                    </span>
                  </Tippy>
                </div>
              )}

              <Tippy
                visible={isShowSpeedPopper}
                content={
                  <div className="bg-dark text-white rounded-sm overflow-hidden shadow py-2">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((r) => (
                      <div
                        key={r}
                        onClick={() => handlePlaybackRate(r)}
                        className={`cursor-pointer ${
                          r === playbackRate && "bg-orange-500"
                        } hover:bg-orange-500 py-1 px-4`}
                      >
                        {r}x
                      </div>
                    ))}
                  </div>
                }
                interactive={true}
                appendTo="parent"
                placement="top-end"
              >
                <span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsShowQualityPopper(false);
                      setIsShowSpeedPopper(!isShowSpeedPopper);
                    }}
                    className="flex items-center justify-center whitespace-nowrap border md:border-[2px] border-white hover:text-orange-500 hover:border-orange-500 rounded-sm text-[6px] md:text-[8px] h-5 md:h-6 font-medium hover:scale-110 px-2 transition-all duration-200"
                  >
                    {`Speed ${playbackRate}x`}
                  </button>
                </span>
              </Tippy>

              <button
                className="hover:scale-110 hover:text-orange-500 transition-all duration-200"
                onClick={handleFullscreen}
              >
                {isFullscreen ? (
                  <RiFullscreenExitLine className="h-5 w-5 md:h-6 md:w-6" />
                ) : (
                  <RiFullscreenLine className="h-5 w-5 md:h-6 md:w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HlsPlayer;
