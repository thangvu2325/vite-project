/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, Suspense } from "react";
import LoadingScreen from "../components/LoadingScreen";

interface LoadableProps {
  children: ReactNode;
}

const Loadable: FC<LoadableProps> = ({ children }) => {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
};

export default Loadable;
