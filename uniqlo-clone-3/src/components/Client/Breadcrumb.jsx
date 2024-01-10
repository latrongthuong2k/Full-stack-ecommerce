"use client";
import React, { useState } from "react";
import Link from "next/link";

const Breadcrumb = ({ links }) => {
  const [currentStep, setCurrentStep] = useState(links.length - 1);
  return (
    <div className="ml-auto mr-auto w-[1200px]">
      {links.map((item, index) => (
        <span
          className="text-[13px] uppercase text-[rgb(60,60,60)]"
          key={index}
        >
          <Link
            className={index < currentStep ? "underline" : ""}
            href={item.url}
            onClick={() => setCurrentStep(index)}
          >
            {item.title}
          </Link>

          {index < links.length - 1 && <span className="px-[5px]">/</span>}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
