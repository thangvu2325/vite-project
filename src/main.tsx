import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@material-tailwind/react";
import { App as AntdApp } from "antd";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AntdApp>
        <App />
      </AntdApp>
    </ThemeProvider>
  </React.StrictMode>
);
