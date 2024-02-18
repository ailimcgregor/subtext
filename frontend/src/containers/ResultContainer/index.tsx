import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import ReactPlayer from "react-player";
export default function ResultContainer() {
  const location = useLocation();
  const audioFile: any = location.state?.file;
  const url: any = location.state?.url;
  const data: any = location.state?.data;
  return (
    <div className="w-full h-screen flex justify-center items-center">
      {url ? <ReactPlayer url={url} /> : null}
    </div>
  );
}
