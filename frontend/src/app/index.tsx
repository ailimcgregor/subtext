import React from "react";
import { BrowserRouter } from "react-router-dom";

// containers
import Routes from "../routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}
