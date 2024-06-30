import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";
import { loginSuccess } from "@/redux/slices/authSlice";
import { createAxios, tokenType } from "@/services/createInstance";
import { Divider } from "antd";
import Title from "antd/es/typography/Title";
import { FunctionComponent, useContext, useEffect } from "react";
import CollapseTable from "./components/CollapseTable";
import { DefaultLayoutContext } from "@/layouts/DefaultLayout";
import { routes } from "@/routes";

interface ChatListPageProps {}

const ChatListPage: FunctionComponent<ChatListPageProps> = () => {
  const { currentUser } = useAppSelector(userData);
  const dispatch = useAppDispatch();
  const axiosClient = createAxios(
    currentUser as tokenType,
    dispatch,
    loginSuccess
  );
  const { setBreadcrumbst } = useContext(DefaultLayoutContext);
  useEffect(() => {
    setBreadcrumbst([
      {
        content: "Danh sách hội thoại",
        href: routes.chatList,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col">
      <div className="flex justify-between pt-6 px-12 pb-4">
        <Title level={1}>Hội Thoại</Title>
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

export default ChatListPage;
