import { roomType } from "@/type/room";
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
};
export default roomService;
