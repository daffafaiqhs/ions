import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "@fontsource-variable/montserrat";
import { CookiesProvider } from "react-cookie";

import RoutesHandler from "./RoutesHandler";

const theme = extendTheme({
  fonts: {
    body: `'Montserrat', sans-serif`,
  },
  colors: {
    brand: {
      primary: "#8669FF",
      secondary: "#2265DE",
      tertiary: "#E4EEFF",
    },
  },
  components: {
    Link: {
      baseStyle: {
        _hover: {
          textDecoration: "none",
          color: "brand.primary",
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>
  <CookiesProvider defaultSetOptions={{ path: "/" }}>
    <ChakraProvider theme={theme}>
      <RoutesHandler />
    </ChakraProvider>
  </CookiesProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
