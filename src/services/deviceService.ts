import { AxiosInstance } from "axios";

const getAllDevices = async (axiosClient: AxiosInstance, deviceId?: string) => {
  try {
    const res = await axiosClient.get(
      `/devices${deviceId ? `?deviceId=${deviceId}` : ""}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
const createDevice = async (axiosClient: AxiosInstance) => {
  const res = await axiosClient.post("/devices");
  return res.data;
};
const devicesService = { getAllDevices, createDevice };

export default devicesService;
