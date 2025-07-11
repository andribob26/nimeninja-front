"use client";
import "./globals.css";
import Link from "next/link";
import logo from "../../public/assets/images/naruto.png";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import TopProgressBar from "@/components/TopProgressBar";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Anime List", href: "/anime-list" },
  { label: "Movie", href: "/movie" },
  { label: "Genre", href: "/genre" },
];

const RootLayout = ({ children }) => {
  const indicatorRef = useRef(null);
  const itemsRef = useRef([]);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  // Fungsi update posisi dan styling indikator
  const handleIndicator = (el) => {
    if (!el || !indicatorRef.current) return;

    itemsRef.current.forEach((item) => {
      item.classList.remove("is-active");
      item.style.color = "";
    });

    const indicator = indicatorRef.current;
    indicator.style.width = `${el.offsetWidth}px`;
    indicator.style.left = `${el.offsetLeft}px`;

    el.classList.add("is-active");
  };

  // Inisialisasi indikator saat mount
  useEffect(() => {
    const activeItem = itemsRef.current.find((item) =>
      item.classList.contains("is-active")
    );
    if (activeItem) {
      handleIndicator(activeItem);
    } else if (itemsRef.current.length > 0) {
      handleIndicator(itemsRef.current[0]);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowHeader(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <html lang="en">
      <body className="max-w-7xl mx-auto">
        <TopProgressBar />
        <header
          className={`fixed top-0 left-0 right-0 z-50 ${
            showHeader ? "opacity-100" : "opacity-0"
          } border-b border-[#FFFFFF14] bg-dark justify-between px-4 h-16 gap-6 transition-all duration-300`}
        >
          <div className="max-w-7xl mx-auto flex items-center">
            <div>
              <Image src={logo} width={96} alt="Logo" priority />
            </div>

            <div className="flex h-16 items-center justify-between flex-1">
              <nav className="relative inline-flex max-w-full select-none text-neutral-300">
                {navItems.map(({ label, href }, i) => (
                  <div
                    key={label}
                    ref={(el) => (itemsRef.current[i] = el)}
                    className={`relative px-4 font-medium transition-colors duration-300 ${
                      i === 0 ? "is-active" : ""
                    }`}
                  >
                    <Link
                      href={href}
                      onClick={(e) => {
                        handleIndicator(e.currentTarget.parentElement);
                      }}
                    >
                      {label}
                    </Link>
                  </div>
                ))}
                <span
                  ref={indicatorRef}
                  className="absolute left-0 -bottom-1.5 h-[1.5px] z-20 bg-orange-500 transition-all duration-400 ease-in-out"
                />
              </nav>
              <div>
                <input
                  className="w-64 px-3 py-2 text-sm rounded-sm border border-solid border-white/[0.08] shadow-[inset_2px_4px_16px_0px_#f8f8f80f] backdrop-blur-[20px] bg-[#ffffff14] outline-0 focus:ring-0 focus:outline-none"
                  placeholder="Search..."
                  aria-label="Search anime"
                />
              </div>
            </div>
          </div>
        </header>

        {/* <aside
          className="my-2 space-y-2 text-black mt-24 mb-8"
          aria-label="Advertisement Banners"
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white border h-20">
              <div className="flex items-center justify-center h-full">
                ADS 1152px x 80px
              </div>
            </div>
            <div className="bg-white border h-20">
              <div className="flex items-center justify-center h-full">
                ADS 1152px x 80px
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white border h-20">
              <div className="flex items-center justify-center h-full">
                ADS 1152px x 80px
              </div>
            </div>
            <div className="bg-white border h-20">
              <div className="flex items-center justify-center h-full">
                ADS 1152px x 80px
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white border h-20">
              <div className="flex items-center justify-center h-full">
                ADS 1152px x 80px
              </div>
            </div>
            <div className="bg-white border h-20">
              <div className="flex items-center justify-center h-full">
                ADS 1152px x 80px
              </div>
            </div>
          </div>
        </aside> */}

        <div className=""></div>
        {/* 
        <main className="mb-8 rounded border border-[#FFFFFF14] bg-[linear-gradient(180deg,#ffffff08_0%,#ffffff03_100%)] backdrop-blur-[20px] p-10">
          {children}
        </main> */}

        <main className="mt-16">{children}</main>

        <footer className="footer-light-dim p-10">
          <div className="text-sm text-neutral-300">
            Nimegami adalah sebuah Fanshare tempat download anime gratis
            subtitle indonesia. Disini kami menyediakan anime dengan format mkv
            dan mp4. Ada banyak ukuran anime yang dishare disini, yaitu 480p,
            720p, 360p, dan kadang kadang 240p.
          </div>
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
