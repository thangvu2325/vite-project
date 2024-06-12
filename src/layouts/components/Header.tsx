import { IconSearch, IconUserCircle } from "@tabler/icons-react";
import { Flex } from "antd";
import { FunctionComponent, useEffect, useRef, useState } from "react";
interface HeaderProps {
  className?: string;
}
const Header: FunctionComponent<HeaderProps> = ({ className }) => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  if (ref.current) {
    if (isScrolled) {
      ref.current.style.background = "#fff";
      ref.current.style.transition = "background 0.01s ease-in-out";
    } else {
      ref.current.style.background = "transparent";
      ref.current.style.transition = "background 0.01s ease-in-out";
    }
  }
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop === 0) {
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className={`sticky top-0 right-0 left-0 shadow-sm border-b-[1px] h-14 z-10 ${
        className ?? ""
      }`}
      ref={ref}
    >
      <Flex justify="space-between" align="center" className="h-14">
        <span className="ml-4 hover:bg-slate-100 p-2 cursor-pointer rounded-3xl">
          <IconSearch></IconSearch>
        </span>
        <span className="mr-4 hover:bg-slate-100 p-2 cursor-pointer rounded-3xl">
          <IconUserCircle width={30} height={30}></IconUserCircle>
        </span>
      </Flex>
    </div>
  );
};

export default Header;
