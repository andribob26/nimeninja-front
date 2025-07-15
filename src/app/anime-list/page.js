"use client";
import React, { useEffect, useState } from "react";
import bgCover from "../../../public/assets/images/naruto-shippuden-background.jpg";
import cover from "../../../public/assets/images/naruto_cover.jpg";
import Image from "next/image";
import Thumnail from "../../../public/assets/images/thumbnail.jpg";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

const AnimeList = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [sliderRef] = useKeenSlider({
    loop: true,
    initial: 0,
    slides: {
      perView: 3,
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

  const totalEpisodes = 100; // Misal total 100 episode
  const itemsPerPage = 20;

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalEpisodes / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const episodes = Array.from(
    { length: itemsPerPage },
    (_, i) => startIndex + i + 1
  );

  return (
    <>
      <div className="relative w-full min-h-[620px] overflow-hidden rounded shadow-lg flex flex-col mb-10">
        {/* Background image full cover */}
        <Image
          src={bgCover}
          alt="Logo"
          priority
          fill
          className="object-cover"
        />

        {/* Smooth radial vignette dari tengah */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,transparent_40%,#070710_100%)]" />
        </div>

        {/* Gradasi dari bawah ke atas */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="w-full h-full bg-gradient-to-t from-dark/100 via-dark/60 to-transparent" />
        </div>

        {/* Konten utama */}
        <section
          className="relative z-30 px-4 md:px-10 py-10 flex-grow flex items-end"
          aria-labelledby="anime-title"
        >
          <div className="flex flex-col md:flex-row items-stretch gap-6 max-w-7xl mx-auto w-full">
            {/* Cover Image */}
            <figure className="w-full max-w-[240px] md:w-auto mx-auto md:mx-0 flex-shrink-0 rounded overflow-hidden shadow-lg h-auto md:h-full">
              <Image
                src={cover}
                alt="Airing anime"
                className="object-cover w-full h-full"
              />
            </figure>

            {/* Wrapper teks */}
            <div className="flex flex-col justify-between flex-1 text-left">
              {/* Atas: Judul & Deskripsi */}
              <header>
                <h1
                  id="anime-title"
                  className="text-center md:text-left text-3xl md:text-4xl font-bold drop-shadow-lg leading-snug"
                >
                  Naruto
                </h1>

                <p className="text-sm md:text-base drop-shadow-md leading-relaxed max-w-2xl mx-auto md:mx-0">
                  Naruto Uzumaki, a hyperactive and knuckle-headed ninja, lives
                  in Konohagakure, the Hidden Leaf village. Moments prior to his
                  birth, a huge demon known as the Kyuubi, the Nine-tailed Fox,
                  attacked Konohagakure and wreaked havoc. In order to put an
                  end to the Kyuubi's rampage, the leader of the village, the
                  4th Hokage, sacrificed his life and sealed the monstrous beast
                  inside the newborn Naruto.
                  <br />
                  Shunned because of the presence of the Kyuubi inside him,
                  Naruto struggles to find his place in the village. He strives
                  to become the Hokage of Konohagakure, and he meets many
                  friends and foes along the way.
                </p>
              </header>

              {/* Detail info */}
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-6 text-xs sm:text-sm md:text-base text-left max-w-2xl mx-auto md:mx-0 pt-6">
                <div className="flex gap-2">
                  <dt className="font-semibold text-white/60 whitespace-nowrap">
                    Season:
                  </dt>
                  <dd className="text-gray-300">Fall</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Year:</dt>
                  <dd className="text-gray-300">2002</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Format:</dt>
                  <dd className="text-gray-300">TV</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Studio:</dt>
                  <dd className="text-gray-300">Studio Pierrot</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Score:</dt>
                  <dd className="text-yellow-400 font-semibold">7.90</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="font-semibold whitespace-nowrap">Status:</dt>
                  <dd className="text-green-400 font-semibold">Completed</dd>
                </div>
                <div className="col-span-3 grid grid-cols-[auto_1fr] gap-x-2 pt-1">
                  <dt className="font-semibold whitespace-nowrap text-white/60">
                    Genre:
                  </dt>
                  <dd className="flex flex-wrap gap-2 text-gray-300">
                    {[
                      "Supernatural",
                      "Action",
                      "Fantasy",
                      "Drama",
                      "Comedy",
                      "Adventure",
                    ].map((genre) => (
                      <span
                        key={genre}
                        className="bg-gray-700 text-xs sm:text-sm px-2 py-0.5 whitespace-nowrap select-none"
                      >
                        {genre}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </div>

      {/* Section Episodes */}
      <section aria-labelledby="latest-episodes" className="px-10 mb-10">
        <header>
          <h2
            id="latest-episodes"
            className="text-xl font-semibold mb-6 inline-block"
          >
            Episode
            <span className="block mt-2 w-full h-[3px] bg-orange-500 rounded-full"></span>
          </h2>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-6">
          {episodes.map((ep) => (
            <article
              key={ep}
              className="relative rounded overflow-hidden group cursor-pointer transition-all duration-300"
            >
              <div className="p-[1px] rounded transition-all duration-300 group-hover:border-image-glow">
                <div className="aspect-[16/9] w-full relative overflow-hidden rounded-sm">
                  <Image
                    src={Thumnail}
                    alt={`Episode ${ep} cover`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-dark/70 backdrop-blur-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-center px-4">
                      Ini adalah deskripsi episode {ep}.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700  disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className=" self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700  disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </section>
      <section aria-labelledby="completed-anime" className="px-10 mb-8">
        <header>
          <h2
            id="completed-anime"
            className="text-xl font-semibold mb-4 inline-block"
          >
            Anime Terkait
            <span className="block mt-2 w-full h-[3px] bg-orange-500 rounded-full"></span>
          </h2>
        </header>
        {mounted && (
          <div
            ref={sliderRef}
            className={`keen-slider ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            {Array.from({ length: 15 }).map((_, index) => (
              <div
                key={index}
                className="keen-slider__slide px-2 py-2" // kasih padding agar scale tidak terpotong
              >
                <div className="group roundedtransition-transform duration-300 hover:scale-105">
                  <Image
                    src={cover}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-auto object-cover rounded-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default AnimeList;
