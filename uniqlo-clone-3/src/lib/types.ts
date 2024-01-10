import { links } from "@/lib/data";

export type SectionName = (typeof links)[number]["name"];

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

export type Size = {
  id: string;
  label: string;
};

export interface CartItemData {
  productId: number;
  quantity: number;
  sizeLabel: string;
}

export interface OnCartProductItemData {
  productId: number;
  productName: string;
  sku: string;
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  sizeLabel: string;
  s3ProductImages: S3ProductImage[];
}

//  server request response
export interface S3ProductImage {
  key: string;
  url: string;
}

export interface ProductBasicInfo {
  productId: number;
  productName: string;
  unitPrice: number;
  sizes: Size[];
  s3ProductImages: S3ProductImage[];
}

export type ListProduct = {
  content: ProductBasicInfo[];
  length: number;
};

export interface ProductFullInfo {
  productId: number;
  sku: string;
  productName: string;
  unitPrice: number;
  stockQuantity: 0;
  categoryId: 0;
  status: boolean;
  description: string;
  productImages: S3ProductImageDetail[];
  sizes: Size[];
}

export type Product = {
  id: number;
  productName: string;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  unitPrice: number;
  status: number;
};

export interface S3ProductImageDetail {
  key: string;
  url: string;
  isPrimary: boolean;
}

export type ProductsRenderProps = {
  rootName: string;
  categoryId: number;
  categoryName: string;
};

export interface Category {
  id: number;
  categoryName: string;
  s3ProductImages: S3ProductImage;
}

export interface WishList {
  [key: number]: boolean;
}

//
export interface WishListRes {
  wishId: number;
  product: ResSimpleInfoProductDto;
}

export interface ResSimpleInfoProductDto {
  productId: number;
  productName: string;
  unitPrice: string;
  sizes: [];
  s3ProductImages: S3ProductImage;
}

//
export interface WishListReq {
  id: number;
  product: number[];
}
