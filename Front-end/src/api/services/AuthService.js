"use server";
import { authCookieGetter } from "./ServerAction";
import { getErrorMessage } from "@/lib/utils";

const BASE_URL_AUTH_VERIFY = `${process.env.NEXT_PUBLIC_BE_URL}/api/v1/auth`;
const BASE_URL_USER = `${process.env.NEXT_PUBLIC_BE_URL}/api/v1/user`;
const BASE_URL_MANAGEMENT = `${process.env.NEXT_PUBLIC_BE_URL}/api/v1/management`;
const getAuthHeader = () => {
  const token = authCookieGetter();
  if (!token) {
    return {};
  }
  return { Cookie: `auth-token=${token}` };
};
const authOption = (method, body) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
  };
  const options = {
    method: method,
    headers: defaultHeaders,
    credentials: "include",
  };
  if (body) {
    if (body instanceof FormData) {
      delete options.headers["Content-Type"];
    } else {
      options.body = JSON.stringify(body);
    }
  }
  return options;
};
const loginRegisterOption = (method, bodyDto) => {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };
  const options = {
    method: method,
    headers: defaultHeaders,
  };
  if (bodyDto) {
    if (bodyDto instanceof FormData) {
      delete options.headers["Content-Type"];
    } else {
      options.body = JSON.stringify(bodyDto);
    }
  }
  return options;
};

export const getAuthData = async () => {
  try {
    if ((authCookieGetter !== null) !== undefined) {
      const response = await fetch(
        `${BASE_URL_AUTH_VERIFY}/check-authentication`,
        authOption("GET", null),
      );
      if (response.ok) {
        return { userAuthData: await response.json(), status: response.status };
      } else {
        const errorResponse = await response.json();
        const message = errorResponse.message || "Server error";
        return { error: getErrorMessage(message) };
      }
    } else {
      const message = "Can not found credentials";
      return { error: getErrorMessage(message) };
    }
  } catch (err) {
    return { error: getErrorMessage(err) };
  }
};
//
export const authFetch = async (url, option, isLoginOrRegister) => {
  try {
    const res = await fetch(url, option);
    if (res.status === 200) {
      if (option.method === "GET") {
        const data = await res.json();
        return {
          data: data,
        };
      } else if (option.method === "POST")
        if (isLoginOrRegister) {
          const authTokens = await res.json();
          return { authToken: authTokens, success: true };
        } else
          return {
            success: true,
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
export const login = async (body) => {
  return authFetch(
    `${BASE_URL_AUTH_VERIFY}/sign-in`,
    loginRegisterOption("POST", body),
    true,
  );
};
// a
export const register = async (body) => {
  return authFetch(
    `${BASE_URL_AUTH_VERIFY}/sign-up`,
    loginRegisterOption("POST", body),
    true,
  );
};

export const addProductToShoppingCart = async (body) => {
  return authFetch(
    `${BASE_URL_USER}/shopping-cart/add`,
    authOption("POST", body),
  );
};

export const getWishProducts = async () => {
  return await authFetch(`${BASE_URL_USER}/wish-list/get`, {
    ...authOption("GET", null),
    cache: "no-store",
  });
};
export const createWishProducts = async (productsObject) => {
  return await authFetch(`${BASE_URL_USER}/wish-list/create`, {
    ...authOption("POST", productsObject),
    cache: "no-store",
  });
};

export const getCartItems = async () => {
  return await authFetch(`${BASE_URL_USER}/shopping-cart/cart-products`, {
    ...authOption("GET", null),
    cache: "no-store",
  });
};
export const updateCartItem = async (productId, quantity) => {
  return await authFetch(
    `${BASE_URL_USER}/shopping-cart/update/${productId}?quantity=${quantity}`,
    {
      ...authOption("PUT", null),
      cache: "no-store",
    },
  );
};

export const deleteCartItem = async (productId, sizeLabel) => {
  return await authFetch(
    `${BASE_URL_USER}/shopping-cart/delete/${productId}/${sizeLabel}`,
    {
      ...authOption("DELETE", null),
      cache: "no-store",
    },
  );
};
export const deleteAllCartItem = async () => {
  return await authFetch(`${BASE_URL_USER}/shopping-cart/delete`, {
    ...authOption("DELETE", null),
    cache: "no-store",
  });
};

export const checkOutOrder = async () => {
  return await authFetch(`${BASE_URL_USER}/shopping-cart/check-out`, {
    ...authOption("POST", null),
    cache: "no-store",
  });
};

export const fetchUserDetailInfo = async () => {
  return await authFetch(`${BASE_URL_USER}/account/user-detail`, {
    ...authOption("GET", null),
    cache: "no-store",
  });
};
export const fetchChangeUserInfo = async () => {
  return await authFetch(`${BASE_URL_USER}/account/update/user-detail`, {
    ...authOption("GET", null),
    cache: "no-store",
  });
};

//-----------------
// ADMIN
export const deleteProduct = async (productId, quantity) => {
  return await authFetch(
    `${BASE_URL_MANAGEMENT}/product/delete?productId=${productId}`,
    {
      ...authOption("DELETE", null),
      cache: "no-store",
    },
  );
};

export const fetchPageProduct = async (q, page, size, sortField, sortDir) => {
  return await authFetch(
    `${BASE_URL_MANAGEMENT}/product/product-table?page=${
      page - 1
    }&size=${size}&q=${q}&sortField=${sortField}&sortDir=${sortDir}`,
    {
      ...authOption("GET", null),
      cache: "no-store",
    },
  );
};

export const getProductById = async (productId) => {
  return await authFetch(
    `${BASE_URL_MANAGEMENT}/product/get?productId=${productId}`,
    {
      ...authOption("GET", null),
      cache: "no-store",
    },
  );
};
