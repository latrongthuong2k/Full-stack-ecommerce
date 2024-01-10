"use client";

import React, { createContext, useContext, useState } from "react";
import { Key } from "@react-types/shared";

type FilterDataContextProviderProps = {
  children: React.ReactNode;
};

type FilterDataContextType = {
  sizesDto: Key[];
  setSizesDto: React.Dispatch<React.SetStateAction<Key[]>>;
  categoryDto: string;
  setCategoryDto: React.Dispatch<React.SetStateAction<string>>;
  priceDto: string;
  setPriceDto: React.Dispatch<React.SetStateAction<string>>;
};

export const filterDataContext = createContext<FilterDataContextType | null>(
  null,
);
export default function FilterDataContextProvider({
  children,
}: FilterDataContextProviderProps) {
  const [sizesDto, setSizesDto] = useState<Key[]>([]);
  const [categoryDto, setCategoryDto] = useState<string>("");
  const [priceDto, setPriceDto] = useState<string>("");

  return (
    <filterDataContext.Provider
      value={{
        sizesDto,
        setSizesDto,
        categoryDto,
        setCategoryDto,
        priceDto,
        setPriceDto,
      }}
    >
      {children}
    </filterDataContext.Provider>
  );
}

export function useFilterDataSectionContext() {
  const context = useContext(filterDataContext);

  if (context === null) {
    throw new Error(
      "useFilterDataSectionContext must be used within an FilterDataContextProvider",
    );
  }

  return context;
}
