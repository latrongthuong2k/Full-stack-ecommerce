// Note: AdminService API
"use server";
import { authCookieGetter } from "./services/ServerAction";

const BASE_URL_ADMIN = `${process.env.NEXT_PUBLIC_BE_URL}/api/v1/admin`;

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

const options1 = (method, dto) => {
  return {
    method: method,
    headers: {
      "Content-Type": "application/jsson",
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

export const fetchPageAdmin = async (q, page, size, sortField, sortDir) => {
  return fetchWithAuth(
    `${BASE_URL_ADMIN}/page?page=${
      page - 1
    }&size=${size}&q=${q}&sortField=${sortField}&sortDir=${sortDir}`,
    options1("GET", null),
  );
};

export const sendDataToBackend = async (dto) => {
  return fetchWithAuth(`${BASE_URL_ADMIN}/create`, options1("POST", dto));
};

export const sendUpdateDataToBackend = async (id, dto) => {
  return fetchWithAuth(
    `${BASE_URL_ADMIN}/update?userId=${id}`,
    options1("PUT", dto),
  );
};

export const getUserById = async (id) => {
  return fetchWithAuth(
    `${BASE_URL_ADMIN}/get?userId=${id}`,
    options1("GET", null),
  );
};

export const deleteUser = async (id) => {
  return fetchWithAuth(
    `${BASE_URL_ADMIN}/delete?userId=${id}`,
    options1("DELETE", null),
  );
};
