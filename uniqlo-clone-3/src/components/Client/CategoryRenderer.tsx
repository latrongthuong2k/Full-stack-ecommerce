"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getCategories } from "@/api/services/ClientService";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import { Category } from "@/lib/types";
import { useProductDataContext } from "@/context/ProductDataContext";

export const fetchCategories = async () => {
  const response = await getCategories();
  if (response.error) {
    toast.error(response.error || "Error fetching categories");
  } else {
    return response.data;
  }
};

const CategoryRenderer = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { clientType } = useProductDataContext();

  useEffect(() => {
    (async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    })();
  }, []);

  return (
    <div className={"flex flex-wrap pt-24"}>
      {categories?.map((category: Category, index: number) => (
        <Link
          href={`/jp/client/${clientType}/${category.id}/${category.categoryName}`}
          key={category.id}
          className={"flex w-1/4 items-center justify-center gap-3 p-3"}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.37, 0.3, 0, 0.6],
              delay: 0.06 * index,
            }}
          >
            <div className={"relative mb-1 h-[4rem] w-[4rem]"}>
              <Image
                src={`${category.s3ProductImages?.url || "/next.svg"}`}
                width={100}
                height={100}
                quality={60}
                style={{ width: "auto" }}
                alt={category.categoryName}
              />
            </div>
            {category.categoryName}
          </motion.div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryRenderer;
