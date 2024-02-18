import { Routes, Route, Navigate } from "react-router-dom";
import { PageNotFound, Home } from "../containers";
import React from "react";
import ResultContainer from "../containers/ResultContainer";
import AudioFileContainer from "../containers/AudioFileContainer";
import TelevisionContainer from "../containers/TelevisionContainer";
import VoiceMessageContainer from "../containers/VoiceMessageContainer";
import SocialMediaContainer from "../containers/SocialMediaContainer";

export default function RoutesContainer() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/television" element={<TelevisionContainer />} />
        <Route path="/voice-message" element={<VoiceMessageContainer />} />
        <Route path="/social-media" element={<SocialMediaContainer />} />
        <Route path="/results" element={<ResultContainer />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
