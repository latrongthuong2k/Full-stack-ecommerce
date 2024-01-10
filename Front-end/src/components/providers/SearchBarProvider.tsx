"use client";
import React from "react";
import SearchBar from "@/components/Client/SearchBar";
import { usePathname } from "next/navigation";

export function SearchBarProvider() {
  const pathName = usePathname();
  const hidingPath = [
    /^\/auth\/login(\/.*)?$/,
    /^\/account\/(\/.*)?$/,
    /^\/cart\/(\/.*)?$/,
    /^\/management\/(\/.*)?$/,
  ];
  const isHidingPath = hidingPath.some((regex) => regex.test(pathName));
  return <>{!isHidingPath && <SearchBar />}</>;
}
