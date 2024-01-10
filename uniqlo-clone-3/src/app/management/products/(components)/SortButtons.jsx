import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SortBar = ({ optionProps, defaultSortField }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleChangeDirection = (event) => {
    const direction = event.target.value;
    const params = new URLSearchParams(searchParams);
    params.set("sortDir", direction);
    replace(`${pathname}?${params}`);
  };
  const handleChangeField = (event) => {
    const field = event.target.value;
    const params = new URLSearchParams(searchParams);
    params.set("sortField", field);
    replace(`${pathname}?${params}`);
  };

  return (
    <Box className="flex w-[45rem] flex-row items-center gap-6">
      <FormControl>
        <InputLabel id="demo-simple-select-label">Sort field :</InputLabel>
        {/*<p className="w-1/3 text-sm uppercase">Sort field :</p>*/}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Sort field :"
          className="w-[20rem]"
          defaultValue={defaultSortField}
          onChange={handleChangeField}
        >
          {optionProps}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="demo-simple-select-label">Sort direction :</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select2"
          label="Sort direction :"
          className="w-[20rem]"
          defaultValue="asc"
          onChange={handleChangeDirection}
        >
          <MenuItem value="asc">Asc</MenuItem>
          <MenuItem value="desc">Desc</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortBar;
