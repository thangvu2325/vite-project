import { IconRotate2 } from "@tabler/icons-react";
import { FunctionComponent } from "react";

interface LoadingScreenProps {}

const LoadingScreen: FunctionComponent<LoadingScreenProps> = () => {
  return (
    <div className="w-full h-screen bg-white flex items-center justify-center  text-[#6366F1]">
      <IconRotate2
        className="animate-spin mr-2  "
        width={40}
        height={40}
      ></IconRotate2>
      <h1 className="text-[40px]">Vui lòng đợi giây lát</h1>
    </div>
  );
};

export default LoadingScreen;
