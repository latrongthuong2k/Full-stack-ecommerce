"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  CartItemData,
  OnCartProductItemData,
  ProductBasicInfo,
  ProductFullInfo,
  Size,
} from "@/lib/types";
import { SelectItem, useDisclosure } from "@nextui-org/react";
import { Select } from "@nextui-org/select";
import {
  addProductToShoppingCart,
  getCartItems,
} from "@/api/services/AuthService";
import toast from "react-hot-toast";
import { clsx } from "clsx";
import { useCartAndWishlist } from "@/context/CartAndWishlistContext";
import AddModal from "@/components/Client/AddModal";
import HeartWish from "@/components/Client/HeartWish";
import { useLoginContextHolder } from "@/context/LoginContextHolder";

interface SizeProps {
  productData: ProductFullInfo;
  sizes: Size[];
}

type FetchResponse = {
  type: any | boolean | string | undefined;
};

export const defaultQuantity = () => [
  { value: "1" },
  { value: "2" },
  { value: "3" },
  { value: "4" },
  { value: "5" },
  { value: "6" },
  { value: "7" },
  { value: "8" },
  { value: "9" },
  { value: "10" },
];

const Content = ({ productData, sizes }: SizeProps) => {
  const { setIsCartAction } = useCartAndWishlist();
  const availableSizes = productData.sizes;
  const { getUserToken } = useLoginContextHolder();
  const [selectSize, setSelectSize] = useState(availableSizes[0]);
  const [quantityValue, setQuantityValue] = useState("1");
  const [cartItems, setCartItems] = useState<OnCartProductItemData[]>([]);
  const [cartItemObject, setCartItemObject] =
    useState<OnCartProductItemData | null>(null);

  // modal action
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // mapping
  function mapToProductBasicInfo(item: ProductFullInfo): ProductBasicInfo {
    return {
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.unitPrice,
      s3ProductImages: [],
      sizes: [],
    };
  }

  // nạp data
  useEffect(() => {
    const storedOrderData = localStorage.getItem("cart-item-obj");
    if (storedOrderData) {
      setCartItemObject(JSON.parse(storedOrderData));
    }
    const fetchAndCombineCartData = async () => {
      const localCartData = localStorage.getItem("cart-items");
      const userToken = getUserToken();
      let combinedCartData: OnCartProductItemData[] = localCartData
        ? JSON.parse(localCartData)
        : [];

      if (userToken !== null) {
        try {
          const response = await getCartItems();
          if (response && response.data) {
            const serverCartData: OnCartProductItemData[] = response.data;
            let numberAdd = 0;
            serverCartData.forEach((serverItem) => {
              const localItemIndex = combinedCartData.findIndex(
                (localItem) => localItem.productId === serverItem.productId,
              );
              if (localItemIndex > -1) {
                combinedCartData[localItemIndex] = {
                  ...combinedCartData[localItemIndex],
                  ...serverItem,
                };
              } else {
                numberAdd++;
                combinedCartData.push(serverItem);
              }
            });
            if (numberAdd > 1)
              toast.success(
                numberAdd + "件の製品がユーザーのカートに追加されました。",
              );
            setCartItems(combinedCartData);
            localStorage.setItem(
              "cart-items",
              JSON.stringify(combinedCartData),
            );
          } else if (response && response.error) {
            console.log(response.error);
          }
        } catch (error) {
          console.error("Could not fetch cart items", error);
        }
      } else {
        setCartItems(combinedCartData);
      }
    };
    fetchAndCombineCartData().then(() =>
      setIsCartAction((prevState) => !prevState),
    );
  }, []);

  //  Lưu data object
  useEffect(() => {
    const prepareCartItem: OnCartProductItemData = {
      productId: productData.productId,
      quantity: Number(quantityValue),
      sku: productData.sku,
      sizeLabel: selectSize.label,
      s3ProductImages: productData.productImages,
      productName: productData.productName,
      totalPrice: 0,
      unitPrice: productData.unitPrice,
    };
    setCartItemObject(prepareCartItem);
    localStorage.setItem("cart-item-obj", JSON.stringify(prepareCartItem));
  }, [selectSize, quantityValue]);

  const onThumbClick = (size: Size) => {
    if (isSizeAvailable(size)) {
      setSelectSize(size);
    }
  };

  // handle change quantity value
  const handleChangeQuantity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let value = e.target.value;
    setQuantityValue(value);
  };

  const handleAddItemToLocalCart = async () => {
    if (cartItemObject?.quantity === 0) {
      toast.error("製品の数は少なくとも 1 つ必要です。");
    }
    if (cartItemObject) {
      const existingIndex = cartItems.findIndex(
        (item) =>
          item.productId === cartItemObject.productId &&
          item.sizeLabel === cartItemObject.sizeLabel,
      );
      if (existingIndex === -1) {
        cartItems.push(cartItemObject);
      } else {
        if (cartItems[existingIndex].quantity < 7) {
          cartItems[existingIndex].quantity += cartItemObject.quantity;
        } else {
          throw new Error(
            "商品ごとに最大6個まで購入またはカートに追加できます。",
          );
        }
      }
      localStorage.setItem("cart-items", JSON.stringify(cartItems));
    }
  };
  //----------------------
  const handleSubmitItemToCart = useCallback(() => {
    const cartItemsStorage = localStorage.getItem("cart-items");
    let parsedCartItemList: CartItemData[] = [];
    let parseOnCartItem: OnCartProductItemData[] = [];
    if (cartItemsStorage) {
      parseOnCartItem = JSON.parse(cartItemsStorage);
      parsedCartItemList = parseOnCartItem.map((cartItemData) => {
        return {
          productId: cartItemData.productId,
          quantity: cartItemData.quantity,
          sizeLabel: cartItemData.sizeLabel,
        };
      });
    }
    // api
    const fetchAddToCart = async () => {
      const res = await addProductToShoppingCart(parsedCartItemList);
      if (res) {
        if (res.error) throw new Error(res.error || "Could not save.");
      }
    };
    toast.promise(fetchAddToCart(), {
      loading: "カートに追加しています...",
      success: "商品をカートに追加しました!",
      error: "カートに追加する際にエラーが発生しました",
    });
  }, [cartItemObject, cartItems]);

  //--------------------------------------
  const isSizeAvailable = (size: Size) =>
    availableSizes.some((availSize) => availSize.id === size.id);

  return (
    <>
      <div>
        <AddModal
          onOpen={onOpen}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          productData={productData}
        />

        {/*  sizes  */}
        <p>
          サイズ：
          {isSizeAvailable(selectSize) ? selectSize.label : "売り切れ"}
        </p>
        {/*  size renderer */}
        <div className={"mb-4 mt-3 flex cursor-pointer gap-1"}>
          {sizes.map((size) => (
            <div
              key={size.id}
              className={clsx("w-fit border-1 p-[2px]", {
                "border-black bg-black text-white": selectSize.id === size.id,
                "border-white  hover:border-black":
                  isSizeAvailable(size) && selectSize.id !== size.id,
                "border-white": !isSizeAvailable(size),
                "cursor-not-allowed opacity-40": !isSizeAvailable(size),
              })}
              onClick={() => onThumbClick(size)}
            >
              <div
                className={clsx("border border-gray-500 p-3", {
                  "border-white": selectSize.id === size.id,
                })}
              >
                <div className={"flex h-4 w-4 items-center justify-center"}>
                  {size.label}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className={"mb-4 text-3xl text-red-500"}>
          {`￥` + productData.unitPrice.toLocaleString("ja-JP")}
        </p>
        {/* quantity */}
        <div className={"mb-6 text-xl"}>
          <div>
            <Select
              size={"lg"}
              label={"数量"}
              radius={"none"}
              variant={"bordered"}
              defaultSelectedKeys={quantityValue}
              onChange={(e) => handleChangeQuantity(e)}
              className="max-w-[40%]"
            >
              {defaultQuantity().map((number) => (
                <SelectItem key={number.value} value={number.value}>
                  {number.value}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        {/*  add to cart button   */}
        <div className={"flex items-center gap-5"}>
          <button
            className={
              " w-4/6 border  border-red-600 bg-red-600 py-4 text-center text-gray-50"
            }
            onClick={async () => {
              let isSuccess = true;
              await handleAddItemToLocalCart().catch((err) => {
                isSuccess = false;
                if (err instanceof Error) toast.error(err.message);
              });
              if (isSuccess) {
                handleSubmitItemToCart();
                onOpen();
                setIsCartAction((prevState) => !prevState);
              }
            }}
          >
            カードに入れる
          </button>
          <div className=" flex items-center justify-center border border-black p-4 text-2xl">
            <HeartWish productData={mapToProductBasicInfo(productData)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
