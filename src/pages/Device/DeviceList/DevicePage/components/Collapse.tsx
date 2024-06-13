import Tag from "@/components/ui/Tag";
import { cn } from "@/lib/utils";
import { historyLoggerType } from "@/type/device";
import {
  Collapse as MaterialCollapse,
  IconButton,
} from "@material-tailwind/react";
import { IconCaretRight } from "@tabler/icons-react";
import { Divider } from "antd";
import { FunctionComponent, useRef, useState } from "react";
import JsonFormatter from "react-json-formatter";
import { format, toZonedTime } from "date-fns-tz";

interface CollapseProps {
  historyLogger: historyLoggerType;
}
const formatDateToVietnamTime = (dateString: string): string => {
  const date = new Date(dateString);
  const timeZone = "Asia/Ho_Chi_Minh";
  const zonedDate = toZonedTime(date, timeZone);

  // Format the date and time according to the required format
  const formattedDate = format(zonedDate, "dd-MM-yyyy - HH:mm:ss", {
    timeZone,
  });

  return formattedDate;
};
const Collapse: FunctionComponent<CollapseProps> = ({ historyLogger }) => {
  const [open, setOpen] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="flex flex-col gap-4  mx-auto relative px-8 pb-8">
      <div className="bg-white p-4 shadow-md rounded-lg ">
        <div className="flex gap-3 items-center ">
          <IconButton
            placeholder={"abc"}
            color="white"
            className="rounded-full w-6 h-6"
            variant="gradient"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <IconCaretRight
              size={18}
              className={cn(
                "duration-500 transition-all",
                open ? "rotate-90" : ""
              )}
            ></IconCaretRight>
          </IconButton>
          <div className="flex items-center gap-4 font-bold text-[16px]">
            <h2>Id: {historyLogger.historyId}</h2>
            <h2>Created: {formatDateToVietnamTime(historyLogger.createdAt)}</h2>
          </div>
        </div>
        <MaterialCollapse open={open} className="my-4">
          <div className="flex justify-center">
            <div className="bg-[#333333] py-2 px-8 rounded-md">
              <JsonFormatter
                json={historyLogger.logger}
                tabWith={4}
                jsonStyle={{
                  propertyStyle: { color: "#effbfe", fontSize: 14 },
                  stringStyle: { color: "#9cf99f", fontSize: 14 },
                  numberStyle: { color: "#fcc28c", fontSize: 14 },
                  booleanStyle: { color: "#fcc28c", fontSize: 14 },
                  braceStyle: { color: "white", fontSize: 14 },
                  bracketStyle: { color: "white", fontSize: 14 },
                }}
              ></JsonFormatter>
            </div>
          </div>
        </MaterialCollapse>
      </div>
      <Divider
        style={{
          margin: 0,
          borderColor: "red",
          position: "absolute",
          bottom: 0,
          right: 0,
          minWidth: 0,
          maxWidth: "240px",
        }}
      >
        <Tag
          style={{ marginRight: 0, userSelect: "none", cursor: "pointer" }}
          type={"PENDING"}
          onClick={scrollToTop}
        >
          {formatDateToVietnamTime(historyLogger.createdAt)}
        </Tag>
      </Divider>
    </div>
  );
};

export default Collapse;
