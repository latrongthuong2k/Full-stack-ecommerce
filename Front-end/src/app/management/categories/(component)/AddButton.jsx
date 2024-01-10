"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ModalContext } from "@/app/context/ModalContext";
import { productConnectedEntities } from "@/services/ProductService";
import { CategoryContextData } from "@/app/context/CategoryDataContext";
import { CircularProgress } from "@mui/joy";
import InputForCategory from "@/app/categories/(component)/InputForCategory";
import DropdownCategory from "@/app/categories/(component)/DropdownCategory";
import Image from "next/image";

// for add new

export default function AddButton({ buttonName }) {
  const { handleOpen, setTitle, setContent, setMode } =
    useContext(ModalContext);
  const { filesInfo, addFile, loading } = useContext(CategoryContextData);
  const [countImage, setCountImage] = useState(0);
  const [categoryDropdownData, setCategoryDropdownData] = useState();
  const [categoryModalContent, setModal] = useState(<></>);
  const [isLoaded, setIsLoaded] = useState(false);
  const handleFileChange = useCallback(
    (event) => {
      addFile(event.target.files[0]);
      setCountImage((prev) => prev + 1);
    },
    [addFile],
  ); // Thêm các dependencies cần thiết

  useEffect(() => {
    const fetchData = async () => {
      const response = await productConnectedEntities();
      // console.log(response.categories);
      setCategoryDropdownData(response?.categories);
    };
    fetchData();
  }, []);

  const categoriesContent = (
    categoryDropdownData,
    categoryDataById,
    handleFileChange,
  ) => {
    return loading ? (
      <div className={"flex h-full items-center justify-center"}>
        <CircularProgress />
      </div>
    ) : (
      <>
        <InputForCategory
          loading={loading}
          title={"categoryName"}
          modeName={"add"}
          showTitle={"Category name"}
          defaultValue={categoryDataById}
        />
        <DropdownCategory
          props={categoryDropdownData}
          title={"parentCategory"}
          showTitle={"parent categories"}
          defaultValue={categoryDataById}
        />
        <input
          type="file"
          id="categoryImage"
          name="categoryImage"
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="categoryImage"
          className="ml-3 inline-block w-1/4 cursor-pointer rounded-xl bg-gray-400 p-2 text-white transition
         duration-150 ease-in-out hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
        >
          <div className={"flex items-center justify-center"}>
            <Image
              src={"/upload_i.png"}
              width={80}
              height={80}
              alt={"uploadImage"}
            />
          </div>
        </label>
      </>
    );
  };

  const handleCustomModal = () => {
    setTitle("Add new Category");
    handleOpen();
    setContent(categoriesContent(categoryDropdownData, "", handleFileChange));
    setMode("add");
  };
  const btnDesign =
    "mb-4 w-[180px] rounded-[10px] bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700";
  return (
    <div className={"ml-[10px] h-[50px]"}>
      {
        <div
          className={`cursor-pointer ${btnDesign}`}
          onClick={handleCustomModal}
        >
          {buttonName}
        </div>
      }
    </div>
  );
}
