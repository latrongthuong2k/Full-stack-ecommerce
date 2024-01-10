"use client";
import React from "react";
import { Spinner } from "@nextui-org/react";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className={"flex h-full w-full items-center justify-center"}>
      <Spinner label="Loading..." color="warning" />
    </div>
  );
}
