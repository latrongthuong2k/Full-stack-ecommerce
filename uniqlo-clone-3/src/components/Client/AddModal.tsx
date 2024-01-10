"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { OnCartProductItemData, ProductFullInfo } from "@/lib/types";
import { useRouter } from "next/navigation";

type props = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
  productData: ProductFullInfo;
};
const AddModal = ({ isOpen, onOpen, onOpenChange, productData }: props) => {
  const router = useRouter();
  // const { totalAmount, totalQuantity, processCalculateAmount } =
  //   usePaymentContext();
  // const { isCartAction } = useCartAndWishlist();
  const [total, setTotal] = useState({ amount: 0, quantity: 0 });
  //
  useEffect(() => {
    const cartItemsStorage = localStorage.getItem("cart-items");
    let parsedCartItems: OnCartProductItemData[] = cartItemsStorage
      ? JSON.parse(cartItemsStorage)
      : [];
    let totalAmount = 0;
    let totalQuantity = 0;
    parsedCartItems.forEach((cartItem) => {
      totalAmount += cartItem.unitPrice * cartItem.quantity;
      totalQuantity += cartItem.quantity;
    });
    setTotal({ amount: totalAmount, quantity: totalQuantity });
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                カートに商品が追加されました
              </ModalHeader>
              <ModalBody>
                <div className={"flex gap-5"}>
                  <p className={"text-xl font-bold text-amber-800"}>
                    商品合計: ({total.quantity}点)
                  </p>
                  <p className={"text-xl font-bold text-amber-800"}>
                    ¥{total.amount.toLocaleString("ja-JP")}
                  </p>
                </div>
                <p>
                  通常商品（UNIQLO
                  FLOWERを除く）は、¥4,990以上のお買い物または「店舗受取り」の場合は送料無料です。
                </p>
              </ModalBody>
              <ModalFooter className={"flex justify-evenly gap-10"}>
                <button
                  className={"w-4/6 border bg-black py-4 text-white"}
                  onClick={() => {
                    onClose();
                    router.push("/jp/cart");
                  }}
                >
                  カートを見る
                </button>
                <button
                  className={"w-4/6 border py-4 text-black"}
                  onClick={onClose}
                >
                  買い物を続ける
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddModal;
