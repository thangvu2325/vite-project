import { messageType, roomType } from "@/type/room";
import { AxiosInstance } from "axios";

const getRoomforStatus = async (axiosClient: AxiosInstance, status: string) => {
  const res = await axiosClient.get(
    `/rooms/search?type=message-suporter&status=${status}`
  );
  return res.data;
};
const getRoomforId = async (axiosClient: AxiosInstance, ticketId: string) => {
  const res = await axiosClient.get(`/rooms/${ticketId}`);
  return res.data;
};
const getAllRoomSubmiter = async (axiosClient: AxiosInstance) => {
  const res = await axiosClient.get(`/rooms/submiter`);
  return res.data;
};
const getMessageRoom = async (
  axiosClient: AxiosInstance,
  roomId: string,
  skip: number = 0,
  take: number = 10
): Promise<Array<messageType>> => {
  try {
    const response = await axiosClient.get("/messages", {
      params: {
        roomId,
        skip,
        take,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
const updateRoom = async (
  axiosClient: AxiosInstance,
  ticketId: string,
  Dto: roomType
) => {
  const res = await axiosClient.put(`/rooms/${ticketId}`, Dto);
  return res.data;
};

const roomService = {
  getRoomforStatus,
  getRoomforId,
  updateRoom,
  getAllRoomSubmiter,
  getMessageRoom,
};
export default roomService;
