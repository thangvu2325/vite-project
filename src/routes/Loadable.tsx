/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactNode, Suspense } from "react";
import LoadingScreen from "../components/LoadingScreen";

interface LoadableProps {
  children: ReactNode;
}

const Loadable: FC<LoadableProps> = ({ children }) => {
  return (
    <Suspense fallback={<LoadingScreen content="Đang tải, vui lòng chờ" />}>
      {children}
    </Suspense>
  );
};

export default Loadable;
