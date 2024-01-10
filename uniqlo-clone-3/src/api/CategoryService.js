"use server";
import { authCookieGetter } from "@/services/routeConfig";
import { handleFetchError } from "@/services/ProductService";

const BASE_URL = `${process.env.NEXT_PUBLIC_BE_URL}/api/v1/category`;

const getAuthHeader = () => {
  const token = authCookieGetter();
  if (!token) {
    console.log("UnAuthenticated");
    return {};
  }
  return { Cookie: `auth-token=${token}` };
};

export const fetchCategories = async (q, page, size, sortField, sortDir) => {
  try {
    const response = await fetch(
      `${BASE_URL}/page?page=${
        page - 1
      }&size=${size}&q=${q}&sortField=${sortField}&sortDir=${sortDir}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `auth-token=${
            authCookieGetter()
              ? authCookieGetter()
              : console.log("UnAuthenticated")
          }`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const responseData = await response.json();
    return {
      categories: responseData.categories,
      totalPages: responseData.totalPages,
    };
  } catch (err) {
    handleFetchError(err, "Error fetching product data:");
  }
};

const defaultOptions = (method, body = null) => {
  const authCookie = authCookieGetter()
    ? authCookieGetter()
    : "UnAuthenticated";
  const headers = {
    "Content-Type": "application/json",
    Cookie: `auth-token=${authCookie}`,
  };

  // Không set Content-Type là application/json nếu body là FormData
  if (body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const options = {
    method: method,
    headers: headers,
    credentials: "include",
  };

  if (body) {
    options.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  return options;
};

const options1 = (method, dto) => {
  return {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: dto ? JSON.stringify(dto) : null,
  };
};

const fetchWithAuth = async (url = null, option) => {
  try {
    const res = await fetch(url, option);
    if (res.status === 200) {
      const responseData =
        option.method === "GET" ? await res.json() : await res.text();
      return {
        data: responseData,
        success: true,
        status: res.status,
      };
    } else {
      const errorResponse = await res.json();
      return {
        err: errorResponse.errors || errorResponse.message,
        success: false,
        status: res.status,
        ...errorResponse,
      };
    }
  } catch (err) {
    return handleFetchError(
      err,
      `Error when sending ${option.method} request to backend:`,
    );
  }
};
export const sendCateToBackend = async (dto) => {
  try {
    const res = await fetch(`${BASE_URL}/create`, options1("POST", dto));
    if (res.status === 200) {
      const responseData = await res.text();
      return {
        data: responseData,
        success: true,
        status: res.status,
      };
    } else {
      const errorResponse = await res.json();
      return {
        err: errorResponse.errors || errorResponse.message,
        success: false,
        status: res.status,
        ...errorResponse,
      };
    }
  } catch (err) {
    return handleFetchError(err, `Error when sending POST request to backend:`);
  }
};
export const sendUpdateDataToBackend = async (categoryId, dto) => {
  return fetchWithAuth(
    `${BASE_URL}/update?categoryId=${categoryId}`,
    options1("PUT", dto),
  );
};

export const getCategoryById = async (id) => {
  return fetchWithAuth(`${BASE_URL}/get?categoryId=${id}`, {
    ...options1("GET", null),
    cache: "no-store",
  });
};
export const deleteCategory = async (categoryId) => {
  try {
    const res = await fetch(
      `${BASE_URL}/delete/${categoryId}`,
      options1("DELETE", null),
    );
    if (res.status === 200) {
      const responseData = await res.text();
      return {
        data: responseData,
        success: true,
        status: res.status,
      };
    } else {
      const errorResponse = await res.json();
      return {
        err: errorResponse.errors || errorResponse.message,
        success: false,
        status: res.status,
        ...errorResponse,
      };
    }
  } catch (err) {
    return handleFetchError(err, `Error when sending POST request to backend:`);
  }
};

export const uploadMultipleFiles = async (id, formData) => {
  return await fetchWithAuth(
    `${BASE_URL}/upload-images/${id}`,
    defaultOptions("POST", formData),
  );
};

export const fetchImages = async (id) => {
  try {
    const response = await fetch(
      `${BASE_URL}/get-images/${id}`,
      defaultOptions("GET"),
    );
    if (response.ok) {
      const data = await response.json();
      return { success: true, status: response.status, data: data };
    } else {
      return { success: false, status: response.status };
    }
  } catch (e) {
    console.log("Có lỗi: " + e.message);
    throw { message: e.message, type: "fetchError" };
  }
};

export const getAllCateExceptItSelfAndFather = async (id, parentId) => {
  return fetchWithAuth(
    `${BASE_URL}/get-all?categoryId=${id}&parentId=${parentId}`,
    {
      ...options1("GET", null),
      cache: "no-store",
    },
  );
};
