/* eslint-disable react-hooks/exhaustive-deps */
import { useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";
import { FunctionComponent, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FunctionComponent<ProtectedRouteProps> = ({
  children,
}) => {
  const { isLogin } = useAppSelector(userData);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin === false) {
      navigate("/login");
    }
  }, [isLogin]);
  return children;
};

export default ProtectedRoute;
