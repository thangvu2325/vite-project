import { App, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import {
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  Suspense,
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Header from "./components/Header";
import Sider from "./components/Sider";
import { cn } from "@/lib/utils";
import LoadingScreen from "@/components/LoadingScreen";
import useMessage from "@/hooks/useMessage";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";
import { refreshToken, tokenType } from "@/services/createInstance";
import { loginSuccess } from "@/redux/slices/authSlice";
import { Breadcrumbs, Collapse, IconButton } from "@material-tailwind/react";
import { IconCaretDownFilled, IconLoader } from "@tabler/icons-react";
import roomService from "@/services/roomService";
import { messageType, roomType } from "@/type/room";
import ProfileInfoPopover from "@/components/ui/ProfileInfoPopover";
import useChatScroll from "@/hooks/useChatScroll";
import useAxiosClient from "@/hooks/useAxiosClient";

interface DefaultLayoutProps {
  children: ReactNode;
}
// Define the type for the context value
interface DefaultLayoutContextType {
  setRoomList: Dispatch<SetStateAction<roomType[] | undefined>>;
  roomList: roomType[] | undefined;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setBreadcrumbst: Dispatch<
    SetStateAction<
      | {
          content: string;
          href: string;
        }[]
      | undefined
    >
  >;
}
export type RoomSelectedProps = {
  room: roomType;
  messageData: messageType[];
  setMessageData: Dispatch<SetStateAction<messageType[]>>;
  typing: string;
};
export const RoomSelected: FunctionComponent<RoomSelectedProps> = ({
  room,
  messageData,
  setMessageData,
  typing,
}) => {
  const axiosClient = useAxiosClient();
  const [getTimes, setGetTimes] = useState(0);
  const { currentUser } = useAppSelector(userData);
  const scrollViewRef = useChatScroll(messageData);
  const { message } = App.useApp();
  useEffect(() => {
    const fetchMessageData = async (skip: number, take: number) => {
      try {
        const data = await roomService.getMessageRoom(
          axiosClient,
          room.id,
          skip,
          take
        );
        setMessageData((prev) => {
          return [...data, ...prev];
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        message.error(error?.response?.data.message);
      }
    };
    fetchMessageData(getTimes * 10, 10 + getTimes * 10);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTimes, room]);
  useEffect(() => {
    setMessageData([]);
    setGetTimes(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);
  return (
    <div className="flex flex-col h-[400px] shadow-lg border-[1px] border-[#ccc]">
      <div className="px-4 py-3 border-b dark:border-zinc-700">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
            {room?.owner}
          </h2>
        </div>
      </div>
      <div
        className="flex-1 p-3 overflow-y-auto flex flex-col space-y-2"
        id="chatDisplay"
        ref={scrollViewRef}
      >
        {messageData.length
          ? messageData.map((mess) => (
              <div
                key={mess.id}
                className={cn(
                  "text-white max-w-96 rounded-lg whitespace-pre-line px-3 py-1.5 text-sm break-words text-wrap",
                  mess.content === currentUser?.user?.id
                    ? "self-end bg-blue-500"
                    : "self-start bg-gray-600"
                )}
              >
                {mess.content}
              </div>
            ))
          : ""}
      </div>
      <div className="px-3 py-2 border-t dark:border-zinc-700">
        {typing ? (
          <div className="bg-transparent py-2 px-4 self-center flex items-center justify-center gap-2 select-none cursor-wait break-words text-wrap text-[10px]">
            <IconLoader width={10} className="animate-spin"></IconLoader>
            Người dùng {typing} đang nhập tin nhắn
          </div>
        ) : (
          ""
        )}
        <div className="flex gap-2">
          <input
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white dark:border-zinc-600 text-sm"
            id="chatInput"
            type="text"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg transition duration-300 ease-in-out text-sm"
            id="sendButton"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
// Create the context with a default value
export const DefaultLayoutContext = createContext<DefaultLayoutContextType>({
  setRoomList: () => {}, // Provide a default no-op function
  roomList: undefined,
  setLoading: () => {},
  setBreadcrumbst: () => {},
});
const DefaultLayout: FunctionComponent<DefaultLayoutProps> = ({ children }) => {
  const [siderStatus, setSiderStatus] = useState<boolean | string>("idle");
  const [open, setOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbst] =
    useState<Array<{ content: string; href: string }>>();
  const [loading, setLoading] = useState(false);
  const [roomSelected, setRoomSelected] = useState<string>("");
  const { message } = App.useApp();
  const toggleStatusSider = () => {
    if (siderStatus === "idle") {
      setSiderStatus(false);
    } else {
      setSiderStatus(!siderStatus);
    }
  };
  const [typing, setTyping] = useState<string>("");
  const [messageData, setMessageData] = useState<messageType[]>([]);
  const [roomList, setRoomList] = useState<Array<roomType>>();
  const token = useAppSelector(userData)?.currentUser as tokenType;
  const { messageConnection, messageReiceved, joinRoom, messageOff } =
    useMessage();
  const dispatch = useAppDispatch();
  const axiosClient = useAxiosClient();
  useEffect(() => {
    const handleConnect = async () => {
      if (token?.backendTokens?.accessToken) {
        if (new Date().getTime() > token?.backendTokens.expiresIn) {
          console.log("Token is expired. Refreshing...");
          const tokenData = await refreshToken(token, dispatch, loginSuccess);
          console.log("Token refreshed:", tokenData);
          messageConnection(
            tokenData.backendTokens.accessToken,
            tokenData.currentUser.id
          );
        } else {
          console.log("Token is still valid.");
          messageConnection(token.backendTokens.accessToken, token.user.id);
        }
      }
    };

    const fetchRoom = async () => {
      try {
        const data: {
          roomList: roomType[];
          count: number;
        } = await roomService.getAllRoomSubmiter(axiosClient);
        if (data.roomList.length) {
          setRoomList(data.roomList);
          data.roomList.forEach((room) => {
            joinRoom(room.id);
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        message.error(error.response.data.message);
      }
    };
    handleConnect();
    fetchRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMessageReceived = useCallback((messageReceived: string) => {
    const parsedData = JSON.parse(messageReceived);
    console.log(parsedData);
    if (parsedData.roomId === roomSelected) {
      if (parsedData.type === "message") {
        setMessageData((prev) => [...prev, parsedData.message]);
      } else if (parsedData.type === "isTyping") {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setTyping(parsedData.message);
        timeoutRef.current = setTimeout(() => {
          setTyping("");
        }, 1000);
      } else if (parsedData.type === "handleRoom") {
        // setRoom(JSON.parse(parsedData.message));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    roomList?.forEach((room: roomType) => {
      if (room?.id) {
        joinRoom(room?.id ?? "");
        messageReiceved(handleMessageReceived);
      }
    });

    return () => messageOff("message", handleMessageReceived);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomList]);
  return (
    <DefaultLayoutContext.Provider
      value={{ roomList, setRoomList, setLoading, setBreadcrumbst }}
    >
      <Layout style={{ background: "transparent" }} className="flex flex-row">
        <Sider
          siderStatus={siderStatus}
          toggleStatusSider={toggleStatusSider}
        ></Sider>
        <Content
          className={cn(
            "flex flex-col absolute right-0 h-screen bg-transparent",
            siderStatus === "idle"
              ? "left-[280px]"
              : siderStatus
              ? "left-[280px] animate-whenSideOn"
              : "left-[0] animate-WhenSiderOff"
          )}
        >
          <Header></Header>

          <Suspense
            fallback={
              <LoadingScreen content="Vui lòng chờ trong giây lát !"></LoadingScreen>
            }
          >
            <Breadcrumbs>
              {breadcrumbs?.length
                ? breadcrumbs.map((item) => (
                    <a
                      href={item.href}
                      key={item.content}
                      className="opacity-60"
                    >
                      {item.content}
                    </a>
                  ))
                : ""}
            </Breadcrumbs>
            <Content>
              <div
                className={cn(
                  "absolute top-0 left-4 right-4 z-[50] bg-[rgba(204,204,204,0.4)]",
                  loading ? "" : "hidden"
                )}
              >
                <LoadingScreen content="Đang tìm kiếm !"></LoadingScreen>
              </div>
              <div className=" w-full overflow-auto h-full">{children}</div>
            </Content>
          </Suspense>
        </Content>
        {createPortal(
          <div className="fixed z-[9999999] bottom-2 right-4 text-right">
            <IconButton
              placeholder={"abc"}
              color="blue"
              className="rounded-full w-12 h-12"
              variant="gradient"
              onClick={() => {
                setOpen(!open);
              }}
            >
              <IconCaretDownFilled
                size={18}
                className={cn(
                  "duration-200 transition-all",
                  open ? "rotate-90" : ""
                )}
              ></IconCaretDownFilled>
            </IconButton>
            <Collapse
              open={open}
              className="shadow-xl border-[1px] border-[#ccc] rounded-md"
            >
              <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 shadow-md rounded-lg flex items-start overflow-visible">
                <div className="w-20 bg-white mt-4 flex flex-col items-center px-4 gap-4 shadow-lg">
                  {roomList?.length
                    ? roomList.map((room) => (
                        <ProfileInfoPopover
                          key={room.id}
                          onClick={() => {
                            setRoomSelected(room.id);
                          }}
                          active={room.id === roomSelected}
                          customerId={room.owner}
                        ></ProfileInfoPopover>
                      ))
                    : ""}
                </div>
                <RoomSelected
                  messageData={messageData}
                  setMessageData={setMessageData}
                  typing={typing}
                  room={
                    roomList?.find(
                      (room) => room.id === roomSelected
                    ) as roomType
                  }
                ></RoomSelected>
              </div>
            </Collapse>
          </div>,
          document.body
        )}
      </Layout>
    </DefaultLayoutContext.Provider>
  );
};
export default DefaultLayout;
