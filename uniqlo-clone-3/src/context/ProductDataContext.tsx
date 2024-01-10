"use client";

import { ListProduct } from "@/lib/types";
import React, { createContext, useContext, useState } from "react";

type ProductDataContextProviderProps = {
  children: React.ReactNode;
};

type ProductDataContextType = {
  products: ListProduct;
  setProducts: React.Dispatch<React.SetStateAction<ListProduct>>;
  clientType: string;
  setClientType: React.Dispatch<React.SetStateAction<string>>;
  // categoryName: string;
  // setCategoryName: React.Dispatch<React.SetStateAction<string>>;
};

export const ProductDataContext = createContext<ProductDataContextType | null>(
  null,
);

export default function ProductContextProvider({
  children,
}: ProductDataContextProviderProps) {
  const [products, setProducts] = useState<ListProduct>({
    content: [],
    length: 0,
  });
  const [clientType, setClientType] = useState<string>("");
  // const [categoryName, setCategoryName] = useState<string>("");
  return (
    <ProductDataContext.Provider
      value={{
        clientType,
        setClientType,
        products,
        setProducts,
        // categoryName,
        // setCategoryName,
      }}
    >
      {children}
    </ProductDataContext.Provider>
  );
}

export function useProductDataContext() {
  const context = useContext(ProductDataContext);

  if (context === null) {
    throw new Error(
      "useProductDataContext must be used within an ProductContextProvider",
    );
  }

  return context;
}
