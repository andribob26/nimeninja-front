import React from "react";
import AnimeStatusPage from "./[page]/page";

const AnimeStatusDefaultPage = ({ params }) => {
  return <AnimeStatusPage params={{ ...params, page: "1" }} />;
};

export default AnimeStatusDefaultPage;
