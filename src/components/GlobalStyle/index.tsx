import { FunctionComponent, ReactNode } from "react";
import "./GlobalStyle.css";
interface GlobalStyleProps {
  children: ReactNode;
}

const GlobalStyle: FunctionComponent<GlobalStyleProps> = ({ children }) => {
  return children;
};

export default GlobalStyle;
