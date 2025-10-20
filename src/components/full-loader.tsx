import React from "react";
import Spinner from "./Spinner";

const FullLoader = () => {
  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-default">
      <Spinner className="text-[40px] text-white" />
    </div>
  );
};

export default FullLoader;
