import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

// containers
import Routes from "../routes";

export default function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </ChakraProvider>
  );
}
