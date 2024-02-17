import { Routes, Route, Navigate } from "react-router-dom";
import { PageNotFound } from "../containers";

export default function RoutesContainer() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to={"/"} />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}
