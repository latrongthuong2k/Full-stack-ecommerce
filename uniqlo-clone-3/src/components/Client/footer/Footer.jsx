"use client";
import React from "react";
import styles from "./Footer.module.css";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaLine,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const icons = [
  { icon: <FaFacebook />, url: "/", className: styles.facebook },
  { icon: <FaSquareXTwitter />, url: "/", className: styles.twitter },
  { icon: <FaLine />, url: "/", className: styles.line },
  { icon: <FaInstagram />, url: "/", className: styles.instagram },
  { icon: <FaYoutube />, url: "/", className: styles.youtube },
  { icon: <FaTiktok />, url: "/", className: styles.tiktok },
];

const links = [
  { title: "会員情報", url: "/userInfo" },
  { title: "お買い物ガイド", url: "/" },
  { title: "交換・返品", url: "/" },
  { title: "特定商取引法に基づく表示", url: "/" },
  { title: "お問い合わせ｜利用規約", url: "/" },
  { title: "プライバシーポリシー", url: "/" },
  { title: "推奨環境", url: "/" },
  { title: "プレスリリース", url: "/" },
  { title: "企業情報", url: "/" },
  { title: "採用懵報", url: "/" },
  { title: "Language", url: "/" },
];
const subLinks = [
  { title: "ジーユー", url: "/userInfo" },
  { title: "セオリー", url: "/" },
  { title: "プラステ", url: "/" },
];
const Column = ({ title, items }) => (
  <div className="flex w-[240px] flex-col gap-[20px]">
    <p className="text-[17px] font-bold">{title}</p>
    {items.map((item) => (
      <Link className="text-sm" href={item.url} key={item.id}>
        {item.title}
      </Link>
    ))}
  </div>
);

const Footer = () => {
  return (
    <footer>
      <div className=" bg-[rgb(244,244,244)] py-6">
        <div className="mb-6 ml-auto mr-auto w-[1200px] ">
          <div className="text-[13px] leading-[25px]">
            {/*Links*/}
            <div className="flex flex-wrap gap-y-[5px] text-gray-800">
              {links.map((item, index) => (
                <span className={"flex"} key={index}>
                  <div>
                    <Link href={item.url}>{item.title}</Link>
                  </div>
                  {index < links.length - 1 && (
                    <span className="px-[14px]">|</span>
                  )}
                </span>
              ))}
            </div>
            {/*Sub Links*/}
            <p className="py-[12px] text-gray-500">
              グループブランド オンラインストア
            </p>
            <div className="text-sm">
              {subLinks.map((item, index) => (
                <span key={index}>
                  <Link href={item.url}>{item.title}</Link>
                  {index < links.length - 1 && (
                    <span className="px-[14px]">|</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
        <hr className=" mb-6 border-t-gray-300" />
        <div>
          {/*wrapper*/}
          <div className=" ml-auto mr-auto flex w-[1200px] items-center justify-between  text-[rgb(130,130,130)]">
            <p className="text-[15px]">
              Copyright © ABC Co., Ltd. All rights reserved.
            </p>
            <div>
              {/*{"icons"}*/}
              <div className="flex w-[240px] gap-[20px]">
                <div className="flex gap-[10px] text-2xl">
                  {icons.map((iconItem, index) => (
                    <Link
                      href={iconItem.url}
                      className={styles.item}
                      key={index}
                    >
                      {iconItem.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
