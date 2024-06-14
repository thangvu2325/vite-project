/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";
import { config } from "../config";

import { ClientToServerEvents, ServerToClientEvents } from "@/type";
export type MessageListener = (message: string) => void;
class SocketService {
  private readonly socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    io(config.socketUrl ?? "", {
      autoConnect: true,
    });

  connectWithAuthToken(
    token: string,
    userId: string,
    headers: Record<string, string>
  ) {
    if (headers && this.socket?.io?.opts?.extraHeaders) {
      Object.keys(headers).forEach((key) => {
        if (this.socket.io.opts.extraHeaders) {
          this.socket.io.opts.extraHeaders[key] = headers[key];
        }
      });
    }

    // Thiết lập thông tin xác thực
    this.socket.auth = { token, userId };

    // Kết nối với máy chủ WebSocket
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }
  off(event: any, handle: (message: string) => void) {
    this.socket.off(event, handle);
  }
  sendMessage(data: string) {
    this.socket.emit("message", data);
  }
  subscribeToMessages(messageHandler: ServerToClientEvents["message"]) {
    this.socket.on("message", messageHandler);
  }
  joinRoom(roomId: string) {
    this.socket.emit("join", roomId);
  }
  typingRoom(roomId: string) {
    this.socket.emit("isTyping", roomId);
  }
  changeRoom(roomId: string) {
    this.socket.emit("handleRoom", roomId);
  }
  leaveRoom(roomId: string) {
    this.socket.emit("leave", roomId);
  }
}

export const socketService = new SocketService();
