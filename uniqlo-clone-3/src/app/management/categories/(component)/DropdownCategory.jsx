"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { CategoryContextData } from "@/app/context/CategoryDataContext";

const DropdownCategory = ({ props, title, showTitle, defaultValue }) => {
  const [selectedValue, setSelectedValue] = useState(
    defaultValue.parentCategory?.id || "",
  );
  const { setDto } = useContext(CategoryContextData);
  useEffect(() => {
    if (selectedValue) {
      // Cập nhật dto khi selectedValue thay đổi
      setDto((prev) => ({
        ...prev,
        [title]: selectedValue === -1 ? null : { id: selectedValue },
      }));
    }
  }, [selectedValue, setDto, title]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
  };
  return (
    <div className="p w-full px-3">
      <FormControl variant="filled" fullWidth>
        <InputLabel
          className="text-xs font-bold uppercase text-gray-700"
          id={title}
        >
          {showTitle}
        </InputLabel>
        <Select
          id={title}
          name={title}
          color="secondary"
          value={selectedValue}
          onChange={handleChange} //setparams
        >
          <MenuItem value={-1}>{"None"}</MenuItem>
          {props?.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
          <MenuItem>
            <Link
              className={"pl-[15px]"}
              href={"/categories"}
              value={"Add new"}
            >
              + Add new
            </Link>
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default DropdownCategory;
