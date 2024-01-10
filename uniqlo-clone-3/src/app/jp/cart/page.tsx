"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { OnCartProductItemData, ProductBasicInfo } from "@/lib/types";
import {
  checkOutOrder,
  deleteAllCartItem,
  deleteCartItem,
  getCartItems,
  updateCartItem,
} from "@/api/services/AuthService";
import { Select } from "@nextui-org/select";
import { SelectItem } from "@nextui-org/react";
import { defaultQuantity } from "@/app/jp/products/[productId]/Content";
import { useCartAndWishlist } from "@/context/CartAndWishlistContext";
import toast from "react-hot-toast";
import HeartWish from "@/components/Client/HeartWish";
import Loading from "@/app/loading";
import { usePaymentContext } from "@/context/PaymentContext";
import { useRouter } from "next/navigation";

const Cart = () => {
  const { total, setTotal, processCalculateAmount } = usePaymentContext();
  const { setIsCartAction } = useCartAndWishlist();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<OnCartProductItemData[]>([]);
  // const [quantityValue, setQuantityValue] = useState("1");
  // const [totalAmount, setTotalAmount] = useState(0);
  // const [totalQuantity, setTotalQuantity] = useState(0);
  const [isAnyChange, setIsAnyChange] = useState(false);

  const taxRate = 0.08;
  const tax = total.amount * taxRate;

  //------
  // mapping
  function mapToProductBasicInfo(
    item: OnCartProductItemData,
  ): ProductBasicInfo {
    return {
      productId: item.productId,
      productName: item.productName,
      unitPrice: item.unitPrice,
      s3ProductImages: item.s3ProductImages,
      sizes: [],
    };
  }
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  //------
  const handleChangeQuantity = async (
    productId: number,
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const quantityValue = e.target.value;
    const fetchUpdateCartItem = async () => {
      const response = await updateCartItem(productId, quantityValue);
      if (response) {
        if (response.error) {
          console.log(response.error);
          throw new Error(response.error || "Could not save.");
        }
      }
    };
    toast
      .promise(fetchUpdateCartItem(), {
        loading: "カートを更新しています...",
        success: "カートが更新されました!",
        error: "カートを更新する際にエラーが発生しました",
      })
      .catch((err) => console.log(err));
    setIsAnyChange((prevState) => !prevState);
  };
  //-----
  useEffect(() => {
    setIsAnyChange((prevState) => !prevState);
  }, []);
  useEffect(() => {
    // const itemListStorage = localStorage.getItem("cart-items");
    // const cartItemList = itemListStorage ? JSON.parse(itemListStorage) : [];

    const fetchedCartItems = async () => {
      const response = await getCartItems();
      if (response) {
        if (response.error) {
          console.log(response.error);
          throw new Error(response.error || "Could not save.");
        } else return response.data;
      }
    };
    fetchedCartItems().then((cartItems) => {
      localStorage.setItem("cart-items", JSON.stringify(cartItems));
      setCartItems(cartItems);
      processCalculateAmount(cartItems);
    });
  }, [isAnyChange]);

  const handleDeleteCartItem = (
    productId: number | null,
    sizeLabel: string | null,
  ) => {
    if (productId) {
      const processDeleteCartItem = async () => {
        const response = await deleteCartItem(productId, sizeLabel);
        if (response) {
          if (response.error) {
            console.log(response.error);
            throw new Error(response.error || "Could not save.");
          }
        }
      };
      toast
        .promise(processDeleteCartItem(), {
          loading: "カートを更新しています...",
          success: "カートが更新されました!",
          error: "カートを更新する際にエラーが発生しました",
        })
        .catch((err) => console.log(err));
    } else {
      const fetchDeleteCartItem = async () => {
        const response = await deleteAllCartItem();
        if (response) {
          if (response.error) {
            console.log(response.error);
            throw new Error(response.error || "Could not save.");
          }
        }
      };
      toast
        .promise(fetchDeleteCartItem(), {
          loading: "注文を処理しています…",
          success: "注文が完了しました!",
          error: "注文時にエラーが発生しました",
        })
        .catch((err) => console.log(err));
    }
    setIsAnyChange((prevState) => !prevState);
  };

  const handleCheckOutOrder = () => {
    const fetchCheckOutOrder = async () => {
      const response = await checkOutOrder();
      if (response) {
        if (response.error) {
          console.log(response.error);
          throw new Error(response.error || "Could not save.");
        }
      }
    };
    toast
      .promise(
        fetchCheckOutOrder().then(() => router.push("/")),
        {
          loading: "カートを更新しています...",
          success: "カートが更新されました!",
          error: "カートを更新する際にエラーが発生しました",
        },
      )
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div className={"pb-8 pt-3"}>
        <div className={"pb-8"}>
          <Image
            className={"border border-black "}
            src={"/freeShip-img.png"}
            width={1200}
            height={400}
            style={{ width: "auto" }}
            alt={"freeShip-image"}
          />
        </div>
        <p className={"pb-4 text-4xl"}>カート</p>
        <p className={"pb-4"}>
          通常商品（UNIQLO
          FLOWERを除く）は、¥4,990以上のお買い物または「店舗受取り」の場合は送料無料です。
        </p>
        <hr className={"py-4"} />
        <div className="flex ">
          <div className={"w-5/6"}>
            {/* products */}
            {cartItems?.map((cartItem) => (
              <div key={cartItem.productId}>
                <div className={"mb-10 flex justify-between pr-10"}>
                  {/* image  */}
                  <div
                    className={
                      "relative flex h-[250px] w-[250px] items-center justify-center "
                    }
                  >
                    <div>{isLoading && <Loading />}</div>
                    <Image
                      src={cartItem.s3ProductImages[0].url}
                      alt={cartItem.productName}
                      height={250}
                      width={250}
                      style={{
                        width: "auto",
                        height: "auto",
                        objectFit: "cover",
                      }}
                      priority={true}
                      onLoad={handleImageLoad}
                    />
                    <div className="absolute right-4 top-3 text-2xl">
                      <HeartWish
                        productData={mapToProductBasicInfo(cartItem)}
                      />
                    </div>
                  </div>
                  {/*　情報　*/}
                  <div className={"flex w-3/4 pl-5"}>
                    <div className={"w-4/6 font-light  leading-8"}>
                      <p className={"text-xl"}>{cartItem.productName}</p>
                      <p> 商品番号: {cartItem.sku}</p>
                      <p> サイズ: {cartItem.sizeLabel}</p>
                      <p className={"text-xl font-bold"}>
                        ¥{cartItem.unitPrice.toLocaleString("ja-JP")}
                      </p>
                      <button
                        onClick={() =>
                          handleDeleteCartItem(
                            cartItem.productId,
                            cartItem.sizeLabel,
                          )
                        }
                        className={"mt-5 pl-2 text-blue-600"}
                      >
                        削除
                      </button>
                    </div>
                    <div className={"w-2/6 "}>
                      <div className={"border border-black "}>
                        <Select
                          className={"text-xl"}
                          color={"default"}
                          size={"sm"}
                          label={"数量"}
                          radius={"none"}
                          defaultSelectedKeys={cartItem.quantity.toString()}
                          onChange={async (e) => {
                            await handleChangeQuantity(cartItem.productId, e);
                            setIsCartAction((prevState) => !prevState);
                          }}
                        >
                          {defaultQuantity().map((number) => (
                            <SelectItem key={number.value} value={number.value}>
                              {number.value}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                      <div className={"mt-4 flex gap-2"}>
                        <p>小計:</p>
                        <p className={"font-bold"}>
                          ¥{cartItem.totalPrice?.toLocaleString("ja-JP") || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className={"mb-8"} />
              </div>
            ))}
            <button
              onClick={() => handleDeleteCartItem(null, null)}
              className={"mt-5 pl-2 text-blue-600"}
            >
              すべて削除
            </button>
          </div>
          <div className="w-2/5 ">
            <div className={"mb-6 flex flex-col bg-gray-50 p-6"}>
              <div>
                <div className=" space-y-4">
                  <div className="flex justify-between border-gray-600">
                    <p className="text-gray-600">注文内容</p>
                    <p className="text-xl font-semibold">{total.quantity} 件</p>
                  </div>
                  <hr />
                  <div className="flex justify-between border-gray-600">
                    <p className="text-gray-600">商品合計</p>
                    <p className="text-xl font-semibold">
                      ¥{total.amount.toLocaleString("ja-JP")}
                    </p>
                  </div>
                  <hr />
                  <div className="flex justify-between border-gray-600">
                    <p className="text-gray-600">合計</p>
                    <p className="text-xl font-semibold">
                      ¥{total.amount.toLocaleString("ja-JP")}
                    </p>
                  </div>
                  <hr />
                  <div className={"flex justify-between"}>
                    <p className="  text-gray-600">内消費税</p>
                    <p className="text-xl font-semibold">
                      ¥{tax.toLocaleString("ja-JP")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className={" mb-6 border-2 border-b"}></div>

            <div>
              <p>
                通常商品（UNIQLO
                FLOWERを除く）は、¥4,990以上のお買い物または「店舗受取り」の場合は送料無料です。
              </p>
              <p className={"mb-6"}>
                「購入手続きへ」をタップしてから60分間在庫が確保されます。
              </p>
              <button
                onClick={handleCheckOutOrder}
                className={"w-full border bg-black py-4 text-white"}
              >
                注文する
                {/*購入手続きへ*/}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
