import { userType } from "./auth";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type roomType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  title: string;
  description: string;
  type: "message-suporter" | "message-device";
  messages: messageType[];
  submiter: string;
  rate: number;
  owner: string;
  status: "RESOLVED" | "IN PROGRESS" | "PENDING" | "NEEDS CLARIFICATION";
};
export type createRoomtype = {
  title: string;
  description: string;
  type: "message-suporter";
  userId: string;
};
export type messageType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  content: string;
  owner: userType;
};
