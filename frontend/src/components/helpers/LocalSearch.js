import React from "react";

const LocalSearch = ({ keyword, setKeyword }) => {

  return (
    <input
      type="search"
      placeholder="Search"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value.toLowerCase())}
      className="form-control mb-4"
    />
  );
};

export default LocalSearch;