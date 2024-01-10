import React, { useContext, useEffect, useState } from "react";
import { FilledInput, FormControl, InputLabel } from "@mui/material";
import { CategoryContextData } from "@/app/context/CategoryDataContext";

const InputForCategory = ({
  loading,
  modeName,
  title,
  showTitle,
  defaultValue,
}) => {
  const { dto, setDto } = useContext(CategoryContextData);
  const [value, setValue] = useState(defaultValue.name || "");
  const [error, setError] = useState("");
  useEffect(() => {
    setValue(defaultValue.name || "");
    const fieldName = title.replace(/\s+/g, "");
    setDto((prev) => ({ ...prev, [fieldName]: defaultValue.name }));
  }, []);
  const validateInput = (field, value) => {
    if (!value || value.trim().length === 0) {
      return "This field cannot be empty.";
    }
    switch (field.toLowerCase()) {
      case "categoryName":
        if (!value || value.length > 50) {
          return "User name cannot be empty and must be less than 50 characters.";
        }
        break;
      default:
        return "";
    }
    return "";
  };
  const handInput = (e) => {
    const inputValue = e.target.value;
    const fieldError = validateInput(title, inputValue);
    setError(fieldError);
    setValue(inputValue);
    if (!fieldError) {
      const fieldName = title.replace(/\s+/g, "");
      setDto((prev) => ({ ...prev, [fieldName]: inputValue }));
    }
  };

  return (
    <div className="w-full px-3">
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
          onChange={handInput}
          value={value}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </FormControl>
    </div>
  );
};

export default InputForCategory;
