"use client";

import React from "react";
import Navbar from "@/components/Client/Navbar";
import { Toaster } from "react-hot-toast";

export function HeaderProvider() {
  return (
    <header>
      <div>
        {/*Pop up Notification */}
        <Toaster />
      </div>
      <Navbar />
    </header>
  );
}
