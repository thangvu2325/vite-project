/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";
import { loginSuccess } from "@/redux/slices/authSlice";
import { createAxios, tokenType } from "@/services/createInstance";

import { App, Divider } from "antd";
import Title from "antd/es/typography/Title";
import { FunctionComponent, useContext, useEffect } from "react";
import CollapseTable from "./components/CollapseTable";
import ticketsService from "@/services/ticketsService";
import { DefaultLayoutContext } from "@/layouts/DefaultLayout";
import { waitTime } from "@/constants";
import { useLocation, useNavigate } from "react-router";
import { routes } from "@/routes";

interface ReportListPageProps {}
const ReportListPage: FunctionComponent<ReportListPageProps> = () => {
  const { currentUser } = useAppSelector(userData);
  const dispatch = useAppDispatch();
  const { message } = App.useApp();
  const { setLoading } = useContext(DefaultLayoutContext);
  const axiosClient = createAxios(
    currentUser as tokenType,
    dispatch,
    loginSuccess
  );
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const getTicketHandle = async () => {
    try {
      setLoading(true);
      const ticket = await ticketsService.getTicketHandle(axiosClient);
      await waitTime(400);
      setLoading(false);
      message.success("Tìm được room thành công");
      navigate(`${pathname}/${ticket.id}`);
    } catch (error: any) {
      message.error(error.response.data.message);
      setLoading(false);
    }
  };
  const { setBreadcrumbst } = useContext(DefaultLayoutContext);
  useEffect(() => {
    setBreadcrumbst([
      {
        content: "Danh sách báo cáo",
        href: routes.reportList,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col">
      <div className="flex justify-between pt-6 px-12 pb-4">
        <Title level={1}>Danh sách báo cáo</Title>
        <button
          onClick={getTicketHandle}
          className="w-24 h-10 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-[#7dd3fc] hover:cursor-pointer"
        >
          Xử lý
        </button>
      </div>
      <Divider style={{ margin: 0 }}></Divider>
      <div className="px-12 pt-2 flex flex-col gap-4 pb-10">
        <CollapseTable type="PENDING" axiosClient={axiosClient}></CollapseTable>
        <CollapseTable
          type="RESOLVED"
          axiosClient={axiosClient}
        ></CollapseTable>
        <CollapseTable
          type="IN PROGRESS"
          axiosClient={axiosClient}
        ></CollapseTable>
        <CollapseTable
          type="NEEDS CLARIFICATION"
          axiosClient={axiosClient}
        ></CollapseTable>
      </div>
    </div>
  );
};

export default ReportListPage;
