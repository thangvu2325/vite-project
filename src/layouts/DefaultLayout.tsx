import { App, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import {
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  Suspense,
  createContext,
  useEffect,
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
import {
  createAxios,
  refreshToken,
  tokenType,
} from "@/services/createInstance";
import { loginSuccess } from "@/redux/slices/authSlice";
import { Collapse, IconButton } from "@material-tailwind/react";
import { IconCaretDownFilled } from "@tabler/icons-react";
import roomService from "@/services/roomService";
import { roomType } from "@/type/room";
import ProfileInfoPopover from "@/components/ui/ProfileInfoPopover";

interface DefaultLayoutProps {
  children: ReactNode;
}
// Define the type for the context value
interface DefaultLayoutContextType {
  setRoomList: Dispatch<SetStateAction<roomType[] | undefined>>;
  roomList: roomType[] | undefined;
}

// Create the context with a default value
export const DefaultLayoutContext = createContext<DefaultLayoutContextType>({
  setRoomList: () => {}, // Provide a default no-op function
  roomList: undefined,
});
const DefaultLayout: FunctionComponent<DefaultLayoutProps> = ({ children }) => {
  const [siderStatus, setSiderStatus] = useState<boolean | string>("idle");
  const [open, setOpen] = useState(false);
  const [roomSelected, setRoomSelected] = useState<string>("");
  const { message } = App.useApp();
  const toggleStatusSider = () => {
    if (siderStatus === "idle") {
      setSiderStatus(false);
    } else {
      setSiderStatus(!siderStatus);
    }
  };
  const [roomList, setRoomList] = useState<Array<roomType>>();
  const token = useAppSelector(userData)?.currentUser as tokenType;
  const { messageConnection, joinRoom } = useMessage();
  const dispatch = useAppDispatch();
  const axiosClient = createAxios(token, dispatch, loginSuccess);
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
          console.log(data.roomList);
          setRoomList(data.roomList);
          data.roomList.forEach((room) => {
            joinRoom(room.id);
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        message.error(error.message);
      }
    };
    handleConnect();
    fetchRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(roomSelected);
  return (
    <DefaultLayoutContext.Provider value={{ roomList, setRoomList }}>
      <Layout style={{ background: "transparent" }} className="flex flex-row">
        <Sider
          siderStatus={siderStatus}
          toggleStatusSider={toggleStatusSider}
        ></Sider>
        <Content
          className={cn(
            "flex flex-col absolute right-0 h-screen",
            siderStatus === "idle"
              ? "left-[280px]"
              : siderStatus
              ? "left-[280px] animate-whenSideOn"
              : "left-[0] animate-WhenSiderOff"
          )}
        >
          <Header></Header>
          <Suspense fallback={<LoadingScreen></LoadingScreen>}>
            <Content>
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
                <div className="flex flex-col h-[400px] shadow-lg border-[1px] border-[#ccc]">
                  <div className="px-4 py-3 border-b dark:border-zinc-700">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-semibold text-zinc-800 dark:text-white">
                        CR_asadsada
                      </h2>
                    </div>
                  </div>
                  <div
                    className="flex-1 p-3 overflow-y-auto flex flex-col space-y-2"
                    id="chatDisplay"
                  >
                    <div className="chat-message self-end bg-blue-500 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm">
                      Hello! How can I assist you today?
                    </div>
                    <div className="chat-message self-start bg-gray-600 text-white max-w-xs rounded-lg px-3 py-1.5 text-sm">
                      Hello! I need a Chatbot!
                    </div>
                  </div>
                  <div className="px-3 py-2 border-t dark:border-zinc-700">
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
