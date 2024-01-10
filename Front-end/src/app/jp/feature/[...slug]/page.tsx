"use client";
import React, { useEffect, useState } from "react";
import { useProductDataContext } from "@/context/ProductDataContext";
import { ListProduct, ProductBasicInfo } from "@/lib/types";
import { motion } from "framer-motion";
import {
  getFeatureProducts,
  getNewProducts,
  getBestSellerProducts,
} from "@/api/services/ClientService";
import Image from "next/image";
import { useRouter } from "next/navigation";

const FeaturePage = ({ params }: { params: { slug: string[] } }) => {
  const router = useRouter();
  const { clientType } = useProductDataContext();

  const [products, setProducts] = useState<ListProduct>();
  const [title, setTitle] = useState<string | undefined>("");

  const handleProductClick = (productId: number, rootName: string) => {
    router.push(`/jp/products/${productId}?root=${rootName}`);
  };

  useEffect(() => {
    // IIFE
    (async () => {
      let productsData;
      let title;

      switch (params.slug[0]) {
        case "new":
          productsData = await getNewProducts();
          title = "New Products";
          break;
        case "best-seller":
          productsData = await getBestSellerProducts();
          title = "Best Sellers";
          break;
        case "most-popular":
          productsData = await getFeatureProducts();
          title = "Most Popular";
          break;
        default:
          productsData = { error: "Invalid category" };
      }

      if (productsData.error) {
        throw new Error(productsData.error);
      } else {
        setProducts(productsData.data);
        setTitle(title);
      }
    })();
  }, [params.slug]);
  return (
    <>
      <div className={"pt-6"}>
        <h1 className={"mb-6 text-4xl"}>{title}</h1>
        <div className={" grid grid-cols-4 gap-7"}>
          {products?.content.map((product: ProductBasicInfo, index: number) => (
            <motion.div
              key={product.productId}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.7,
                ease: [0.37, 0.3, 0, 0.6],
                delay: 0.06 * index,
              }}
              onClick={() => handleProductClick(product.productId, clientType)} // Xử lý click ở đây
              className={"cursor-pointer"}
            >
              <div className={"relative mb-4"}>
                <Image
                  src={`${product.s3ProductImages[0]?.url || "/next.svg"}`}
                  width={276}
                  height={276}
                  quality={50}
                  style={{ width: "auto" }}
                  alt={product.productName}
                />
              </div>
              <p className={"mb-2"}>{product.productName}</p>
              <p className={"text-xl"}>
                {`￥` + product.unitPrice.toLocaleString("ja-JP")}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FeaturePage;
