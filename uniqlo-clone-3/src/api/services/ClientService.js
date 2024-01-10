"use server";
import { getErrorMessage } from "@/lib/utils";

const BASE_URL_CLIENT = `${process.env.NEXT_PUBLIC_BE_URL}/api/v1/client`;

const defaultOption = (method, body) => {
  const headers = {
    "Content-Type": "application/json",
  };
  const options = {
    method: method,
    headers: headers,
    credentials: "include",
    // next: { revalidate: 60 },
    // cache: "no-store"
    body: body,
  };
  if (body) {
    if (body instanceof FormData) {
      options.body = body;
      delete options.headers["Content-Type"];
    } else {
      options.body = JSON.stringify(body);
    }
  }
  return options;
};

const fetchCustom = async (url = null, option) => {
  try {
    const res = await fetch(url, option);
    if (res.ok) {
      const responseData = await res.json();
      return {
        data: responseData,
      };
    } else {
      const errorResponse = await res.json();
      const fieldErrors = errorResponse.errors;
      let message = "An error occurred";

      if (fieldErrors) {
        message = Object.entries(fieldErrors)
          .map(([field, error]) => `${field}: ${error}`)
          .join(", ");
      } else if (errorResponse.message) {
        message = errorResponse.message;
      }
      return {
        error: getErrorMessage(message),
      };
    }
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};
// Categories
export const getCategories = async () => {
  return await fetchCustom(`${BASE_URL_CLIENT}/category/categories`, {
    ...defaultOption("GET"),
    next: { revalidate: 10 },
  });
};
// Product

export const getProducts = async (queryString) => {
  return await fetchCustom(
    `${BASE_URL_CLIENT}/product/categories?${queryString}`,
    {
      ...defaultOption("GET"),
      cache: "no-store",
    },
  );
};
export const fetchProductById = async (id) => {
  return await fetchCustom(`${BASE_URL_CLIENT}/product/products/${id}`, {
    ...defaultOption("GET"),
    cache: "no-store",
  });
};

export const getSizes = async () => {
  return await fetchCustom(`${BASE_URL_CLIENT}/product/sizes`, {
    ...defaultOption("GET"),
    next: { revalidate: 30 },
  });
};
export const getSearchProducts = async (query) => {
  return await fetchCustom(
    `${BASE_URL_CLIENT}/product/products/search/${query}`,
    {
      ...defaultOption("GET"),
    },
  );
};

export const getBestSellerProducts = async () => {
  return await fetchCustom(`${BASE_URL_CLIENT}/product/best-seller-products`, {
    ...defaultOption("GET"),
  });
};
export const getFeatureProducts = async () => {
  return await fetchCustom(`${BASE_URL_CLIENT}/product/featured-products`, {
    ...defaultOption("GET"),
  });
};
export const getNewProducts = async () => {
  return await fetchCustom(`${BASE_URL_CLIENT}/product/new-products`, {
    ...defaultOption("GET"),
  });
};
