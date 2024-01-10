import React from "react";
import CategoryPage from "@/app/categories/categoryPage";
import { CateDataProvider } from "@/app/context/CategoryDataContext";
import { CategoryModalProvider } from "@/app/context/ModalContext";

const Page = ({ searchParams }) => {
  return (
    <CateDataProvider>
      <CategoryModalProvider>
        <CategoryPage searchParams={searchParams} />
      </CategoryModalProvider>
    </CateDataProvider>
  );
};

export default Page;
