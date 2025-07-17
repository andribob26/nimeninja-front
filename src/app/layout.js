"use client";
import "./globals.css";
import Link from "next/link";
import logo from "../../public/assets/images/naruto.png";
import { useEffect, useRef, useState } from "react";
import TopProgressBar from "@/components/TopProgressBar";
import { usePathname } from "next/navigation";
import { RiCloseLine, RiMenuFill, RiSearchLine } from "react-icons/ri";

const navItems = [
  { label: "Home", href: "/" },
  {
    label: "Anime",
    href: null,
    children: [
      { label: "Sedang Tayang", href: "/anime/status/ongoing" },
      { label: "Anime Selesai", href: "/anime/status/completed" },
    ],
  },
  { label: "Movie", href: "/movie" },
  { label: "Genre", href: "/genre" },
];

const RootLayout = ({ children }) => {
  const pathname = usePathname();
  const searchRef = useRef(null);
  const indicatorRef = useRef(null);
  const mobileIndicatorRef = useRef(null);
  const itemsRef = useRef([]);
  const mobileItemsRef = useRef([]);
  const searchButtonRef = useRef(null);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleIndicator = (el, indicatorRef, itemsRef) => {
    if (!el || !indicatorRef.current) return;

    itemsRef.current.forEach((item) => {
      item?.classList.remove("is-active");
      item?.style?.removeProperty("color");
    });

    const indicator = indicatorRef.current;
    indicator.style.display = "block";
    indicator.style.width = `${el.offsetWidth}px`;
    indicator.style.left = `${el.offsetLeft}px`;

    el.classList.add("is-active");
  };

  const getActiveMobileItem = () => {
    const activeIndex = navItems.findIndex(({ href, children }) => {
      if (href === "/" && (pathname === "/" || pathname.startsWith("/page")))
        return true;
      if (href && (pathname === href || pathname.startsWith(href + "/")))
        return true;
      if (children) {
        return children.some(
          (child) =>
            pathname === child.href || pathname.startsWith(child.href + "/")
        );
      }
      return false;
    });

    // Jika cocok langsung, kembalikan elemen induknya
    if (mobileItemsRef.current[activeIndex]) {
      return mobileItemsRef.current[activeIndex];
    }

    return null;
  };

  const isItemActive = ({ href, children, pathname }) => {
    if (href === "/") return pathname === "/" || pathname.startsWith("/page");

    if (href) return pathname === href || pathname.startsWith(href + "/");

    if (children) {
      return children.some(
        (child) =>
          pathname === child.href || pathname.startsWith(child.href + "/")
      );
    }

    return false;
  };

  useEffect(() => {
    const activeIndex = navItems.findIndex(({ href, children }) => {
      // Untuk item Home
      if (href === "/") return pathname === "/" || pathname.startsWith("/page");

      // Untuk item dengan href langsung
      if (href && (pathname === href || pathname.startsWith(href + "/"))) {
        return true;
      }

      // Untuk item tanpa href tapi punya children
      if (children) {
        return children.some(
          (child) =>
            pathname === child.href || pathname.startsWith(child.href + "/")
        );
      }

      return false;
    });

    const desktopEl = itemsRef.current[activeIndex];
    const mobileEl = mobileItemsRef.current[activeIndex];

    if (desktopEl && indicatorRef.current) {
      handleIndicator(desktopEl, indicatorRef, itemsRef);
    } else if (indicatorRef.current) {
      indicatorRef.current.style.display = "none";
    }

    if (mobileEl && mobileIndicatorRef.current) {
      handleIndicator(mobileEl, mobileIndicatorRef, mobileItemsRef);
    } else if (mobileIndicatorRef.current) {
      mobileIndicatorRef.current.style.display = "none";
    }

    setIsSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !searchButtonRef.current?.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      const activeIndex = navItems.findIndex(({ href, children }) => {
        // Untuk item Home
        if (href === "/")
          return pathname === "/" || pathname.startsWith("/page");

        // Untuk item dengan href langsung
        if (href && (pathname === href || pathname.startsWith(href + "/"))) {
          return true;
        }

        // Untuk item tanpa href tapi punya children
        if (children) {
          return children.some(
            (child) =>
              pathname === child.href || pathname.startsWith(child.href + "/")
          );
        }

        return false;
      });
      const desktopEl = itemsRef.current[activeIndex];
      if (desktopEl && indicatorRef.current) {
        handleIndicator(desktopEl, indicatorRef, itemsRef);
      }
    }
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      const activeIndex = navItems.findIndex(({ href, children }) => {
        // Untuk item Home
        if (href === "/")
          return pathname === "/" || pathname.startsWith("/page");

        // Untuk item dengan href langsung
        if (href && (pathname === href || pathname.startsWith(href + "/"))) {
          return true;
        }

        // Untuk item tanpa href tapi punya children
        if (children) {
          return children.some(
            (child) =>
              pathname === child.href || pathname.startsWith(child.href + "/")
          );
        }

        return false;
      });

      const desktopEl = itemsRef.current[activeIndex];
      if (desktopEl && indicatorRef.current) {
        handleIndicator(desktopEl, indicatorRef, itemsRef);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname]);

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

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen || !mobileIndicatorRef.current || !itemsRef.current) return;

    const item = getActiveMobileItem();
    if (!item) return;

    const { offsetLeft, offsetWidth } = item;
    const indicator = mobileIndicatorRef.current;

    indicator.style.left = `${offsetLeft}px`;
    indicator.style.width = `${offsetWidth}px`;
    indicator.style.display = "block";
  }, [pathname, isMenuOpen]);

  return (
    <html lang="en">
      <body className="max-w-7xl mx-auto">
        <TopProgressBar />

        <header
          className={`fixed top-0 left-0 right-0 z-[100] ${
            showHeader
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } border-b border-[#FFFFFF14] bg-dark justify-between px-4 h-16 gap-6 transition-all duration-300`}
        >
          <div className="max-w-7xl mx-auto flex items-center">
            <div className="flex h-16 items-center justify-between flex-1">
              <nav className="hidden md:inline-flex relative max-w-full select-none text-neutral-300">
                {navItems.map(({ label, href, children }, i) => (
                  <div
                    key={label}
                    ref={(el) => (itemsRef.current[i] = el)}
                    className="relative px-4 font-medium transition-colors duration-300 group"
                  >
                    {href ? (
                      <Link href={href}>{label}</Link>
                    ) : (
                      <span>{label}</span>
                    )}

                    {children && (
                      <div className="absolute left-0 top-full mt-0 w-40 bg-transparent invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition duration-200 z-50">
                        <div className="mt-5 bg-dark border border-white/[0.1] shadow-lg">
                          {children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-sm text-white/60 hover:bg-white/10"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <span
                  ref={indicatorRef}
                  style={{ display: "none" }}
                  className="absolute left-0 -bottom-4 h-[1.5px] z-20 bg-orange-500 transition-all duration-400 ease-in-out"
                />
              </nav>

              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(true)}>
                  <RiMenuFill size={28} />
                </button>
              </div>

              <div>
                <input
                  className="hidden md:block w-64 px-3 py-2 text-sm rounded-sm border border-white/[0.08] shadow-[inset_2px_4px_16px_0px_#f8f8f80f] backdrop-blur-[20px] bg-[#ffffff14] outline-0 focus:outline-none"
                  placeholder="Cari..."
                  aria-label="Search anime"
                />
              </div>

              <div className="md:hidden">
                <button
                  ref={searchButtonRef}
                  onClick={() => {
                    setIsSearchOpen((prev) => !prev);
                    setIsMenuOpen(false);
                  }}
                >
                  <RiSearchLine size={28} />
                </button>
              </div>

              <div
                ref={searchRef}
                className={`md:hidden fixed top-16 left-0 right-0 z-[99] px-4 py-3 border-b border-white/[0.08] bg-dark transform transition-all duration-300 ease-in-out ${
                  isSearchOpen
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-4 pointer-events-none"
                }`}
              >
                <input
                  type="text"
                  placeholder="Cari..."
                  autoFocus
                  className="w-full px-3 py-2 text-sm rounded-sm border border-white/[0.08] shadow-[inset_2px_4px_16px_0px_#f8f8f80f] backdrop-blur-[20px] bg-[#ffffff14] outline-0 focus:outline-none placeholder-white/60"
                />
              </div>
            </div>
          </div>
        </header>

        <div
          className={`fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
            isMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className={`absolute top-0 left-0 w-64 h-full bg-dark shadow-lg p-4 space-y-4 transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setIsMenuOpen(false)}>
                <RiCloseLine size={28} />
              </button>
            </div>

            <nav className="relative">
              {navItems.map(({ label, href, children }, i) => (
                <div
                  key={label}
                  ref={(el) => (mobileItemsRef.current[i] = el)}
                  className="relative"
                >
                  <div className="py-4">
                    {href ? (
                      <Link
                        href={href}
                        className="block"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    ) : (
                      <span className="block">{label}</span>
                    )}
                    {children && (
                      <div className="mt-3 space-y-3">
                        {children.map((child) => {
                          const isActive =
                            pathname === child.href ||
                            pathname.startsWith(child.href + "/");
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block text-white/60"
                              onClick={() => setIsMenuOpen(false)}
                              ref={(el) => {
                                if (isActive) {
                                  mobileItemsRef.current[i] = el;
                                }
                              }}
                            >
                              - {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {isItemActive({ href, children, pathname }) && (
                    <span className="absolute left-0 bottom-0 h-[2px] w-full bg-orange-500" />
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>

        <main className="mt-16">{children}</main>

        <footer className="p-6 md:p-10">
          <div className="text-sm text-white/60">
            NimeNinja - Tempat nonton anime dengan nyaman dan tanpa ribet. ©
            2025 NimeNinja. Tetap semangat menonton dan jangan lupa istirahat
            ya!
          </div>

          <div className="mt-4 text-sm text-white/60">
            Ingin pasang iklan? Hubungi kami di{" "}
            <a
              href="mailto:iklan@nimeninja.com"
              className="text-orange-400 underline hover:text-orange-300"
            >
              iklan@nimeninja.com
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default RootLayout;
