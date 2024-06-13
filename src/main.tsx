import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@material-tailwind/react";
import { App as AntdApp } from "antd";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <AntdApp>
      <App />
    </AntdApp>
  </ThemeProvider>
);
