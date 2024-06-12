export type ticketType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  topic: string;
  priority: "Normal" | "High" | "Urgent";
  assignee: string[];
  submiter: string;
  customer_Id: string;
  notes: string;
  category: "Feeback" | "Error" | "Complaint";
  rate: number;
  status: "RESOLVED" | "IN PROGRESS" | "PENDING" | "NEEDS CLARIFICATION";
  message: string;
};
