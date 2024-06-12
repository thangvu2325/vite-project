/* eslint-disable react-hooks/exhaustive-deps */
import { FunctionComponent, ReactNode, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconIotConnection } from "@/components/ui/icon";
import { useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FunctionComponent<AuthLayoutProps> = ({ children }) => {
  const { isLogin } = useAppSelector(userData);

  const navigate = useNavigate();
  useEffect(() => {
    if (isLogin === true) {
      navigate("/Dashboard");
    }
  }, [isLogin]);
  return (
    <div className="h-[100vh] overflow-hidden bg-[#fff]">
      <header className="fixed top-0 left-0 right-0 w-[100vw] h-[96px] flex items-center ">
        <div className="px-[15px] bg-transparent flex items-center h-[90px] my-[auto]">
          <Link
            className="flex items-center sm:w-[280px] pl-[10px] select-hidden"
            to={"/"}
          >
            <div className="border-[0.8px] border-solid border-[#2F3746] rounded-md p-1 bg-[#6366F1] mr-3">
              <IconIotConnection
                width={"36px"}
                height={"36.4px"}
                className="text-[#f0f0f0]"
              ></IconIotConnection>
            </div>
            <span className="font-fredokaOneRegular text-iconColor font-bold text-[32px]">
              IOT SYSTEM
            </span>
          </Link>
        </div>
      </header>
      <div className="flex">{children}</div>
    </div>
  );
};

export default AuthLayout;
