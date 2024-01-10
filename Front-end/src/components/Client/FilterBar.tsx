"use client";
import React, { useEffect, useState } from "react";
import { Select } from "@nextui-org/select";
import { Selection, SelectItem } from "@nextui-org/react";
import { getSizes } from "@/api/services/ClientService";
import toast from "react-hot-toast";
import { Category, Size } from "@/lib/types";
import { useSectionWhenTrigger } from "@/lib/hooks";
import { fetchCategories } from "@/components/Client/CategoryRenderer";
import { useFilterDataSectionContext } from "@/context/FilterDataContext";

const fetchSizes = async () => {
  const response = await getSizes();
  if (response.error) {
    toast.error(response.error || "Error fetching sizes");
  } else {
    return response.data;
  }
};

interface categoryProps {
  id: number;
}

const FilterBar = (categoryProps: categoryProps) => {
  const {
    sizesDto,
    setSizesDto,
    categoryDto,
    setCategoryDto,
    priceDto,
    setPriceDto,
  } = useFilterDataSectionContext();
  const { ref } = useSectionWhenTrigger("content", 0.2);
  // set Data
  const [sizes, setSizes] = useState<Size[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  // selected values
  const [sizeValues, setSizeValues] = useState<Selection>(new Set([]));
  const [categoryValue, setCategoryValue] = useState<string>("");
  const [priceValue, setPriceValue] = useState<string>("");

  let priceOptions = [
    { id: 1, value: "500", label: "〜¥500" },
    { id: 2, value: "1000", label: "〜¥1000" },
    { id: 3, value: "2000", label: "〜¥2000" },
    { id: 4, value: "3000", label: "〜¥3000" },
    { id: 5, value: "4000", label: "〜¥4000" },
    { id: 6, value: "5000", label: "〜¥5000" },
    { id: 7, value: "6000", label: "〜¥6000" },
    { id: 8, value: "7000", label: "〜¥7000" },
    { id: 9, value: "8000", label: "〜¥8000" },
    { id: 10, value: "9000", label: "¥9000以上" },
  ];
  const handleSelectionChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    target: string,
  ) => {
    const value = e.target.value;
    if (target === "category") {
      if (value === "") {
        setCategoryDto("");
        setCategoryValue("");
      } else if (/^\d+$/.test(value)) {
        setCategoryDto(value);
        setCategoryValue(value);
      } else {
        console.error("Category must be number.");
      }
    } else if (target === "price") {
      if (value === "") {
        setPriceDto("");
        // setPriceValue("");
      } else if (/^\d+$/.test(value)) {
        setPriceDto(value);
        // setPriceValue(value);
      } else {
        console.error("Price must be number.");
      }
    }
  };
  const handleSizeChange = (value: Selection) => {
    setSizeValues(value);
    const sizeArray = Array.from(value);
    setSizesDto(sizeArray);
  };

  useEffect(() => {
    (async () => {
      const fetchedSizes = await fetchSizes();
      const fetchedCategories = await fetchCategories();
      setSizes(fetchedSizes);
      setCategories(fetchedCategories);
      setCategoryValue(categoryProps.id.toString());
    })();
  }, []);

  return (
    <section id={"content"} ref={ref}>
      <div className=" flex w-full flex-wrap gap-4 pb-6 pt-3 md:flex-nowrap">
        <Select
          label="選択カテゴリ"
          variant={"bordered"}
          radius={"full"}
          size={"sm"}
          selectedKeys={[categoryValue]}
          className={"max-w-xs"}
          onChange={(e) => handleSelectionChange(e, "category")}
        >
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.categoryName}
            </SelectItem>
          ))}
        </Select>
        {/* Size */}
        <Select
          label="サイズ"
          selectionMode={"multiple"}
          variant={"bordered"}
          radius={"full"}
          selectedKeys={sizeValues}
          size={"sm"}
          className="max-w-xs"
          onSelectionChange={(values) => handleSizeChange(values)}
        >
          {sizes?.map((size: Size, index) => (
            <SelectItem key={size.id} value={size.id}>
              {size.label}
            </SelectItem>
          ))}
        </Select>

        {/*<Button*/}
        {/*  size={"lg"}*/}
        {/*  radius={"full"}*/}
        {/*  variant="bordered"*/}
        {/*  onClick={toggleMenu}*/}
        {/*>*/}
        {/*  Open Menu*/}
        {/*</Button>*/}
        <Select
          label="価格"
          variant={"bordered"}
          radius={"full"}
          size={"sm"}
          selectedKeys={priceValue}
          className="max-w-xs"
          onChange={(e) => handleSelectionChange(e, "price")}
        >
          {priceOptions.map((price) => (
            <SelectItem key={price.value} value={price.value}>
              {price.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      {/*<DropdownMenu />*/}
    </section>
  );
};

export default FilterBar;
