"use client";
import React, { useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { Container, TextField } from "@mui/material";

const Search = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  // reset params
  // useEffect(() => {
  //   const params = new URLSearchParams(searchParams);
  //   params.delete("q");
  //   replace(`${pathname}?${params}`);
  // }, []);

  const handleSearch = useDebouncedCallback((e) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", 1);

    if (e.target.value) {
      e.target.value.length > 1 && params.set("q", e.target.value);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params}`);
  }, 300); // 300 ms delay

  return (
    <div>
      <div
        className={
          "mb-3 ml-2 flex w-[400px] items-center gap-2 rounded-[14px] bg-gray-300 px-3 py-2 pr-5"
        }
      >
        <SearchIcon />
        <TextField
          fullWidth
          // variant="filled"
          size="small"
          id="search"
          label="Search"
          type="search"
          variant="standard"
          onChange={handleSearch}
        />
      </div>
    </div>
  );
};
export default Search;
