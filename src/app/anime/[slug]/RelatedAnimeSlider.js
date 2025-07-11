"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import cover from "../../../../public/assets/images/naruto_cover.jpg";

const RelatedAnimeSlider = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [sliderRef] = useKeenSlider({
    loop: true,
    initial: 0,
    slides: {
      perView: 2,
      spacing: 8,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 3,
          spacing: 8,
        },
      },
      "(min-width: 768px)": {
        slides: {
          perView: 4,
          spacing: 8,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 5,
          spacing: 8,
        },
      },
    },
    drag: true,
    animation: {
      duration: 1000, // animasi slide 1 detik
      easing: (t) => t, // linear easing (atau bisa pakai cubic bezier)
    },
    created: (slider) => {
      const interval = setInterval(() => {
        slider.next(); // smooth karena animation sudah diatur
      }, 5000);

      slider.on("destroyed", () => clearInterval(interval));
    },
    dragStarted: () => setIsDragging(true),
    dragEnded: () => setIsDragging(false),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={sliderRef}
      className={`keen-slider ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {Array.from({ length: 15 }).map((_, index) => (
        <div key={index} className="keen-slider__slide px-2 py-2">
          <div className="group transition-transform duration-300 hover:scale-105">
            <Image
              src={cover}
              alt={`Slide ${index + 1}`}
              className="w-full h-auto object-cover rounded-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RelatedAnimeSlider;
