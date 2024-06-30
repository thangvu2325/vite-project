import { IconRotate2 } from "@tabler/icons-react";
import { FunctionComponent } from "react";

interface LoadingScreenProps {
  content: string;
}

const LoadingScreen: FunctionComponent<LoadingScreenProps> = ({ content }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center  text-[#6366F1] cursor-wait">
      <IconRotate2
        className="animate-spin mr-2  "
        width={40}
        height={40}
      ></IconRotate2>
      <h1 className="text-[40px] select-none ">{content}</h1>
    </div>
  );
};

export default LoadingScreen;
