"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { OnCartProductItemData } from "@/lib/types";

type ProviderProps = {
  children: React.ReactNode;
};
type TotalState = {
  amount: number;
  quantity: number;
};

type PaymentContextType = {
  total: TotalState;
  setTotal: React.Dispatch<React.SetStateAction<TotalState>>;
  processCalculateAmount: (cartItems: OnCartProductItemData[]) => void;
};

export const PaymentContext = createContext<PaymentContextType | null>(null);

export default function PaymentProvider({ children }: ProviderProps) {
  const [total, setTotal] = useState({ amount: 0, quantity: 0 });

  const processCalculateAmount = useCallback(
    (cartItems: OnCartProductItemData[]) => {
      let totalAmount = 0;
      let totalQuantity = 0;
      cartItems.forEach((cartItem) => {
        totalAmount += cartItem.totalPrice;
        totalQuantity += cartItem.quantity;
      });
      setTotal({ amount: totalAmount, quantity: totalQuantity });
    },
    [],
  );

  return (
    <PaymentContext.Provider
      value={{
        total,
        setTotal,
        processCalculateAmount,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePaymentContext() {
  const context = useContext(PaymentContext);
  if (context === null) {
    throw new Error("usePaymentContext must be used within a PaymentProvider");
  }

  return context;
}
