import { FunctionComponent, ReactNode } from "react";
import { Flex } from "antd";
interface CardProps {
  className?: string;
  title: string;
  value: number;
  icon: ReactNode;
}

const Card: FunctionComponent<CardProps> = ({
  className,
  title,
  value,
  icon,
}) => {
  return (
    <div
      className={`relative flex flex-col text-gray-700 bg-white shadow-md bg-clip-border rounded-xl w-72 ${
        className ?? ""
      }`}
    >
      <div className="p-4">
        <Flex align="center" justify="space-between">
          <div className="">
            <h2 className="font-[600]">{title}</h2>
            <h1 className="mt-2 text-lg font-bold">{value}</h1>
          </div>
          <div className="p-4 bg-[#f0f0f0] rounded-2xl">{icon}</div>
        </Flex>
      </div>
    </div>
  );
};

export default Card;
