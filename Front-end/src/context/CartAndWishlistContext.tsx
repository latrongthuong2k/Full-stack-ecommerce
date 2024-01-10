"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createWishProducts,
  getWishProducts,
} from "@/api/services/AuthService";
import { WishListRes } from "@/lib/types";

type ProviderProps = {
  children: React.ReactNode;
};

type WishStateProps = Record<number, boolean>;

type CartAndWishlistContextType = {
  isCartAction: boolean;
  setIsCartAction: React.Dispatch<React.SetStateAction<boolean>>;
  isWishProductAction: boolean;
  setIsWishProductAction: React.Dispatch<React.SetStateAction<boolean>>;
  wishStates: WishStateProps;
  setWishStates: React.Dispatch<React.SetStateAction<WishStateProps>>;
};

export const CartAndWishlistContext =
  createContext<CartAndWishlistContextType | null>(null);
export default function CartAndWishlistProvider({ children }: ProviderProps) {
  const [isCartAction, setIsCartAction] = useState(false);
  const [isWishProductAction, setIsWishProductAction] = useState(false);
  const [wishStates, setWishStates] = useState<WishStateProps>({});
  const [isFirstTimeFetch, setIsFirstTimeFetch] = useState(false);

  useEffect(() => {
    const fetchWishProducts = async () => {
      const response = await getWishProducts();
      if (response) {
        if (response.error) {
          console.log(Error(response.error || "Can't get wishlist data"));
        } else {
          const data: WishListRes[] = response.data;
          const serverState: WishStateProps = {};
          data.forEach((wish) => {
            // tạo lại mới từ sever
            serverState[wish.product.productId] = true;
          });
          return serverState;
        }
      }
    };
    const processRebuildWishStatesFromServer = async (
      serverState: WishStateProps | undefined,
    ) => {
      if (serverState) {
        const savedWishState = localStorage.getItem("wishState");
        const localState = savedWishState ? JSON.parse(savedWishState) : {};
        const rebuildState: WishStateProps = {};
        Object.keys(serverState).forEach((productIdStr) => {
          const productId = Number(productIdStr);
          rebuildState[productId] = localState.hasOwnProperty(productId);
        });
        setWishStates(rebuildState);
        localStorage.setItem("wishState", JSON.stringify(rebuildState));
      } else {
        let empty: WishStateProps = {};
        setWishStates(empty);
      }
      setIsFirstTimeFetch(true);
    };
    const processSaveWishesState = () => {
      const localSavedWishState = localStorage.getItem("wishState");
      const resultData: WishStateProps = localSavedWishState
        ? JSON.parse(localSavedWishState)
        : {};
      const saveWishProducts = async () => {
        const productIds = Object.keys(resultData)
          .filter((key) => resultData[Number(key)]) //true
          .map(Number);
        let productsObject = {
          productIds: productIds,
        };
        const response = await createWishProducts(productsObject);
        if (response) {
          if (response.error) {
            console.log(response.error);
            throw new Error(response.error || "Could not save.");
          }
        }
      };
      saveWishProducts().catch((err) => console.log(err));
    };
    fetchWishProducts()
      .then(async (serverState) => {
        if (!isFirstTimeFetch) {
          await processRebuildWishStatesFromServer(serverState);
        }
        processSaveWishesState();
      })
      .catch((error) => console.error("Error fetching wishlist data", error));
  }, [isWishProductAction, isCartAction]);

  return (
    <CartAndWishlistContext.Provider
      value={{
        isCartAction,
        setIsCartAction,
        isWishProductAction,
        setIsWishProductAction,
        wishStates,
        setWishStates,
      }}
    >
      {children}
    </CartAndWishlistContext.Provider>
  );
}

export function useCartAndWishlist() {
  const context = useContext(CartAndWishlistContext);
  if (context === null) {
    throw new Error(
      "useCartAndWishlist must be used within a CartAndWishlistProvider",
    );
  }
  return context;
}
