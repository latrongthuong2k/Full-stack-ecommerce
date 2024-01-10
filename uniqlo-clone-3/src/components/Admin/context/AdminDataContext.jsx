"use client";
import React, { createContext, useState } from "react";
import {
  sendDataToBackend,
  sendUpdateDataToBackend,
} from "@/services/AdminService";
import { useNotification } from "@/app/context/NotificationContext";
import { useSearchParams } from "next/navigation";

export const AdminDataContext = createContext(undefined);
export const AdminDataProvider = ({ children }) => {
  const { showNotification } = useNotification();
  const [isSubmit, setIsSubmit] = useState(false);
  const params = useSearchParams();
  const [dto, setDto] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "ADMIN",
  });

  const [dtoForUpdate, setDtoForUpdate] = useState({
    firstName: "",
    lastName: "",
    changeEmailPassWordReq: {
      newEmail: "",
      changePasswordRequest: {
        currentPassword: "",
        newPassword: "",
        confirmationPassword: "",
      },
    },
  });
  const updateState = ({ field, value }) => {
    setDto((prevState) => {
      if (Array.isArray(value)) {
        return { ...prevState, [field]: [...value] };
      }
      return { ...prevState, [field]: value };
    });
  };
  const getEmptyFields = (target) => {
    const checkEmpty = (value) => {
      if (Array.isArray(value)) {
        return value.length === 0;
      } else if (typeof value === "object" && value !== null) {
        return Object.values(value).every(checkEmpty);
      } else {
        return !value;
      }
    };

    return Object.entries(target).reduce((emptyFields, [key, value]) => {
      if (checkEmpty(value)) {
        emptyFields.push(key);
      }
      return emptyFields;
    }, []);
  };

  const sendData = async (action) => {
    switch (action) {
      case "create":
        return await sendDataToBackend(dto);

      case "update":
        return await sendUpdateDataToBackend(
          params.get("userId"),
          dtoForUpdate,
        );

      default:
        throw new Error("Invalid action");
    }
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();

    const checkAndShowEmptyFields = (emptyFields) => {
      if (Object.keys(emptyFields).length > 0) {
        showNotification(
          "error",
          `Please fill in the following fields:\n${emptyFields}`,
        );
        return true;
      }
      return false;
    };
    if (action === "create") {
      const emptyFields = getEmptyFields(dto);
      if (checkAndShowEmptyFields(emptyFields)) return;
    }

    try {
      const response = await sendData(action);
      if (response && !response.success) {
        const errorsToString = (errors) => {
          return Object.entries(errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join("\n");
        };
        showNotification(
          "error",
          typeof response.err === "object"
            ? errorsToString(response.err)
            : response.err,
        );
        return;
      }
      if (response) {
        showNotification("success", response.data);
        setIsSubmit((prevState) => !prevState);
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification("error", error.message);
    }
  };
  return (
    <AdminDataContext.Provider
      value={{
        dto,
        setDto,
        dtoForUpdate,
        setDtoForUpdate,
        updateState,
        handleSubmit,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};
