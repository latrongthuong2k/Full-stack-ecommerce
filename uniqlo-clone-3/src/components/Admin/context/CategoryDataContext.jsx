"use client";
import React, { createContext, useState } from "react";
import {
  sendCateToBackend,
  sendUpdateDataToBackend,
  uploadMultipleFiles,
} from "@/services/CategoryService";
import { useNotification } from "@/app/context/NotificationContext";
import { useSearchParams } from "next/navigation";
import { v4 as uuidV4 } from "uuid";

export const CategoryContextData = createContext(undefined);
export const CateDataProvider = ({ children }) => {
  const [dto, setDto] = useState({
    categoryName: "",
    parentCategory: null,
    // Thêm các trạng thái khác ở đây
  });
  const [categories, setCategories] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [filesInfo, setFilesInfo] = useState([]);
  const [formData, setFormData] = useState(new FormData());
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const { showNotification } = useNotification();

  const addFile = (file) => {
    const fileId = uuidV4();
    const fileUrl = URL.createObjectURL(file);
    setFilesInfo((prev) => [...prev, { id: fileId, url: fileUrl }]);
    setFormData((prev) => {
      prev.append("file", file);
      return prev;
    });
  };
  const deleteFileById = (fileId) => {
    // console.log(fileId);
    const fileToDelete = filesInfo.find((info) => info.id === fileId);
    if (fileToDelete) {
      URL.revokeObjectURL(fileToDelete.url); // Giải phóng bộ nhớ
    }
    const updatedFilesInfo = filesInfo.filter((info) => info.id !== fileId);
    setFilesInfo(updatedFilesInfo);
    // setImageUrls(updatedFilesInfo.map((info) => info.url));
  };
  /**
   * Returns an array of field names that have empty values in the given DTO object.
   *
   * @returns {string[]} An array containing the names of the fields with empty values.
   */
  const getEmptyFields = () => {
    return Object.entries(dto).reduce((emptyFields, [key, value]) => {
      if (
        Array.isArray(value)
          ? value.length === 0
          : !value && key !== "parentCategory"
      ) {
        emptyFields.push(key);
      }
      return emptyFields;
    }, []);
  };
  const handleSubmit = async (e, action) => {
    e.preventDefault();
    // check Dto
    const emptyFields = getEmptyFields();
    if (emptyFields.length > 0) {
      const fieldsList = emptyFields.join("\n");
      showNotification(
        "error",
        `Please fill in the following fields:\n${fieldsList}`,
      );
      return;
    }
    const sendData = (dto, categoryId) => {
      switch (action) {
        case "create":
          return sendCateToBackend(dto);
        case "update":
          return sendUpdateDataToBackend(categoryId, dto);
        default:
          throw new Error("Invalid action");
      }
    };
    try {
      setLoading(true);
      const response = await sendData(dto, params.get("cateId")); // nơi id vào
      if (!response.success) {
        showNotification("error", response.err); // err: text
        return;
      }
      const imageResponse = await uploadMultipleFiles(response.data, formData);
      if (imageResponse.success) {
        showNotification("success", "success upload");
        setIsSubmit((prevState) => !prevState);
      } else {
        const exceptions = await imageResponse.json();
        showNotification("error", exceptions.message);
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("error", error.message);
    }
    setLoading(false);
  };
  return (
    <CategoryContextData.Provider
      value={{
        addFile,
        deleteFileById,
        filesInfo,
        dto,
        setDto,
        isSubmit,
        categories,
        setCategories,
        loading,
        handleSubmit,
      }}
    >
      {children}
    </CategoryContextData.Provider>
  );
};
