/* eslint-disable @typescript-eslint/no-explicit-any */
import { socketService } from "@/services/socketService";

const messageConnection = (token: string, customer_id: string) => {
  // Cấu hình các tiêu đề yêu cầu ở đây trước khi kết nối
  const headers = {
    // Authorization: `Bearer ${token}`,
    CustomerId: customer_id,
    "Access-Control-Allow-Origin": "*",
    // Thêm các tiêu đề khác nếu cần thiết
  };
  socketService.connectWithAuthToken(token, customer_id, headers);
};

const messageReiceved = (handleMessage: (message: string) => void) => {
  socketService.subscribeToMessages(handleMessage);
};
const messageReicevedIsTyping = (handleMessage: (message: string) => void) => {
  socketService.subscribeToMessages(handleMessage);
};
const joinRoom = (roomId: string) => {
  socketService.joinRoom(roomId);
};
const leaveRoom = (roomId: string) => {
  socketService.leaveRoom(roomId);
};
const messageSent = (data: string) => {
  socketService.sendMessage(data);
};
const messageTyping = (roomId: string) => {
  socketService.typingRoom(roomId);
};
const messageChangeRoom = (roomId: string) => {
  socketService.changeRoom(roomId);
};
const messageDisconnect = () => {
  socketService.disconnect();
};
const messageOff = (event: any, handle: (message: string) => void) => {
  socketService.off(event, handle);
};
const useMessage = () => ({
  messageConnection,
  messageReiceved,
  messageDisconnect,
  messageOff,
  messageSent,
  joinRoom,
  messageTyping,
  messageReicevedIsTyping,
  leaveRoom,
  messageChangeRoom,
});
export default useMessage;
