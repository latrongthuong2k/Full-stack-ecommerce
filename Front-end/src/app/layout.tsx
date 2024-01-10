import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import ActiveSectionContextProvider from "@/context/active-section-context";
import { Providers } from "@/components/providers/Provider";
import { HeaderProvider } from "@/components/providers/HeaderProdvider";
import Footer from "@/components/Client/footer/Footer";
import CartAndWishlistProvider from "@/context/CartAndWishlistContext";
import PaymentProvider from "@/context/PaymentContext";
import { SearchBarProvider } from "@/components/providers/SearchBarProvider";
import ProductContextProvider from "@/context/ProductDataContext";
import LoginStatusProvider from "@/context/LoginContextHolder";

const font = Roboto_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Uniqlo",
  description: "Shopping not-found.tsx",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} flex flex-col justify-between`}>
        <Providers>
          <ActiveSectionContextProvider>
            <LoginStatusProvider>
              <ProductContextProvider>
                <CartAndWishlistProvider>
                  <PaymentProvider>
                    <HeaderProvider />
                    <SearchBarProvider />
                    <div className={"mx-auto w-[74rem] pt-[4rem]"}>
                      {children}
                    </div>
                  </PaymentProvider>
                </CartAndWishlistProvider>
              </ProductContextProvider>
            </LoginStatusProvider>
          </ActiveSectionContextProvider>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
