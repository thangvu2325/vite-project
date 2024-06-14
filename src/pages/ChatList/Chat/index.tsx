/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";
import { loginSuccess } from "@/redux/slices/authSlice";
import { routes } from "@/routes";
import { createAxios, tokenType } from "@/services/createInstance";
import { IconArrowBackUp, IconLoader } from "@tabler/icons-react";
import { App, Divider } from "antd";
import Title from "antd/es/typography/Title";
import {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router";
import { Avatar, IconButton } from "@material-tailwind/react";
import { messageType, roomType } from "@/type/room";
import roomService from "@/services/roomService";
import Search from "antd/lib/input/Search";
import useMessage from "@/hooks/useMessage";
import { cn } from "@/lib/utils";
import useChatScroll from "@/hooks/useChatScroll";
import { DefaultLayoutContext } from "@/layouts/DefaultLayout";

interface ChatPageProps {}

const ChatPage: FunctionComponent<ChatPageProps> = () => {
  const [room, setRoom] = useState<roomType>();
  const [typing, setTyping] = useState<string>("");
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [text, setText] = useState<string>("");
  const [messageData, setMessageData] = useState<messageType[]>([]);
  const { message } = App.useApp();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { currentUser } = useAppSelector(userData);
  const dispatch = useAppDispatch();
  const axiosClient = createAxios(
    currentUser as tokenType,
    dispatch,
    loginSuccess
  );

  const handleMessageReceived = useCallback((messageReceived: string) => {
    const parsedData = JSON.parse(messageReceived);
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
      setRoom(JSON.parse(parsedData.message));
      // if (room.status === "RESOLVED") {
      //   message.success("Khách hàng đã đóng trò chuyện");
      // } else {
      // }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { roomList } = useContext(DefaultLayoutContext);
  const scrollViewRef = useChatScroll(messageData);
  const {
    messageReiceved,
    messageOff,
    joinRoom,
    messageSent,
    messageTyping,
    messageChangeRoom,
  } = useMessage();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await roomService.getRoomforId(
          axiosClient,
          params.chatId ?? ""
        );

        setRoom(data);
      } catch (error: any) {
        message.error(error.message || "An error occurred");
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (room?.id) {
      console.log(room);
      if (room.status === "RESOLVED") {
        message.info("Khách hàng đã đóng phòng!");
        navigate(routes.chatList);
        return;
      }
      joinRoom(room?.id ?? "");
      messageReiceved(handleMessageReceived);
    }
    if (room?.messages?.length) {
      setMessageData(room.messages);
    }

    return () => messageOff("message", handleMessageReceived);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);
  const updateRoom = async (dto: roomType) => {
    try {
      const data: roomType = await roomService.updateRoom(
        axiosClient,
        room?.id ?? "",
        {
          ...dto,
          submiter: currentUser?.user.id,
        } as roomType
      );
      messageChangeRoom(data.id),
        // setRoomList((prev) => (prev ? [...prev, data] : [data]));
        setRoom(data);
      message.success("Cập nhật thành công");
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const navigate = useNavigate();
  return (
    <div className="p-4 pt-0 relative">
      <div className="sticky top-4 left-4">
        <IconButton
          placeholder={""}
          color="white"
          className="rounded-full w-14 h-14"
          onClick={() => navigate(routes.chatList)}
          children={<IconArrowBackUp size={36}></IconArrowBackUp>}
        ></IconButton>
      </div>
      <div className="pb-10 flex mx-4 gap-10 ml-16">
        <div className="min-w-64 bg-[#fff] pb-12 pt-4 rounded-md shadow-md flex flex-col gap-4 flex-1">
          <h2 className="text-xl font-bold px-6">Chat</h2>
          <Search
            placeholder="Tìm người"
            enterButton={"Search"}
            size="large"
            loading={false}
            className="px-4"
          />
          <div className="flex flex-col gap-4 h-96 overflow-y-auto">
            {roomList?.length
              ? roomList.map((room) => (
                  <div className="flex gap-4 items-center py-2 px-4 cursor-pointer transition-all duration-200 rounded-md hover:bg-[#2196f3] hover:text-white">
                    <Avatar
                      size="md"
                      alt="avatar"
                      src="https://ps.w.org/user-avatar-reloaded/assets/icon-128x128.png?rev=2540745"
                      className="border border-green-500 shadow-xl shadow-green-900/20 ring-4 ring-green-500/30"
                    />
                    <h2 className="text-lg font-bold">{room?.owner}</h2>
                  </div>
                ))
              : ""}
          </div>
        </div>
        <div className="bg-[#fff] px-6 pb-12 pt-4 rounded-md shadow-md flex flex-col gap-4 w-full">
          <div className="flex justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-4">
                <Title
                  level={1}
                  style={{
                    margin: 0,
                  }}
                >
                  Mã Room:
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
                  {room?.id}
                </Title>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold">Status:</div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  className="sr-only peer"
                  value=""
                  type="checkbox"
                  checked={room?.status !== "PENDING" ? true : false}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    console.log(e.target.checked);
                    let status:
                      | "RESOLVED"
                      | "IN PROGRESS"
                      | "PENDING"
                      | "NEEDS CLARIFICATION" = "PENDING";

                    if (
                      room?.status !== "IN PROGRESS" &&
                      room?.status !== "PENDING"
                    ) {
                      e.preventDefault();
                      return;
                    }
                    // If the condition is met, update the status based on the checkbox state
                    status = e.target.checked ? "IN PROGRESS" : "PENDING";
                    console.log(status);
                    // Call the updateTicket function with the new status
                    updateRoom({
                      status,
                    } as roomType);
                  }}
                />
                <div className="w-24 h-12 rounded-full ring-0 peer duration-500 outline-none bg-gray-200 overflow-hidden before:flex before:items-center before:justify-center after:flex after:items-center after:justify-center before:content-['☀️'] before:absolute before:h-10 before:w-10 before:top-1/2 before:bg-white before:rounded-full before:left-1 before:-translate-y-1/2 before:transition-all before:duration-700 peer-checked:before:opacity-0 peer-checked:before:rotate-90 peer-checked:before:-translate-y-full shadow-lg shadow-gray-400 peer-checked:shadow-lg peer-checked:shadow-gray-700 peer-checked:bg-[#383838] after:content-['🌑'] after:absolute after:bg-[#1d1d1d] after:rounded-full after:top-[4px] after:right-1 after:translate-y-full after:w-10 after:h-10 after:opacity-0 after:transition-all after:duration-700 peer-checked:after:opacity-100 peer-checked:after:rotate-180 peer-checked:after:translate-y-0"></div>
              </label>
            </div>
          </div>
          <Divider style={{ margin: 0 }}></Divider>
          <div className=" px-4 py-2">
            <div className="flex gap-4 items-center">
              <Avatar
                size="lg"
                alt="avatar"
                src="https://ps.w.org/user-avatar-reloaded/assets/icon-128x128.png?rev=2540745"
                className="border border-green-500 shadow-xl shadow-green-900/20 ring-4 ring-green-500/30"
              />
              <h2 className="text-xl font-bold">{room?.owner}</h2>
            </div>
            <div className="bg-[#ccc] h-96 mt-4 rounded-md shadow-md flex flex-col">
              <div
                className="overflow-y-auto flex flex-col space-y-2 flex-1 p-4"
                ref={scrollViewRef}
              >
                {messageData.length
                  ? messageData.map((mess) => (
                      <div
                        key={mess.id}
                        className={cn(
                          "text-white max-w-96 rounded-lg whitespace-pre-line px-3 py-1.5 text-sm break-words text-wrap",
                          mess?.owner?.id === currentUser?.user?.id
                            ? "self-end bg-blue-500"
                            : "self-start bg-gray-600"
                        )}
                      >
                        {mess.content}
                      </div>
                    ))
                  : ""}
              </div>
              {typing ? (
                <div className="bg-transparent py-2 px-4 self-center flex items-center justify-center gap-2 select-none cursor-wait break-words text-wrap">
                  <IconLoader width={24} className="animate-spin"></IconLoader>
                  Người dùng {typing} đang nhập tin nhắn
                </div>
              ) : (
                ""
              )}

              <div className="px-3 py-2 border-t dark:border-zinc-700">
                <div className="flex gap-2">
                  <input
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-lg dark:bg-zinc-700 dark:text-white dark:border-zinc-600 text-sm"
                    id="chatInput"
                    type="text"
                    value={text}
                    onKeyUp={async (e) => {
                      if (e.key === "Enter") {
                        if (text !== "") {
                          await messageSent(
                            JSON.stringify({
                              roomId: params.chatId ?? "",
                              content: text,
                            })
                          );
                          setText("");
                        }
                      }
                    }}
                    onChange={(e) => {
                      messageTyping(params.chatId ?? "");
                      setText(e.target.value);
                    }}
                  />
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg transition duration-300 ease-in-out text-sm"
                    id="sendButton"
                    onClick={async () => {
                      if (text !== "") {
                        await messageSent(
                          JSON.stringify({
                            roomId: params.chatId ?? "",
                            content: text,
                          })
                        );
                        setText("");
                      }
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
