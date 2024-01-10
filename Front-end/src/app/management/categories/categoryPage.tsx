"use client";

import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CircularProgress } from "@mui/joy";
import { Category } from "@/Type/type";
import { TableProps } from "@/app/products/(components)/ProductPage";
import { deleteCategory, fetchCategories } from "@/services/CategoryService";
import PaginationTable from "@/app/products/(components)/PaginationTable";
import Search from "@/app/products/(components)/Search";
import SortBar from "@/app/products/(components)/SortButtons";
import { MenuItem } from "@mui/material";
import { useNotification } from "@/app/context/NotificationContext";
import { CategoryContextData } from "@/app/context/CategoryDataContext";
import AddButton from "@/app/categories/(component)/AddButton";

const LazyLoadedTableBody = dynamic(
  () => import("./(component)/LazyLoadedTbodyCategory"),
  {
    loading: () => (
      <tbody>
        <tr>
          <td className={"flex justify-center p-5"}>
            <CircularProgress />
          </td>
        </tr>
      </tbody>
    ),
  },
);

const thRender = (attribute: string) => (
  <th className="whitespace-nowrap p-2">
    <div className="p-2">{attribute}</div>
  </th>
);

const CategoryPage: React.FC<TableProps> = ({ searchParams }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  const sortField = searchParams?.sortField || "categoryName";
  const sortDir = searchParams?.sortDir || "asc";
  // @ts-ignore
  const { showNotification } = useNotification();
  // @ts-ignore
  const { isSubmit } = useContext(CategoryContextData);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Thực hiện gọi API để lấy danh sách các danh mục
        const categoryPage = await fetchCategories(
          q,
          page,
          10,
          sortField,
          sortDir,
        );
        if (categoryPage) {
          setTotalPage(categoryPage.totalPages);
          setCategories(categoryPage.categories);
        }
      } catch (error) {
        showNotification("error", "Error fetching categories : " + error);
      }
    };
    fetchData();
  }, [isSubmit, isDelete, page, q, sortDir, sortField, showNotification]);

  // handle delete
  const handleDelete = async (categoryId: number) => {
    try {
      const res = await deleteCategory(categoryId);
      if (res.success) showNotification("success", res.data);
      else showNotification("error", res.err);
      setIsDelete((prev) => !prev);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  return (
    <div className="container mx-auto mt-14">
      <AddButton buttonName={"Add new Category"} />
      <div className="flex justify-between">
        <Search />
        <SortBar
          optionProps={[
            <MenuItem value="categoryName" key="categoryName">
              Category Name
            </MenuItem>,
          ]}
          defaultSortField={"categoryName"}
        />
      </div>
      {/*Khung table */}
      <div className="overflow-x-auto rounded-[20px] border-4 bg-gray-50 pb-6 shadow-lg">
        {/*Table */}
        <table className="w-full table-auto">
          <thead>
            <tr className="mb-[5px] rounded bg-teal-800 text-center text-lg font-semibold uppercase text-white">
              {thRender("ID")}
              {thRender("Name")}
              {thRender("Parent Category")}
              {thRender("Actions")}
            </tr>
          </thead>
          {/*T-Body*/}

          <LazyLoadedTableBody
            handleDelete={handleDelete}
            categoriesTableData={categories}
          />
        </table>
      </div>
      <div className={"ml-2 mt-6"}>
        <PaginationTable totalPage={totalPage} />
      </div>
    </div>
  );
};

export default CategoryPage;
