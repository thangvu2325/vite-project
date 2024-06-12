export type registerType = {
  secretKey: string;
  email: string;
  password: string;
};
export type loginType = Pick<registerType, "email" | "password">;
export type userType = {
  id: string;
  username: string;
  password: string;
  email: string;
  phone: stromg;
  customer_Id: string;
};
