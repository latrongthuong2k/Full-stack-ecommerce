import React, { useContext } from "react";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";
import { tdRender } from "@/app/products/(components)/ProductPage";
import { ModalContext } from "@/app/context/ModalContext";
import { CategoryContextData } from "@/app/context/CategoryDataContext";
import {
  getAllCateExceptItSelfAndFather,
  getCategoryById,
} from "@/services/CategoryService";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/joy";
import InputForCategory from "@/app/categories/(component)/InputForCategory";
import DropdownCategory from "@/app/categories/(component)/DropdownCategory";
import Image from "next/image";
import { CiWarning } from "react-icons/ci";

const LazyLoadedTableBody = ({ handleDelete, categoriesTableData }) => {
  const { handleOpen, setTitle, setContent, setMode, setHandleDelete } =
    useContext(ModalContext);
  const { loading } = useContext(CategoryContextData);
  const { replace } = useRouter();
  const pathName = usePathname();
  const searchParams = new useSearchParams();
  const params = new URLSearchParams(searchParams);

  const getCategory = async (id, parentId) => {
    let allCate = null;
    if (id) {
      allCate = await getAllCateExceptItSelfAndFather(id, parentId);
    }
    const categoryDataById = await getCategoryById(id);
    if (allCate !== null) {
      categoryCustomModal(allCate.data, categoryDataById.data);
    }
    params.set("cateId", id);
    replace(`${pathName}?${params}`);
  };

  // for update
  const categoryCustomModal = (dropdownCategories, categoryDataById) => {
    setTitle("Edit categories");
    setContent(
      categoriesContent(dropdownCategories, categoryDataById, null, loading),
    );
    handleOpen();
    setMode("update");
  };

  const AnnounceModal = (callback) => {
    handleOpen();
    setTitle("Announce");
    setContent(
      <div className={"text-center"}>
        <p className={"mb-4 text-3xl font-bold caret-amber-600"}>Important</p>
        <div className={"mb-3 flex justify-center"}>
          <CiWarning className={"text-5xl "} />
        </div>
        <p className={"font-bold"}>
          This action will delete this category forever, are you sure to delete
          ?
        </p>
      </div>,
    );
    setMode("announce");
    setHandleDelete(() => callback);
  };

  return (
    <tbody className="divide-y divide-gray-100 text-sm">
      {categoriesTableData.map((category) => (
        <tr key={category.id}>
          {tdRender(category.id)}
          {tdRender(category.categoryName)}
          {tdRender(category.parentCategory?.categoryName || "No Parent")}
          <td className="flex justify-center whitespace-nowrap p-2">
            <button
              className={
                "mr-2 rounded-[20px] border-4 px-4 py-2 text-violet-400 hover:border-violet-300 hover:text-violet-600"
              }
              onClick={() =>
                getCategory(category.id, category.parentCategory?.id)
              }
            >
              <EditNoteTwoToneIcon />
              Edit
            </button>

            <button
              onClick={() =>
                AnnounceModal(() => {
                  handleDelete(category.id);
                })
              }
              className="rounded-[20px] border-4 px-4 py-2 text-red-400 hover:border-red-300 hover:text-red-600"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default LazyLoadedTableBody;

const categoriesContent = (
  categoryDropdownData,
  categoryDataById,
  handleFileChange,
  loading,
) => {
  return loading ? (
    <div className={"flex h-full items-center justify-center"}>
      <CircularProgress />
    </div>
  ) : (
    <>
      <InputForCategory
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
