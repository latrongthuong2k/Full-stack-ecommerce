"use server";
import { cookies } from "next/headers";

export const authCookieGetter = () => {
  const authToken = cookies().get("auth-token");
  if (authToken && authToken.value) {
    return authToken.value;
  }
};
