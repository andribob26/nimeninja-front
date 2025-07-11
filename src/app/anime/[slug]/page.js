import AnimePage from "./page/[page]/page";

export default async function AnimeDefaultPage({ params }) {
  return <AnimePage params={{ ...params, page: "1" }} />;
}
