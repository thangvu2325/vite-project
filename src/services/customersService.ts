import { AxiosInstance } from "axios";

const getAllCustomers = async (axiosClient: AxiosInstance) => {
  try {
    const res = await axiosClient.get("/customers");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const customersService = { getAllCustomers };

export default customersService;
