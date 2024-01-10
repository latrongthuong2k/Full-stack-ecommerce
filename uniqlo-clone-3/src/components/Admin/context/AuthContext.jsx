"use client";
import React, { createContext, useContext, useState } from "react";
import OAuth2LoginForm from "@/src/components/OAuth2LoginForm";
import Loading from "@/src/components/Loading";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Loading />;
  } else {
    if (!isLoggedIn) return <OAuth2LoginForm />;
  }
  // Hoặc component loading

  const authContextValue = {
    isLoggedIn,
    login: () => setIsLoggedIn(true),
    logout: () => setIsLoggedIn(false),
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
