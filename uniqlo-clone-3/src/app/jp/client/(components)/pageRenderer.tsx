"use client";
import CategoryRenderer from "@/components/Client/CategoryRenderer";
import React, { Suspense, useEffect } from "react";
import { useProductDataContext } from "@/context/ProductDataContext";
import Image from "next/image";
import Link from "next/link";

const ClientPageRenderer = ({ params }: { params: { clientType: string } }) => {
  const { setClientType } = useProductDataContext();

  useEffect(() => {
    setClientType(params.clientType);
  }, []);
  const listFeatures = [
    {
      title: "今週の新作",
      img: "/newProducts.png",
      link: "/jp/feature/new",
    },
    {
      title: "最近販売予定の商品",
      img: "/bestSeller.png",
      link: "/jp/feature/best-seller",
    },
    {
      title: "人気の商品",
      img: "/mostPopular.png",
      link: "/jp/feature/most-popular",
    },
  ];
  return (
    <div>
      <Suspense fallback={<p>Loading</p>}>
        <CategoryRenderer />
        <hr className={"mb-6"} />
        {/* 注目の商品 */}
        <div>
          <p className={"mb-6 text-2xl"}>Features</p>
          <div className={"flex "}>
            {listFeatures.map((feature) => (
              <Link key={feature.title} href={feature.link}>
                <Image
                  className={"mb-4"}
                  width={200}
                  height={500}
                  style={{ width: "auto" }}
                  src={feature.img}
                  alt={feature.title}
                  priority={true}
                />
                <p className={"text-sm"}>{feature.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </Suspense>
    </div>
  );
};
export default ClientPageRenderer;
