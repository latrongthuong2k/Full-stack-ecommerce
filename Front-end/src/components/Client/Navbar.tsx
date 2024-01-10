"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CiHeart, CiShoppingCart, CiUser } from "react-icons/ci";

import {
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useCartAndWishlist } from "@/context/CartAndWishlistContext";
import Image from "next/image";
import { OnCartProductItemData } from "@/lib/types";
import { useLoginContextHolder } from "@/context/LoginContextHolder";

const genderType = [
  { id: 1, title: "Women", url: "/jp/client/women" },
  { id: 2, title: "Men", url: "/jp/client/men" },
  { id: 3, title: "Kids", url: "/jp/client/kids" },
  { id: 4, title: "Baby", url: "/jp/client/baby" },
];
const contentDefault = () => [
  {
    id: 1,
    icon: <CiHeart />,
    url: "/jp/member/wishlist",
    numberItem: 0,
  },
  {
    id: 2,
    icon: <CiShoppingCart />,
    url: "/jp/cart",
    numberItem: 0,
  },
];
const Navbar = () => {
  const [isSticky, setIsSticky] = useState(true);
  const { isCartAction, isWishProductAction } = useCartAndWishlist();
  // Đoạn code để xử lý sticky navbar
  const { logOutActions } = useLoginContextHolder();
  const pathName = usePathname();
  const memberPathRegex = [/^\/jp\/member(\/.*)?$/, /^\/jp\/cart(\/.*)?$/];
  const isNavBarInActivePath = memberPathRegex.some((regex) =>
    regex.test(pathName),
  );
  const router = useRouter();
  const [rightContent, setRightContent] = useState(contentDefault);
  // console.log(isWishProductAction, isCartAction);
  useEffect(() => {
    const savedWishState = localStorage.getItem("wishState");
    const itemListStorage = localStorage.getItem("cart-items");
    let wishItemCount = 0;
    let cartItemCount = 0;
    if (savedWishState) {
      const wishItems: Record<number, boolean> = JSON.parse(savedWishState);
      wishItemCount = Object.values(wishItems).filter((item) => item).length;
    }
    if (itemListStorage) {
      const cartItemList: OnCartProductItemData[] = JSON.parse(itemListStorage);
      cartItemList.map((cartItem) => (cartItemCount += cartItem.quantity));
    }

    // Cập nhật rightContent trực tiếp từ dữ liệu lấy được
    const updatedRightContent = contentDefault().map((content) => {
      if (content.id === 1) {
        // ID cho wishlist
        return { ...content, numberItem: wishItemCount };
      } else if (content.id === 2) {
        // ID cho cart
        return { ...content, numberItem: cartItemCount };
      } else {
        return content;
      }
    });
    setRightContent(updatedRightContent);
  }, [isCartAction, isWishProductAction]);

  return (
    <nav
      className={`${
        isSticky && "fixed"
      } z-20 flex w-full justify-center border-b-[1.4px] border-b-gray-300  bg-white`}
    >
      <div className=" flex h-[72px] w-[74rem] justify-between py-[14px] ">
        <div className="flex  gap-[30px]">
          <div className="flex items-center gap-[30px] text-[18px] font-semibold uppercase ">
            {isNavBarInActivePath ? (
              <Link href={"/"}>
                <Image
                  src={"/uniqlo-img.png"}
                  width={100}
                  height={200}
                  style={{ width: "auto" }}
                  alt={"uniqlo"}
                ></Image>
              </Link>
            ) : (
              genderType.map((link) => (
                <Link href={link.url} key={link.id}>
                  {link.title}
                </Link>
              ))
            )}
          </div>
        </div>
        <div className="flex items-center gap-[30px] text-2xl ">
          <Dropdown>
            <DropdownTrigger>
              <button className={`flex ${!isNavBarInActivePath && "hidden"}`}>
                <CiUser />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                onClick={() => router.push("/jp/member/details")}
                key="info"
              >
                会員情報
              </DropdownItem>
              <DropdownItem
                onClick={() => router.push("/jp/member/history")}
                key="history"
              >
                注文履歴
              </DropdownItem>
              <DropdownItem
                key="logout"
                onClick={() => logOutActions()}
                className="text-danger"
                color="danger"
              >
                ログアウト
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          {!isNavBarInActivePath &&
            rightContent.map((link) => (
              <Link
                className={"flex items-center"}
                href={link.url}
                key={link.id}
              >
                {link.numberItem > 0 ? (
                  <Badge content={link.numberItem.toString()} color="primary">
                    {link.icon}
                  </Badge>
                ) : (
                  <>{link.icon}</>
                )}
              </Link>
            ))}
        </div>
      </div>
    </nav>
    // <div>
    //   <Search/>
    // </div>
  );
};

export default Navbar;
