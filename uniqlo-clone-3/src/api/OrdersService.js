"use server";
import { authCookieGetter } from "@/services/routeConfig";

const BASE_URL_ORDER = `${process.env.NEXT_PUBLIC_BE_URL}/api/v1/orders`;

const getAuthHeader = () => {
  const token = authCookieGetter();
  if (!token) {
    console.log("UnAuthenticated");
    return {};
  }
  return { Cookie: `auth-token=${token}` };
};

const handleFetchError = (err, customMessage = "Error fetching data:") => {
  console.error(customMessage, err);
  throw err;
};

const fetchWithAuth = async (url, method, dto = null) => {
  try {
    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: dto ? JSON.stringify(dto) : null,
    });

    if (res.status === 200) {
      const responseData =
        method === "GET" ? await res.json() : await res.text();
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
      `Error when sending ${method} request to backend:`,
    );
  }
};
export const fetchPageBills = async (q, page, size, sortField, sortDir) => {
  return fetchWithAuth(
    `${BASE_URL_ORDER}/page?page=${
      page - 1
    }&size=${size}&q=${q}&sortField=${sortField}&sortDir=${sortDir}`,
    "GET",
  );
};

export const sendDataToBackend = async (dto) => {
  return fetchWithAuth(`${BASE_URL_ORDER}/create`, "POST", dto);
};

export const sendUpdateDataToBackend = async (id, dto) => {
  return fetchWithAuth(`${BASE_URL_ORDER}/update?billId=${id}`, "PUT", dto);
};

export const getBillById = async (id) => {
  return fetchWithAuth(`${BASE_URL_ORDER}/get?billId=${id}`, "GET");
};

export const cancelBill = async (id) => {
  return fetchWithAuth(`${BASE_URL_ORDER}/cancel?billId=${id}`, "DELETE");
};
