/* eslint-disable @typescript-eslint/no-explicit-any */
import Tag from "@/components/ui/Tag";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";
import { loginSuccess } from "@/redux/slices/authSlice";
import { routes } from "@/routes";
import { createAxios, tokenType } from "@/services/createInstance";
import ticketsService from "@/services/ticketsService";
import { ticketType } from "@/type/ticket";
import { IconArrowBackUp } from "@tabler/icons-react";
import { App, Tag as TagAntd } from "antd";
import Title from "antd/es/typography/Title";
import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { IconButton, Textarea } from "@material-tailwind/react";

interface ReportPageProps {}

const ReportPage: FunctionComponent<ReportPageProps> = () => {
  const [ticket, setTicket] = useState<ticketType>();
  const params = useParams();
  const { message } = App.useApp();
  const { currentUser } = useAppSelector(userData);
  const dispatch = useAppDispatch();
  const axiosClient = createAxios(
    currentUser as tokenType,
    dispatch,
    loginSuccess
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: {
          ticketsList: ticketType[];
          ticketsCount: number;
        } = await ticketsService.getTicketforId(
          axiosClient,
          params.tickedId ?? ""
        );
        setTicket(data.ticketsList[0]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        message.error(error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const updateTicket = async (dto: ticketType) => {
    try {
      const data = await ticketsService.updateTicket(
        axiosClient,
        ticket?.id ?? "",
        dto
      );
      setTicket(data);
      message.success("Cập nhật thành công");
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const navigate = useNavigate();
  return (
    <div className="p-4 relative">
      <div className="sticky top-4 left-4">
        <IconButton
          placeholder={""}
          color="white"
          className="rounded-full w-14 h-14"
          onClick={() => navigate(routes.reportList)}
          children={<IconArrowBackUp size={36}></IconArrowBackUp>}
        ></IconButton>
      </div>
      <div className="mx-auto pb-10">
        <div className="mx-12 mt-4 bg-[#fff] px-6 py-12 rounded-md shadow-md flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-4">
                <Title
                  level={1}
                  style={{
                    margin: 0,
                  }}
                >
                  Mã Ticket:
                </Title>
                <Title
                  level={1}
                  copyable
                  style={{
                    margin: 0,
                    width: 120,
                    whiteSpace: "nowrap",
                  }}
                  ellipsis
                >
                  {ticket?.id}
                </Title>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Title
                  level={1}
                  style={{
                    margin: 0,
                  }}
                >
                  Loại Ticket:
                </Title>
                <TagAntd color="error">
                  <Title
                    level={1}
                    style={{
                      margin: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ticket?.category}
                  </Title>
                </TagAntd>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold">Status:</div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  className="sr-only peer"
                  value=""
                  type="checkbox"
                  checked={ticket?.status !== "PENDING" ? true : false}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    console.log(e.target.checked);
                    let status:
                      | "RESOLVED"
                      | "IN PROGRESS"
                      | "PENDING"
                      | "NEEDS CLARIFICATION" = "PENDING";

                    if (
                      ticket?.status !== "IN PROGRESS" &&
                      ticket?.status !== "PENDING"
                    ) {
                      e.preventDefault();
                      return;
                    }

                    // If the condition is met, update the status based on the checkbox state
                    status = e.target.checked ? "IN PROGRESS" : "PENDING";

                    // Call the updateTicket function with the new status
                    updateTicket({
                      status,
                    } as ticketType);
                  }}
                />
                <div className="w-24 h-12 rounded-full ring-0 peer duration-500 outline-none bg-gray-200 overflow-hidden before:flex before:items-center before:justify-center after:flex after:items-center after:justify-center before:content-['☀️'] before:absolute before:h-10 before:w-10 before:top-1/2 before:bg-white before:rounded-full before:left-1 before:-translate-y-1/2 before:transition-all before:duration-700 peer-checked:before:opacity-0 peer-checked:before:rotate-90 peer-checked:before:-translate-y-full shadow-lg shadow-gray-400 peer-checked:shadow-lg peer-checked:shadow-gray-700 peer-checked:bg-[#383838] after:content-['🌑'] after:absolute after:bg-[#1d1d1d] after:rounded-full after:top-[4px] after:right-1 after:translate-y-full after:w-10 after:h-10 after:opacity-0 after:transition-all after:duration-700 peer-checked:after:opacity-100 peer-checked:after:rotate-180 peer-checked:after:translate-y-0"></div>
              </label>
            </div>
          </div>
          <h2 className="text-center text-xl uppercase">{ticket?.topic}</h2>

          <div className="grid grid-cols-12 px-4 py-2 text-[#898c92]">
            <div className="col-span-3">
              <h3 className="m-0 font-bold">Status</h3>
            </div>
            <div className="col-span-1">:</div>
            <div className="col-span-8 flex">
              <Tag type={ticket?.status ?? "IN PROGRESS"}>
                {ticket?.status ?? "IN PROGRESS"}
              </Tag>
            </div>
          </div>
          <div className="grid grid-cols-12 px-4 py-2 text-[#898c92]">
            <div className="col-span-3">
              <h3 className="m-0 font-bold">Assignees</h3>
            </div>
            <div className="col-span-1">:</div>
            <div className="col-span-8 flex">
              {ticket?.assignee?.length ? ticket?.assignee.join(",") : "Empty"}
            </div>
          </div>
          <div className="grid grid-cols-12 px-4 py-2 text-[#898c92]">
            <div className="col-span-3">
              <h3 className="m-0 font-bold">Submiter</h3>
            </div>
            <div className="col-span-1">:</div>
            <div className="col-span-8 flex">
              {ticket?.submiter ? ticket?.submiter : "Empty"}
            </div>
          </div>
          <div className="grid grid-cols-12 px-4 py-2 text-[#898c92]">
            <div className="col-span-3">
              <h3 className="m-0 font-bold">Tạo ngày</h3>
            </div>
            <div className="col-span-1">:</div>
            <div className="col-span-8 flex">{`${new Date(
              ticket?.createdAt ?? ""
            ).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}-${new Date(ticket?.createdAt ?? "").toLocaleTimeString(
              "en-GB",
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }
            )}`}</div>
          </div>
          <div className="grid grid-cols-12 px-4 py-2 text-[#898c92]">
            <div className="col-span-3">
              <h3 className="m-0 font-bold">Priority</h3>
            </div>
            <div className="col-span-1">:</div>
            <div className="col-span-8 flex">{ticket?.priority}</div>
          </div>
          <h2 className="font-bold text-lg mt-4">Requestor Field</h2>
          <div className="grid grid-cols-12 px-4 py-2 text-[#898c92]">
            <div className="col-span-3">
              <h3 className="m-0 font-bold">Requestor</h3>
            </div>
            <div className="col-span-1">:</div>
            <div className="col-span-8 flex">
              {ticket?.customer_Id ?? "Empty"}
            </div>
          </div>
          <div className="grid grid-cols-12 px-4 py-2 text-[#898c92]">
            <div className="col-span-3">
              <h3 className="m-0 font-bold">Notes:</h3>
            </div>
            <div className="col-span-1">:</div>
            <div className="col-span-8 flex ">{ticket?.notes ?? "Empty"}</div>
          </div>
          <div className="px-4 py-2 text-[#898c92]">
            <Textarea
              value={ticket?.message}
              onChange={(e) => {
                setTicket(
                  (prev) => ({ ...prev, message: e.target.value } as ticketType)
                );
              }}
              className="h-52"
              label="Message"
            ></Textarea>
          </div>
          <div className="flex justify-end mr-12">
            <button
              onClick={() => {
                updateTicket({
                  ...ticket,
                  status: "RESOLVED",
                } as ticketType);
                navigate(routes.reportList);
              }}
              className="w-24 h-10 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-[#7dd3fc] hover:cursor-pointer"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
