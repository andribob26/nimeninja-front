import React from "react";
import SearchPage from "./page/[page]/page"

const SearchDefaultPage = ({ searchParams }) => {
  return (
    <SearchPage
      params={{ page: "1" }}
      searchParams={searchParams} 
    />
  );
};

export default SearchDefaultPage;
