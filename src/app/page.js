import cover from "../../public/assets/images/naruto_cover.jpg";
import Thumnail from "../../public/assets/images/thumbnail.jpg";
import Image from "next/image";
import { fetchWithRevalidate } from "@/lib/fetcher";
import Link from "next/link";

const paramsOngoingAnime = {
  page: 1,
  limit: 10,
  search: "",
  orderBy: "latestAiredAt",
  orderDirection: "ASC",
  statusName: "Ongoing", // ← opsional, kalau tidak ada bisa skip
};

const paramsCompletedAnime = {
  page: 1,
  limit: 10,
  search: "",
  orderBy: "latestAiredAt",
  orderDirection: "ASC",
  statusName: "Completed", // ← opsional, kalau tidak ada bisa skip
};

const Home = async () => {
  // const totalEpisodes = 100; // Misal total 100 episode
  // const itemsPerPage = 8;

  // const [currentPage, setCurrentPage] = useState(1);
  // const totalPages = Math.ceil(totalEpisodes / itemsPerPage);

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const episodes = Array.from(
  //   { length: itemsPerPage },
  //   (_, i) => startIndex + i + 1
  // );

  const animeOngoing = await fetchWithRevalidate("/media", paramsOngoingAnime);
  const animeCompleted = await fetchWithRevalidate(
    "/media",
    paramsCompletedAnime
  );

  // console.log(animeCompleted, "okkk");

  return (
    // <></>
    <div className="p-10">
      {/* <section
        aria-labelledby="latest-episodes"
        className="section-light-dim pb-6 mb-6"
      >
        <header>
          <h2
            id="latest-episodes"
            className="text-xl font-semibold mb-6 inline-block"
          >
            Episode Terbaru
            <span className="block mt-2 w-full h-[3px] bg-orange-500 rounded-full"></span>
          </h2>
        </header>
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
                    <p className="text-white text-center px-4">
                      Ini adalah deskripsi episode {ep}.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
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
      </section> */}

      <section
        aria-labelledby="currently-airing"
        className="section-light-dim pb-6 mb-6"
      >
        <header>
          <h2
            id="latest-episodes"
            className="text-xl font-semibold mb-6 inline-block"
          >
            Sedang Tayang
            <span className="block mt-2 w-full h-[3px] bg-orange-500 rounded-full"></span>
          </h2>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {animeOngoing.data.map((item, index) => (
            <Link key={item.id} href={`/anime/${item.slug}`} passHref>
              <article
                key={item.id}
                className="relative rounded overflow-hidden group cursor-pointer transition-all duration-300"
              >
                <div className="p-[1px] rounded transition-all duration-300 group-hover:border-image-glow">
                  <div className="aspect-[2/3] w-full relative overflow-hidden rounded-sm">
                    <Image
                      src={`/files/${item.coverImage.folder}/${item.coverImage.fileName}?h=400`}
                      alt={item.coverImage.fileName}
                      fill
                      sizes="(min-width: 1280px) 256px, (min-width: 768px) 20vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-center px-4 font-semibold text-sm">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="completed-anime">
        <header>
          <h2
            id="anime-completed"
            className="text-xl font-semibold mb-6 inline-block"
          >
            Anime Selesai
            <span className="block mt-2 w-full h-[3px] bg-orange-500 rounded-full"></span>
          </h2>
        </header>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {animeCompleted.data.map((item, index) => (
            <Link key={item.id} href={`/anime/${item.slug}`} passHref>
              <article
                key={item.id}
                className="relative rounded overflow-hidden group cursor-pointer transition-all duration-300"
              >
                <div className="p-[1px] rounded transition-all duration-300 group-hover:border-image-glow">
                  <div className="aspect-[2/3] w-full relative overflow-hidden rounded-sm">
                    <Image
                      src={`/files/${item.coverImage.folder}/${item.coverImage.fileName}?h=400`}
                      alt={item.coverImage.fileName}
                      fill
                      sizes="(min-width: 1280px) 256px, (min-width: 768px) 20vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-center px-4 font-semibold text-sm">
                        {item.title}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
