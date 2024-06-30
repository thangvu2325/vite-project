/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@/components/ui/Card";
import useAxiosClient from "@/hooks/useAxiosClient";
import { DefaultLayoutContext } from "@/layouts/DefaultLayout";
import customersService from "@/services/customersService";
import devicesService from "@/services/deviceService";
import { customerType } from "@/type/customers";
import { deviceType } from "@/type/device";
import {
  IconDeviceTablet,
  IconPlugConnected,
  IconUserBolt,
} from "@tabler/icons-react";
import { App, Flex } from "antd";
import { FunctionComponent, useContext, useEffect, useState } from "react";

interface DashboardPageProps {}

const DashboardPage: FunctionComponent<DashboardPageProps> = () => {
  const axiosClient = useAxiosClient();
  const { message } = App.useApp();
  const { setBreadcrumbst } = useContext(DefaultLayoutContext);
  const [deviceList, setDeviceList] = useState<deviceType[]>();
  const [customerList, setCustomerList] = useState<customerType[]>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devicesData, customerData] = await Promise.all([
          devicesService.getAllDevices(axiosClient),
          customersService.getAllCustomers(axiosClient),
        ]);

        const devices = devicesData.devices;
        const customers = customerData.customers;

        setDeviceList(devices);
        setCustomerList(customers);
      } catch (error: any) {
        message.error(error.response.data.message);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps

    setBreadcrumbst([
      {
        content: "Dashboard",
        href: "/dashboard",
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full h-full p-4 ">
      <Flex gap={16}>
        <Card
          title="Số lượng thiết bị"
          value={deviceList?.length ?? 0}
          icon={<IconDeviceTablet width={30} height={30}></IconDeviceTablet>}
        ></Card>
        <Card
          title="Số lượng người dùng"
          value={customerList?.length ?? 0}
          icon={<IconUserBolt width={30} height={30}></IconUserBolt>}
        ></Card>
        <Card
          title="Số thiết bị đang chờ kết nối"
          value={
            deviceList?.filter((device) => device.active === false).length ?? 0
          }
          icon={<IconPlugConnected width={30} height={30}></IconPlugConnected>}
        ></Card>
      </Flex>
    </div>
  );
};

export default DashboardPage;
