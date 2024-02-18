import { Routes, Route, Navigate } from "react-router-dom";
import { PageNotFound, Home } from "../containers";
import React from "react";
import ResultContainer from "../containers/ResultContainer";
import AudioFileContainer from "../containers/AudioFileContainer";

export default function RoutesContainer() {
  return (
    <div>
      <Routes>
        {/* <Route path="/use-cases" element/> */}
        <Route path="/" element={<Home />} />
        <Route path="/audio-file" element={<AudioFileContainer />} />
        <Route path="/results" element={<ResultContainer />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
