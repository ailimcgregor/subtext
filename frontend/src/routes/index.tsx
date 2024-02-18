import { Routes, Route, Navigate } from "react-router-dom";
import { PageNotFound, Home } from "../containers";
import React from "react";
import ResultContainer from "../containers/ResultContainer";
import AudioFileContainer from "../containers/AudioFileContainer";
import TelevisionContainer from "../containers/TelevisionContainer";

export default function RoutesContainer() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/television" element={<TelevisionContainer />} />
        <Route path="/voice-message" element={<AudioFileContainer />} />
        <Route path="/results" element={<ResultContainer />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
