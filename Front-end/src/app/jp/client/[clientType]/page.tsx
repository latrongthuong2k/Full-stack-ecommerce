import React from "react";
import ClientPageRenderer from "@/app/jp/client/(components)/pageRenderer";

const page = ({ params }: { params: { clientType: string } }) => {
  return (
    <div>
      <ClientPageRenderer params={params} />
    </div>
  );
};

export default page;
