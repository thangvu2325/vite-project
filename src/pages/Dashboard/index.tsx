import Card from "@/components/ui/Card";
import { useAppSelector } from "@/redux/hooks";
import { customersSelector, devicesSelector } from "@/redux/selector";
import {
  IconAlertTriangle,
  IconDeviceTablet,
  IconUserBolt,
} from "@tabler/icons-react";
import { Flex } from "antd";
import { FunctionComponent } from "react";

interface DashboardPageProps {}

const DashboardPage: FunctionComponent<DashboardPageProps> = () => {
  const deviceCount = useAppSelector(devicesSelector)?.devicesCount;
  const userCount = useAppSelector(customersSelector)?.usersCount;
  return (
    <div className="w-full h-full p-4">
      <Flex gap={16}>
        <Card
          title="Số lượng thiết bị"
          value={deviceCount}
          icon={<IconDeviceTablet width={30} height={30}></IconDeviceTablet>}
        ></Card>
        <Card
          title="Số lượng người dùng"
          value={userCount}
          icon={<IconUserBolt width={30} height={30}></IconUserBolt>}
        ></Card>
        <Card
          title="Số thiết bị cảnh báo"
          value={0}
          icon={<IconAlertTriangle width={30} height={30}></IconAlertTriangle>}
        ></Card>
      </Flex>
    </div>
  );
};

export default DashboardPage;
