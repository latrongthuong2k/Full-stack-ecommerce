import React, { useContext, useEffect, useState } from "react";
import { FilledInput, FormControl, InputLabel } from "@mui/material";
import { AdminDataContext } from "@/app/context/AdminDataContext";

const InputDataForAdmin = ({ modeName, title, showTitle, defaultValue }) => {
  const { dtoForUpdate, dto, setDtoForUpdate, updateState } =
    useContext(AdminDataContext);
  const [inputValue, setInputValue] = useState(defaultValue || ""); // string input
  const [error, setError] = useState("");
  useEffect(() => {
    if (modeName === "update") {
      const updatedValue = defaultValue;
      switch (title) {
        case "email":
          setDtoForUpdate((prev) => ({
            ...prev,
            changeEmailPassWordReq: {
              ...prev.changeEmailPassWordReq,
              newEmail: updatedValue,
            },
          }));
          break;
        case "firstName":
          setDtoForUpdate((prev) => ({
            ...prev,
            firstName: updatedValue,
          }));
          break;
        case "lastName":
          setDtoForUpdate((prev) => ({
            ...prev,
            lastName: updatedValue,
          }));
          break;
      }
    }
  }, [defaultValue, modeName, setDtoForUpdate, title]);

  const validateInput = (field, value) => {
    switch (field.toLowerCase()) {
      case "firstName":
        if (!value || value.length > 50) {
          return "Admin firstName cannot be empty and must be less than 50 characters.";
        }
        break;
      case "lastName":
        if (!value || value.length > 50) {
          return "Admin lastName name cannot be empty and must be less than 50 characters.";
        }
        break;
      case "email":
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          return "Invalid email format.";
        }
        break;
      case "password":
        if (value.length < 8) {
          return "Password must be at least 8 characters long.";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  const handInput = (e) => {
    const value = e.target.value;
    const fieldError = validateInput(title, value);
    setError(fieldError);
    setInputValue(value);
    if (!fieldError) {
      // input for format update
      if (modeName === "update") {
        if (title === "email") {
          setDtoForUpdate((prev) => ({
            ...prev,
            changeEmailPassWordReq: {
              ...prev.changeEmailPassWordReq,
              newEmail: value,
            },
          }));
        } else if (title === "currentPassword") {
          setDtoForUpdate((prev) => ({
            ...prev,
            changeEmailPassWordReq: {
              ...prev.changeEmailPassWordReq,
              changePasswordRequest: {
                ...prev.changeEmailPassWordReq.changePasswordRequest,
                currentPassword: value,
              },
            },
          }));
        } else if (title === "newPassword") {
          setDtoForUpdate((prev) => ({
            ...prev,
            changeEmailPassWordReq: {
              ...prev.changeEmailPassWordReq,
              changePasswordRequest: {
                ...prev.changeEmailPassWordReq.changePasswordRequest,
                newPassword: value,
              },
            },
          }));
        } else if (title === "confirmationPassword") {
          setDtoForUpdate((prev) => ({
            ...prev,
            changeEmailPassWordReq: {
              ...prev.changeEmailPassWordReq,
              changePasswordRequest: {
                ...prev.changeEmailPassWordReq.changePasswordRequest,
                confirmationPassword: value,
              },
            },
          }));
        } else {
          updateState({ field: title, value });
        }
        // input for format add
      } else updateState({ field: title, value });
    }
  };

  return (
    <div className="w-full px-3 md:mb-0">
      <FormControl fullWidth variant="filled" error={!!error}>
        <InputLabel
          htmlFor={title}
          className="text-xs font-bold uppercase text-gray-700"
        >
          {showTitle}
        </InputLabel>
        <FilledInput
          label={showTitle}
          id={title}
          color="secondary"
          type="text"
          readOnly={modeName === "edit"}
          onChange={handInput}
          value={inputValue}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </FormControl>
    </div>
  );
};

export default InputDataForAdmin;
