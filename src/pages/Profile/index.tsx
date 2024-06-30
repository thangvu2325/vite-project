/* eslint-disable @typescript-eslint/no-unused-vars */
import { DefaultLayoutContext } from "@/layouts/DefaultLayout";
import { cn } from "@/lib/utils";
import { routes } from "@/routes";
import { ProCard } from "@ant-design/pro-components";
import { Avatar, Card, Typography } from "@material-tailwind/react";
import {
  IconEditCircle,
  IconPhone,
  IconPhoneOutgoing,
  IconReportAnalytics,
} from "@tabler/icons-react";
import { Divider, Statistic } from "antd";
import { FunctionComponent, useContext, useEffect } from "react";
interface ProfilePageProps {}
const TABLE_HEAD = ["ReportId", "Status", "CreatedAt"];

const TABLE_ROWS = [
  {
    name: "John Michael",
    job: "Manager",
    date: "23/04/18",
  },
  {
    name: "Alexa Liras",
    job: "Developer",
    date: "23/04/18",
  },
  {
    name: "Laurent Perrier",
    job: "Executive",
    date: "19/09/17",
  },
  {
    name: "Michael Levi",
    job: "Developer",
    date: "24/12/08",
  },
  {
    name: "Richard Gran",
    job: "Manager",
    date: "04/10/21",
  },
];
const ProfilePage: FunctionComponent<ProfilePageProps> = () => {
  const { setBreadcrumbst } = useContext(DefaultLayoutContext);
  useEffect(() => {
    setBreadcrumbst([
      {
        content: "Hồ sơ",
        href: routes.profile,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = () => {};

    fetchData();
  }, []);
  return (
    <div className="flex mx-4 w-full">
      <div className="flex w-full px-12 gap-8">
        <div
          className={cn("shadow-2xl rounded-md")}
          style={{ backgroundColor: "#6366f1", color: "#fff" }}
        >
          <div className="flex flex-col">
            <div className="flex flex-col items-center">
              <div className="flex w-full justify-end">
                <div className="py-2 px-2 mt-2 mr-2 cursor-pointer hover:bg-blue-300 duration-300 rounded-md">
                  <IconEditCircle></IconEditCircle>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-4 pt-0 items-center">
                <Avatar
                  src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                  alt="avatar"
                  withBorder={true}
                  color="green"
                  className="p-0.5"
                  size="xxl"
                />
                <h3 className="text-xl font-bold">Vũ Đức Thắng</h3>
                <div className="flex items-center gap-2">
                  <IconPhone></IconPhone>
                  <h3 className="text-base font-medium text-[#ccc]">
                    0395177093
                  </h3>
                </div>
              </div>
            </div>
            <Divider plain style={{ margin: 0, background: "white" }}></Divider>
          </div>
          <div className="flex flex-col pb-4 mt-4 px-6 gap-1">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">Địa chỉ</div>
              <div className="col-span-1">:</div>
              <div className="col-span-7">Địa chỉ</div>
            </div>
            <Divider
              style={{ margin: 0, background: "white", marginBottom: 12 }}
            ></Divider>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">Email</div>
              <div className="col-span-1">:</div>
              <div className="col-span-7">thangvu2325@gmail.com</div>
            </div>
            <Divider
              style={{ margin: 0, background: "white", marginBottom: 12 }}
            ></Divider>
          </div>
        </div>
        <div className="flex-1 rounded-md shadow-md flex flex-col border-[0.8px] border-[#ccc]">
          <div className="flex justify-between mx-4 bg-transparent">
            <ProCard.Group
              title={<h2 className="font-bold text-xl italic">Thống kê</h2>}
            >
              <ProCard>
                <Statistic
                  valueRender={(node) => {
                    return <h4 className="text-xl">{node}</h4>;
                  }}
                  title={
                    <div className="flex justify-between">
                      <h3 className="text-lg font-bold">Báo cáo</h3>
                      <IconReportAnalytics></IconReportAnalytics>
                    </div>
                  }
                  value={79.0}
                />
              </ProCard>
              <Divider
                type="vertical"
                style={{ margin: 0, height: "100%", background: "#ccc" }}
              ></Divider>
              <ProCard>
                <Statistic
                  valueRender={(node) => {
                    return <h4 className="text-xl">{node}</h4>;
                  }}
                  title={
                    <div className="flex justify-between">
                      <h3 className="text-lg font-bold">Hội thoại</h3>
                      <IconPhoneOutgoing></IconPhoneOutgoing>
                    </div>
                  }
                  value={79.0}
                />
              </ProCard>
            </ProCard.Group>
          </div>
          <Card className="h-full w-full overflow-scroll px-4 mt-10">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map(({ name, job, date }, _index) => (
                  <tr key={name} className="even:bg-blue-gray-50/50">
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {name}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {job}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {date}
                      </Typography>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
