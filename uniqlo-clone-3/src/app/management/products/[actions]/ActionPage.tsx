"use client";
import React, { useContext, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import DropdownRendered from "@/app/products/(components)/DropdownRendered";
import InputRendered from "@/app/products/(components)/InputRendered";
import CheckboxesTags from "@/app/products/(components)/CheckBoxesTags";
import { DtoContext } from "@/app/context/DataProvider";
import { DataState, Product } from "@/Type/type";
import ImagesComponent from "@/app/products/(components)/Images";
import Loading from "@/components/Loading";
import { AnnounceModalProvider } from "@/app/context/ModalContext";
import { getCategories, getSizes } from "@/api/services/ClientService";
import { Category, ProductFullInfo, Size } from "@/lib/types";
import { getProductById } from "@/api/services/AuthService";

export const target = [
  "product_name",
  "price",
  "category",
  "stock_quantity",
  "color",
  "size",
  "tag",
  "client_type",
  "supplier",
];

const ActionPage = () => {
  const pathname = usePathname();
  const [descriptionInput, setDescriptionInput] = useState("");
  const [serverFetchImageUrl, setServerFetchImageUrl] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [reloadFlag, setReloadFlag] = useState(false);
  const [isDataProductLoaded, setIsDataProductLoaded] = useState(false);
  const params = useSearchParams();
  // @ts-ignore
  const { setDto, updateState, handleSubmit } = useContext(DtoContext);
  // Data fetched from server
  const [productById, setDataProduct] = useState<ProductFullInfo>({
    productId: 0,
    sku: "",
    productName: "",
    description: "",
    unitPrice: 0,
    stockQuantity: 0,
    categoryId: 0,
    status: true,
    sizes: [],
    productImages: [],
  });
  const [categories, setCategories] = useState<Category[]>();
  const [sizes, setSizes] = useState<Size[]>();

  const descriptionHandlerChanged = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const value = e.target.value;
    if (value.length > 1) {
      updateState({ field: "description", value: value });
    }
    setDescriptionInput(value);
  };
  // reset
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getCategories();
      try {
        setCategories(response?.data);
      } catch (err) {
        console.log(err);
      }
    };
    const fetchSizes = async () => {
      const response = await getSizes();
      try {
        setSizes(response?.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
    fetchSizes();
    setIsDataProductLoaded(true);
  }, []);

  useEffect(() => {
    if (pathname === "/products/edit") {
      const productId = params.get("productId");
      const fetchProduct = async () => {
        const response = await getProductById(productId);
        // setDto(response.data);
        setDataProduct(await response?.data);
      };
      fetchProduct();
    }
  }, [params, pathname, setDto]);

  // one product
  useEffect(() => {
    const productId = params.get("productId");
    const fetchImagesData = async () => {
      // oldImages [keys, urls]
      setImageLoading(true);
      const oldImages = await fetchImages(productId);
      if (oldImages.success && oldImages.data?.length > 0) {
        setServerFetchImageUrl(oldImages.data);
      }
      setImageLoading(false);
    };
    setLoading(true);
    fetchImagesData();
    setLoading(false);
  }, [reloadFlag, params]);

  useEffect(() => {
    if (productById.description)
      updateState({ field: "description", value: productById.description });
  }, [productById.description]);

  const pathSegments = pathname.split("/");
  const modeName = pathSegments.pop();
  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div>
          <h2 className="text-2xl font-semibold leading-tight">
            {modeName === "edit" ? "Edit Product" : "Add Product"}
          </h2>
        </div>
        <div className="my-5">
          {/*Form*/}
          <form
            onSubmit={
              modeName === "edit"
                ? (e) => {
                    handleSubmit(e, "update", params.get("productId"));
                  }
                : (e) => {
                    handleSubmit(e, "create");
                    // route.push("/products");
                  }
            }
          >
            {!isDataProductLoaded ? (
              <Loading />
            ) : (
              <div className="-mx-3 mb-6 flex flex-wrap gap-y-3">
                {/*Product name*/}
                <InputRendered
                  title={"productName"}
                  modeName={"add"}
                  showTitle={"product name"}
                  defaultValue={productById.productName}
                />
                {/*price*/}
                <InputRendered
                  title={"price"}
                  modeName={"add"}
                  showTitle={"price"}
                  defaultValue={productById.price}
                />
                {/*Stock quantity*/}
                <InputRendered
                  title={"stockQuantity"}
                  modeName={"add"}
                  showTitle={"stock quantity"}
                  defaultValue={productById.stockQuantity}
                />

                {/* categories */}
                <DropdownRendered
                  props={data?.categories}
                  field={"categoryId"}
                  showTitle={"category"}
                  defaultValue={productById.categoryId}
                />
                {/* supplier */}
                <DropdownRendered
                  props={data?.suppliers}
                  field={"supplierId"}
                  showTitle={"supplier"}
                  defaultValue={productById.supplierId}
                />

                {/*colors */}
                <CheckboxesTags
                  props={data?.colors}
                  title={"colors"}
                  showTitle={"colors"}
                  isDataLoaded={isDataProductLoaded}
                  defaultValue={productById.colors}
                />

                {/*/!* sizes *!/*/}

                <CheckboxesTags
                  props={data?.sizes}
                  title={"sizes"}
                  showTitle={"sizes"}
                  isDataLoaded={isDataProductLoaded}
                  defaultValue={productById.sizes}
                />

                {/*/!* tags *!/*/}
                <CheckboxesTags
                  props={data?.tags}
                  title={"tags"}
                  showTitle={"tags"}
                  isDataLoaded={isDataProductLoaded}
                  defaultValue={productById.tags}
                />
                {/*/!* client type *!/*/}
                <CheckboxesTags
                  props={data?.clientTypes}
                  title={"clientTypes"}
                  showTitle={"client Types"}
                  isDataLoaded={isDataProductLoaded}
                  defaultValue={productById.clientTypes}
                />
              </div>
            )}

            {/*Images.jsx*/}
            {loading ? (
              <Loading />
            ) : (
              <AnnounceModalProvider>
                <ImagesComponent
                  imageLoading={imageLoading}
                  serverImageUrl={serverFetchImageUrl}
                  setReloadFlag={setReloadFlag}
                  targetId={params.get("productId")}
                />
              </AnnounceModalProvider>
            )}
            {/*Description*/}
            <div className="-mx-3 mb-2 flex flex-wrap">
              <div className="w-full px-3">
                <label
                  className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-700"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="no-resize mb-3 block h-48 w-full resize-none rounded-[10px]
                  border-gray-200 px-4 py-3 leading-tight text-gray-700 focus:border-gray-500
                  focus:bg-white focus:outline-none"
                  id="description"
                  value={
                    descriptionInput
                      ? descriptionInput
                      : productById.description
                  }
                  onChange={descriptionHandlerChanged}
                ></textarea>
              </div>
            </div>
            <div className="flex justify-start">
              <button
                className="focus:shadow-outline rounded bg-purple-500  px-4 py-2 font-bold text-white
                shadow hover:bg-purple-400 focus:outline-none"
                type="submit"
              >
                {modeName === "edit" ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ActionPage;
