/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";
import { loginSuccess } from "@/redux/slices/authSlice";
import { createAxios, tokenType } from "@/services/createInstance";
import { deviceType, historyLoggerType } from "@/type/device";
import { App } from "antd";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import Collapse from "./components/Collapse";
import useMessage from "@/hooks/useMessage";

interface DevicePageProps {}

const DevicePage: FunctionComponent<DevicePageProps> = () => {
  const params = useParams();
  const deviceId = params.deviceId;
  const [loggerData, setLoggerData] = useState<historyLoggerType[]>([]);
  const { message } = App.useApp();
  const { currentUser } = useAppSelector(userData);
  const dispatch = useAppDispatch();
  const { messageOff, joinRoom, messageReiceved } = useMessage();
  const axiosClient = createAxios(
    currentUser as tokenType,
    dispatch,
    loginSuccess
  );

  const handleMessageReceived = useCallback((message: string) => {
    const parsedData = JSON.parse(message);
    console.log(parsedData);
    if (parsedData.type === "historyLogger") {
      setLoggerData((prev) => [parsedData.message, ...prev]);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resHistory, resDevice] = await Promise.all([
          axiosClient.get<historyLoggerType[]>(`/history/logger/${deviceId}`),
          axiosClient.get<deviceType>(`/devices/${deviceId}`),
        ]);
        const historyData = resHistory.data.reverse();
        const deviceData = resDevice.data;
        setLoggerData(historyData);
        joinRoom(deviceData.roomHistoryLoggerId);
        console.log(1);
        messageReiceved(handleMessageReceived);
      } catch (error: any) {
        message.error(error.response.data.message);
      }
    };
    fetchData();

    return () => {
      messageOff("message", handleMessageReceived);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="my-4 py-4 mx-4 px-4 flex flex-col gap-4">
      <div className="text-xl font-bold">Mã thiết bị: {deviceId}</div>
      <div className="border-blue-gray-500 border-r-2 ">
        {loggerData.length
          ? loggerData.map((log) => (
              <Collapse historyLogger={log} key={log.historyId}></Collapse>
            ))
          : ""}
      </div>
    </div>
  );
};

export default DevicePage;
