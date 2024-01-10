import React from "react";

const WrapperContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="ml-auto mr-auto w-[1200px]">{children}</div>;
};

export default WrapperContent;
