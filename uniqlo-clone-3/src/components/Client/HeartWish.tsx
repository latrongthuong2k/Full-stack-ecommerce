import React from "react";
import { motion } from "framer-motion";
import { selectedAnimationProps, unselectedAnimationProps } from "@/lib/data";
import { FaHeart } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { useCartAndWishlist } from "@/context/CartAndWishlistContext";
import { ProductBasicInfo } from "@/lib/types";

type props = {
  productData: ProductBasicInfo;
};
const HeartWish = ({ productData }: props) => {
  const { wishStates, setWishStates, setIsWishProductAction } =
    useCartAndWishlist();

  const handleWishProduct = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    const promise = async () => {
      setWishStates((prevState) => {
        const newState = { ...prevState, [productId]: !prevState[productId] };
        // Lưu trạng thái mới vào localStorage
        localStorage.setItem("wishState", JSON.stringify(newState));
        return newState;
      });
    };
    await promise();
    setIsWishProductAction((prevState) => !prevState);
  };
  return (
    <>
      <button onClick={(e) => handleWishProduct(e, productData.productId)}>
        <motion.div
          {...(wishStates[productData.productId]
            ? selectedAnimationProps
            : unselectedAnimationProps)}
        >
          <FaHeart
            className={`text-red-500 ${
              wishStates[productData.productId] ? "" : "hidden"
            }`}
          />
        </motion.div>
        <motion.div
          {...(!wishStates[productData.productId]
            ? selectedAnimationProps
            : unselectedAnimationProps)}
        >
          <CiHeart
            className={`text-gray-500 ${
              !wishStates[productData.productId] ? "" : "hidden"
            }`}
          />
        </motion.div>
      </button>
    </>
  );
};

export default HeartWish;
