"use client";
import React, { useContext, useEffect, useState } from "react";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { FormControl } from "@mui/material";
import { BillContextData } from "@/app/context/OrderContextData";

const DropdownOrderStatus = ({ title, showTitle, defaultValue }) => {
  const [selectedValue, setSelectedValue] = useState(
    defaultValue?.status || "",
  );
  const { dto, setDto } = useContext(BillContextData);
  useEffect(() => {
    if (selectedValue) {
      setDto((prev) => ({
        ...prev,
        customerEmail: defaultValue.customerEmail,
        [title]: selectedValue,
      }));
    }
  }, [defaultValue.customerEmail, selectedValue, setDto, title]);
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
  };
  const listStatus = [
    {
      id: 1,
      value: "APPROVE",
    },
    {
      id: 2,
      value: "CANCEL",
    },
    {
      id: 3,
      value: "PENDING",
    },
    {
      id: 4,
      value: "DELIVERING",
    },
    {
      id: 5,
      value: "RECEIVED",
    },
  ];

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
          {listStatus.map((item) => (
            <MenuItem key={item.id} value={item.value}>
              {item.value}
            </MenuItem>
          ))}
          <MenuItem></MenuItem>
        </Select>
      </FormControl>
    </div>
  );
};

export default DropdownOrderStatus;
