import { Tag as TagAntd } from "antd";
import { CSSProperties, FunctionComponent, ReactNode } from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { LiteralUnion } from "antd/lib/_util/type";
import { PresetColorKey } from "antd/lib/theme/internal";
import { IconPoint } from "@tabler/icons-react";
interface TagsProps {
  type: "RESOLVED" | "IN PROGRESS" | "NEEDS CLARIFICATION" | "PENDING";
  children: ReactNode;
  style?: CSSProperties;
  onClick?: React.MouseEventHandler<HTMLSpanElement> | undefined;
}

const Tag: FunctionComponent<TagsProps> = ({
  children,
  type,
  style,
  onClick,
}) => {
  let color:
    | LiteralUnion<
        | PresetColorKey
        | "success"
        | "processing"
        | "error"
        | "default"
        | "warning"
      >
    | undefined;
  let icon: ReactNode;
  switch (type) {
    case "RESOLVED":
      color = "success";
      icon = <CheckCircleOutlined></CheckCircleOutlined>;
      break;
    case "IN PROGRESS":
      color = "processing";
      icon = <ClockCircleOutlined></ClockCircleOutlined>;
      break;
    case "NEEDS CLARIFICATION":
      color = "geekblue";
      icon = <SyncOutlined></SyncOutlined>;
      break;
    case "PENDING":
      color = "blue";
      icon = <IconPoint></IconPoint>;
      break;
    default:
      color = "default";
      icon = null;
  }
  return (
    <TagAntd
      onClick={onClick}
      icon={icon}
      color={color}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: 2,
        paddingRight: 4,
        paddingLeft: 2,
        ...style,
      }}
    >
      {children}
    </TagAntd>
  );
};

export default Tag;
