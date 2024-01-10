"use client";
import React, { createContext, useState } from "react";
import {
  deleteImagesFromServer,
  sendDataToBackend,
  sendUpdateDataToBackend,
  uploadMultipleFiles,
} from "@/services/ProductService";
import { useNotification } from "@/app/context/NotificationContext";
import { v4 as uuidV4 } from "uuid";
import { useRouter } from "next/navigation";

export const DtoContext = createContext(undefined);
export const DataProvider = ({ children }) => {
  const [dto, setDto] = useState({
    productName: "",
    price: 0,
    stockQuantity: 0,
    categoryId: 0,
    colors: [],
    sizes: [],
    tags: [],
    clientTypes: [],
    supplierId: 0,
    description: "",
    // Thêm các trạng thái khác ở đây
  });
  const [formData, setFormData] = useState(new FormData());
  const [filesInfo, setFilesInfo] = useState([]);
  const { showNotification } = useNotification();
  const router = useRouter();
  // Thêm file
  const addFile = (file) => {
    const fileId = uuidV4();
    const fileUrl = URL.createObjectURL(file);
    setFilesInfo((prev) => [...prev, { id: fileId, url: fileUrl }]);
    setFormData((prev) => {
      prev.append("file", file);
      return prev;
    });
  };
  /**
   * Deletes a file by its ID.
   *
   * @param {string} fileId - The ID of the file to be deleted.
   * @returns {void}
   */
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
   * Update the state of the DTO object with the given field and value.
   *
   * @param {Object} update - The field and value to be updated.
   * @param {string} update.field - The field to be updated.
   * @param {*} update.value - The value to be assigned to the field.
   * @returns {void}
   */
  const updateState = ({ field, value }) => {
    setDto((prevState) => {
      if (Array.isArray(value)) {
        return { ...prevState, [field]: [...value] };
      }
      return { ...prevState, [field]: value };
    });
  };

  /**
   * Kiểm tra xem có trường dữ liệu nào trong DTO bị trống hay không.
   *
   * @returns {string[]} - Danh sách các trường dữ liệu bị trống.
   */
  const getEmptyFields = () => {
    return Object.entries(dto).reduce((emptyFields, [key, value]) => {
      if (Array.isArray(value) ? value.length === 0 : !value) {
        emptyFields.push(key);
      }
      return emptyFields;
    }, []);
  };

  const handleDeleteImageFromServer = (productId, awsUrl, setReloadFlag) => {
    // console.log("inraaaa//" + id, imageKey);
    deleteImagesFromServer(productId, awsUrl)
      .then((response) => {
        if (response.status === 200) {
          showNotification("success", "Data delete successfully !");
        } else {
          throw new Error("Failed to delete image");
        }
      })
      .catch((error) => {
        console.log("Có lỗi: ", error.message);
        showNotification("error", "Failed to delete image !");
      });
    setReloadFlag((prev) => !prev);
  };

  /**
   * Handles form submission.
   *
   * @param {Event} e - The event object.
   * @param action
   * @param productId
   * @returns {Promise<void>} - A promise that resolves when the form submission is complete.
   */
  const handleSubmit = async (e, action, productId = null) => {
    // console.log(action);
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
    const sendData = (dto, productId) => {
      switch (action) {
        case "create":
          return sendDataToBackend(dto);
        case "update":
          return sendUpdateDataToBackend(productId, dto);
        default:
          throw new Error("Invalid action");
      }
    };
    try {
      const response = await sendData(dto, productId);
      if (!response.success) {
        showNotification("error", response.err);
      } else {
        if (formData.entries().next().value) {
          try {
            const uploadResponse = await uploadMultipleFiles(
              response.productId,
              formData,
            );
            if (!uploadResponse.success) {
              showNotification("error", response.message);
              return;
            }
            if (action === "create")
              showNotification("success", "Product create successfully!");
            else showNotification("success", "Product update successfully!");
            router.push("/products");
          } catch (uploadError) {
            console.error("Upload error:", uploadError);
            if (action === "create")
              showNotification("error", "Failed to create product!");
            else showNotification("error", "Failed to update product!");
          }
        } else {
          if (action === "create")
            showNotification("success", "Product create successfully!");
          else showNotification("success", "Product update successfully!");
          router.push("/products");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("error", error.message);
    }
    // router.push("/products");
  };

  return (
    <DtoContext.Provider
      value={{
        dto,
        setDto,
        updateState,
        handleSubmit,
        addFile,
        deleteFileById,
        handleDeleteImageFromServer,
        setFormData,
        formData,
        filesInfo,
        // imageUrls,
        // setImageUrls,
      }}
    >
      {children}
    </DtoContext.Provider>
  );
};
