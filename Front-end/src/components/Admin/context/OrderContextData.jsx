"use client";
import React, { createContext, useState } from "react";
import {
  sendDataToBackend,
  sendUpdateDataToBackend,
} from "@/services/OrdersService";
import { useNotification } from "@/app/context/NotificationContext";
import { useSearchParams } from "next/navigation";

export const BillContextData = createContext(undefined);
export const BillDataProvider = ({ children }) => {
  const [dto, setDto] = useState({
    customerEmail: "",
    status: "",
  });
  const [status, setStatus] = useState([]);
  const [dropDownStatus, setDropdownStatus] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const { showNotification } = useNotification();
  const params = useSearchParams();

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    const sendData = () => {
      switch (action) {
        case "create":
          return sendDataToBackend(dto);
        case "update":
          return sendUpdateDataToBackend(params.get("billId"), dto);
        default:
          throw new Error("Invalid action");
      }
    };
    try {
      const response = await sendData(dto);
      if (!response.success) {
        showNotification("error", response.err); // err: text
        return;
      }
      showNotification("success", response.data);
      setIsSubmit((prevState) => !prevState);
    } catch (error) {
      console.error("Error:", error);
      showNotification("error", error.message);
    }
  };
  return (
    <BillContextData.Provider
      value={{
        dto,
        setDto,
        isSubmit,
        status,
        setStatus,
        dropDownStatus,
        setDropdownStatus,
        handleSubmit,
      }}
    >
      {children}
    </BillContextData.Provider>
  );
};
