"use client";
import React from "react";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="flex h-screen items-center justify-center bg-gray-200">
      <div className="text-center">
        <h1 className="mb-4 text-7xl font-bold text-gray-800">404</h1>
        <p className="mb-4 text-xl text-gray-700">
          お探しのページは存在しません。
        </p>
        <button
          onClick={() => router.push("/")}
          className="rounded bg-gray-800 px-6 py-2 text-lg font-bold text-white hover:bg-gray-700 focus:outline-none"
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
};
export default NotFound;
