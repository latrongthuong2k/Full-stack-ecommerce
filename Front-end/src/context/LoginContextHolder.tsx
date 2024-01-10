"use client";

import React, { createContext, useContext } from "react";
import { AuthTokens } from "@/lib/types";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

type ProviderProps = {
  children: React.ReactNode;
};

type LoginContextType = {
  // setUserToken: React.Dispatch<React.SetStateAction<string>>;
  getUserToken: () => AuthTokens | null;
  setUserToken: (tokens: AuthTokens) => void;
  logOutActions: () => void;
};

export const LoginContext = createContext<LoginContextType | null>(null);

export default function LoginStatusProvider({ children }: ProviderProps) {
  const router = useRouter();
  const BASE_URL = `${process.env.NEXT_PUBLIC_BE_URL}`;
  const FE_URL = `http://localhost:3000`;
  const getUserToken = () => {
    const authTokens = localStorage.getItem("auth-tokens");
    return authTokens ? JSON.parse(authTokens) : null;
  };
  const setUserToken = (tokens: AuthTokens) => {
    // document.cookie = `auth-token=${tokens.access_token};path=/;max-age=3600;Secure;HttpOnly;`;
    if (
      tokens &&
      tokens.access_token &&
      tokens.refresh_token &&
      tokens.access_token.trim() !== "" &&
      tokens.refresh_token.trim() !== ""
    ) {
      localStorage.setItem("auth- ", JSON.stringify(tokens));
      setCookie("auth-token", tokens.access_token);
    } else {
      console.error("Invalid tokens provided. Failed to set user tokens.");
    }
  };
  const logOutActions = async () => {
    deleteCookie("auth-token");
    router.push(`${BASE_URL}/api/v1/auth/logout`);
    // router.push(`${FE_URL}`);
  };

  return (
    <LoginContext.Provider
      value={{
        getUserToken,
        setUserToken,
        logOutActions,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export function useLoginContextHolder() {
  const context = useContext(LoginContext);

  if (context === null) {
    throw new Error(
      "useLoginContextHolder must be used within an LoginStatusProvider",
    );
  }

  return context;
}
