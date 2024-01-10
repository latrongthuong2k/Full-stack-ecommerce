"use server";
import { authCookieGetter } from "@/services/routeConfig";

const BASE_URL = `${process.env.NEXT_PUBLIC_BE_URL}/api/v1/management/product`;

const getAuthHeader = () => {
  const token = authCookieGetter();
  if (!token) {
    console.log("UnAuthenticated");
    return {};
  }
  return { Cookie: `auth-token=${token}` };
};

export const handleFetchError = (
  err,
  customMessage = "Error fetching data:",
) => {
  console.error(customMessage, err);
  throw err;
};

export const productConnectedEntities = async () => {
  const url = `${BASE_URL}/product-connected-entities`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      next: { revalidate: 60 },
    });
    return await response.json();
  } catch (err) {
    return handleFetchError(err, "Error when sending data to backend:");
  }
};

export const sendDataToBackend = async (dto) => {
  try {
    const res = await fetch(`${BASE_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(dto),
    });
    if (res.status === 200) {
      return {
        productId: await res.text(),
        success: true,
        status: res.status,
      };
    } else {
      const errorResponse = await res.json();
      return {
        err: errorResponse.message,
        success: false,
        status: res.status,
        path: errorResponse.path,
        timestamp: errorResponse.timestamp,
      };
    }
  } catch (err) {
    return handleFetchError(err, "Error when sending data to backend:");
  }
};
export const sendUpdateDataToBackend = async (productId, dto) => {
  try {
    const res = await fetch(`${BASE_URL}/update?productId=${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(dto),
    });
    if (res.status === 200) {
      return {
        // successMessage: await res.text(),
        productId: await res.text(),
        success: true,
        // status: res.status,
      };
    } else {
      const errorResponse = await res.json();
      return {
        err: errorResponse.message,
        success: false,
        status: res.status,
        path: errorResponse.path,
        timestamp: errorResponse.timestamp,
      };
    }
  } catch (err) {
    return handleFetchError(err, "Error when sending update data to backend:");
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/get?productId=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    if (response.ok) {
      return { data: await response.json() };
    } else {
      const errResponse = await response.json();
      return {
        ...errResponse,
        err: errResponse.message,
        success: false,
      };
    }
  } catch (err) {
    return handleFetchError(err, "Error fetching product data:");
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
export const uploadMultipleFiles = async (productId, formData) => {
  // for (let [key, value] of formData.entries()) {
  //   console.log(key, value);
  // }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/api/v1/product/product-images/${productId}`,
      defaultOptions("POST", formData),
    );
    return { success: true, status: response.status };
  } catch (e) {
    console.log("Error: " + e.message);
    throw { message: e.message, type: "fetchError" };
  }
};

export const fetchImages = async (id) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/api/v1/product/get-product-images/${id}`,
      defaultOptions("GET"),
    );
    const res = await response.json();
    if (response.ok) {
      return {
        success: true,
        data: res,
      };
    } else {
      return { success: false, status: response.status };
    }
  } catch (e) {
    console.log("Có lỗi: " + e.message);
    throw { message: e.message, type: "fetchError" };
  }
};

export const deleteImagesFromServer = async (productId, awsUrl) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BE_URL}/api/v1/product/delete-product-image?productId=${productId}&awsUrl=${awsUrl}`,
      defaultOptions("DELETE"),
    );
    if (!response.ok) {
      throw new Error(`Deletion failed with status ${response.status}`);
    }
    return { success: true, status: response.status };
  } catch (e) {
    console.log("Có lỗi: " + e.message);
    throw { message: e.message, type: "deleteError" };
  }
};
