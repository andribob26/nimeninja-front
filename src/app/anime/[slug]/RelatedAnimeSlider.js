"use client";

import { useEffect, useRef, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import cover from "../../../../public/assets/images/naruto_cover.jpg";
import Link from "next/link";
import ShimmerImage from "../../../components/ShimmerImage";

const RelatedAnimeSlider = ({ data }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [sliderRef] = useKeenSlider({
    loop: true,
    initial: 0,
    slides: {
      perView: 2,
      spacing: 2,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 3,
          spacing: 2,
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
      {data.map((item, index) => (
        <Link key={item.id} href={`/anime/${item.slug}`} passHref>
          <article key={index} className="keen-slider__slide px-2 py-2">
            <div className="group transition-transform duration-300 hover:scale-105">
              <div className="aspect-[2/3] w-full relative overflow-hidden rounded-sm">
                <ShimmerImage
                  src={`/files/${item.coverImage.folder}/${item.coverImage.fileName}?h=400`}
                  alt={`Slide-${index.slug}`}
                  fill
                  sizes="(min-width: 1280px) 256px, (min-width: 768px) 20vw, 100vw"
                  className="w-full h-auto object-cover rounded-sm"
                />
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
};

export default RelatedAnimeSlider;
