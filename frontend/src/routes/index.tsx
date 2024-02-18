import { Routes, Route, Navigate } from "react-router-dom";
import { PageNotFound, Home } from "../containers";

export default function RoutesContainer() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
