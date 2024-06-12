export type customerType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  username: string;
  avatar: string;
  email: string;
  isActive: boolean;
  role: string;
  customer: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    fullName: string;
    customer_id: string;
    address: string;
    email: string;
    phone: string;
  };
};
