import { ticketType } from "@/type/ticket";
import { AxiosInstance } from "axios";

const getTicketforStatus = async (
  axiosClient: AxiosInstance,
  status:
    | "RESOLVED"
    | "IN PROGRESS"
    | "PENDING"
    | "NEEDS CLARIFICATION" = "IN PROGRESS"
) => {
  const res = await axiosClient.get(`/tickets?status=${status}`);
  return res.data;
};
const getTicketforId = async (axiosClient: AxiosInstance, ticketId: string) => {
  console.log(ticketId);
  const res = await axiosClient.get(`/tickets?tickedId=${ticketId}`);
  return res.data;
};
const updateTicket = async (
  axiosClient: AxiosInstance,
  ticketId: string,
  Dto: ticketType
) => {
  const res = await axiosClient.put(`/tickets/${ticketId}`, Dto);
  return res.data;
};
const getTicketHandle = async (axiosClient: AxiosInstance) => {
  const res = await axiosClient.get(`/tickets/select`);
  return res.data;
};
const ticketsService = {
  getTicketforStatus,
  getTicketforId,
  updateTicket,
  getTicketHandle,
};

export default ticketsService;
