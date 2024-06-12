import Tag from "@/components/ui/Tag";
import { waitTime } from "@/constants";
import { cn } from "@/lib/utils";
import ticketsService from "@/services/ticketsService";
import { ticketType } from "@/type/ticket";
import {
  ActionType,
  LightFilter,
  ProColumns,
  ProFormDatePicker,
  ProTable,
} from "@ant-design/pro-components";
import { Collapse, IconButton } from "@material-tailwind/react";
import { IconCaretRightFilled, IconDots } from "@tabler/icons-react";
import { Button, Divider, Rate, Tag as TagAntd } from "antd";
import { AxiosInstance } from "axios";
import { FunctionComponent, useRef, useState } from "react";
import { NavigateFunction, useLocation, useNavigate } from "react-router";
interface CollapseTableProps {
  type: "RESOLVED" | "IN PROGRESS" | "NEEDS CLARIFICATION" | "PENDING";
  axiosClient: AxiosInstance;
}
const columns: (
  navigate: NavigateFunction,
  pathname: string
) => ProColumns<ticketTable>[] = (navigate, pathname) => [
  {
    title: "#",
    dataIndex: "index",
    key: "index",
    valueType: "indexBorder",
    width: 48,
  },
  {
    title: "Tên",
    dataIndex: "topic",
    ellipsis: true,
    key: "topic",
    formItemProps: {
      rules: [
        {
          required: true,
          message: "Điều này là bắt buộc",
        },
      ],
    },
  },

  {
    title: "Priority",
    dataIndex: "priority",
    ellipsis: true,
    key: "priority",
  },
  {
    title: "Requestor",
    dataIndex: "customer_Id",
    ellipsis: true,
    key: "customer_Id",
  },
  {
    title: "Assignee",
    dataIndex: "assignee",
    ellipsis: true,
    key: "assignee",

    formItemProps: {
      rules: [
        {
          required: true,
          message: "Điều này là bắt buộc",
        },
      ],
    },
  },
  {
    title: "Submiter",
    dataIndex: "submiter",
    key: "submiter",
    ellipsis: true,
  },
  {
    title: "Notes",
    dataIndex: "notes",
    ellipsis: true,
    key: "notes",
  },
  {
    title: "Category",
    dataIndex: "category",
    ellipsis: true,
    key: "category",
    render: (_text, record) => [
      <TagAntd style={{ fontWeight: "600" }}>{record.category}</TagAntd>,
    ],
  },
  {
    title: "Đánh Giá",
    dataIndex: "rate",
    ellipsis: true,
    key: "rate",
    render: (_text, record) => [
      <Rate disabled defaultValue={record.rate}></Rate>,
    ],
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    ellipsis: true,
    key: "createdAt",
    render: (_text, record) => {
      const date = new Date(record.createdAt);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const formattedTime = date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return <div className="">{`${formattedTime}-${formattedDate}`}</div>;
    },
  },
  {
    title: "Lựa chọn",
    valueType: "option",
    key: "option",
    render: (_dom, record) => [
      <TagAntd
        key={"xem"}
        color="blue"
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate(`${pathname}/${record.id}`);
        }}
      >
        Xem
      </TagAntd>,
    ],
  },
];
export type ticketTable = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  topic: string;
  priority: "Normal" | "High" | "Urgent";
  assignee: Array<string>;
  submiter: string;
  notes: string;
  category: "Feeback" | "Error" | "Complaint";
  rate: number;
  status: "RESOLVED" | "IN PROGRESS" | "PENDING" | "NEEDS CLARIFICATION";
};
const CollapseTable: FunctionComponent<CollapseTableProps> = ({
  type = "RESOLVED",
  axiosClient,
}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const actionRef = useRef<ActionType>();
  const [loading, setLoading] = useState<boolean>(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const scrollToTop = () => {
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div ref={tableRef} className="pr-4 pb-12 border-r-2 relative">
      <div className="bg-white p-4 shadow-md rounded-lg">
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
            <IconCaretRightFilled
              size={18}
              className={cn(
                "duration-200 transition-all",
                open ? "rotate-90" : ""
              )}
            ></IconCaretRightFilled>
          </IconButton>
          <Tag style={{ marginRight: 0 }} type={type}>
            {type}
          </Tag>
          <div className="text-xs font-bold text-[#a6acb4]">{count}</div>
          <IconButton
            placeholder={""}
            color="white"
            className="rounded-full w-6 h-6"
            variant="gradient"
          >
            <IconDots></IconDots>
          </IconButton>
        </div>
        <Collapse open={open}>
          <ProTable<ticketTable>
            loading={loading}
            scroll={{ x: true }}
            columns={columns(navigate, pathname)}
            columnsState={{
              persistenceKey: "pro-table-singe-demos",
              persistenceType: "localStorage",
              defaultValue: {
                option: { fixed: "right", disable: true },
              },
            }}
            pagination={{
              pageSize: 5,
              onChange: (page) => console.log(page),
            }}
            rowKey="id"
            request={async () => {
              setLoading(true);
              try {
                const res: {
                  ticketsList: ticketType[];
                  ticketsCount: number;
                } = await ticketsService.getTicketforStatus(axiosClient, type);
                console.log(res);
                const data = res.ticketsList.map((ticket) => {
                  return {
                    ...ticket,
                    owner: ticket?.customer_Id ?? "",
                    assignee: ticket?.assignee ? ticket?.assignee : [],
                    submiter: ticket?.submiter ? ticket?.submiter : "",
                  };
                });
                await waitTime(200);
                setCount(res.ticketsCount);
                setLoading(false);
                return {
                  data,
                  total: res.ticketsCount, // Include the total count if needed
                  success: true, // Include success flag if needed
                };
              } catch (error) {
                setLoading(false);
                console.error(error);
                return {
                  data: [],
                  total: 0,
                  success: false, // Include success flag if needed
                };
              }
            }}
            toolbar={{
              search: {
                onSearch: (value: string) => {
                  alert(value);
                },
              },

              filter: (
                <LightFilter>
                  <ProFormDatePicker name="startdate" label="Ngày bắt đầu" />
                </LightFilter>
              ),
              actions: [
                <Button
                  key="primary"
                  type="primary"
                  onClick={() => {
                    alert("add");
                  }}
                >
                  Thêm
                </Button>,
              ],
            }}
            actionRef={actionRef}
            search={false}
          />
        </Collapse>
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
          type={type}
          onClick={scrollToTop}
        >
          {type}
        </Tag>
      </Divider>
    </div>
  );
};

export default CollapseTable;
