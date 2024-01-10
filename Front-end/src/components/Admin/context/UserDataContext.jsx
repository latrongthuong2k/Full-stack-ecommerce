"use client";
import React, { createContext, useState } from "react";
import { sendUserToBackend } from "@/services/AdminService";
import { useNotification } from "@/app/context/NotificationContext";

export const UserDataContext = createContext(undefined);
export const UserDataProvider = ({ children }) => {
  const { showNotification } = useNotification();
  const [dto, setDto] = useState({
    firstName: "",
    lastName: "",
    email: "",
    createdAt: "",
    updatedAt: "",
    role: "",
    // Thêm các trạng thái khác ở đây
  });

  /**
   * Returns an array of field names that have empty values in the given DTO object.
   *
   * @returns {string[]} An array containing the names of the fields with empty values.
   */
  const getEmptyFields = () => {
    return Object.entries(dto).reduce((emptyFields, [key, value]) => {
      if (Array.isArray(value) ? value.length === 0 : !value) {
        emptyFields.push(key);
      }
      return emptyFields;
    }, []);
  };
  const updateState = ({ field, value }) => {
    setDto((prevState) => {
      if (Array.isArray(value)) {
        return { ...prevState, [field]: [...value] };
      }
      return { ...prevState, [field]: value };
    });
  };
  const handleSubmit = async (e) => {
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
    try {
      const response = await sendUserToBackend(dto);
      console.log("Data sent successfully:", response);
    } catch (error) {
      console.log("Error:", error);
    }
    // route.push("/products");
  };

  return (
    <UserDataContext.Provider value={{ dto, updateState, handleSubmit }}>
      {children}
    </UserDataContext.Provider>
  );
};
