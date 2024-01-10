"use client";
import React from "react";
import ProductsRender from "@/components/Client/ProductsRender";
import { motion } from "framer-motion";
import FilterBarDataContextProvider from "@/context/FilterDataContext";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import ProductContextProvider, {
  useProductDataContext,
} from "@/context/ProductDataContext";
// Category Page
const Category = ({ params }: { params: { slug: string[] } }) => {
  const [cateId, categoryName] = params.slug;
  const encodeName = decodeURIComponent(categoryName);
  return (
    <>
      <div className={"pt-[4rem]"}>
        {/* Breadcrumbs */}
        <Breadcrumbs size={"lg"} className={"mb-8"}>
          <BreadcrumbItem>men</BreadcrumbItem>
          <BreadcrumbItem>{encodeName}</BreadcrumbItem>
        </Breadcrumbs>
        <motion.div>
          {/*category name*/}
          <p className={" mb-4 text-4xl"}>{encodeName}</p>
          {/* products of category */}
          <FilterBarDataContextProvider>
            <ProductsRender
              rootName={"men"}
              categoryId={Number(cateId)}
              categoryName={encodeName}
            />
          </FilterBarDataContextProvider>
        </motion.div>
      </div>
    </>
  );
};

export default Category;
