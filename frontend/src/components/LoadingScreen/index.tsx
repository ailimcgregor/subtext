import { Spinner } from "@chakra-ui/react";
import React from "react";

export default function LoadingScreen() {
  return (
    <div className="absolute w-full h-screen flex justify-center items-center z-50 bg-[#EBEBEB] opacity-70">
      <Spinner size={"xl"} />
    </div>
  );
}
