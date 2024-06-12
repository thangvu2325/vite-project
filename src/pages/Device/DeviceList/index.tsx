import { FunctionComponent, useRef, useState } from "react";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  ModalForm,
  ProDescriptions,
  ProTable,
  TableDropdown,
} from "@ant-design/pro-components";
import { deviceType } from "@/type/device";
import DeviceListLayout from "./layout";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";
import { createAxios, tokenType } from "@/services/createInstance";
import { loginSuccess } from "@/redux/slices/authSlice";
import { Button, Divider, Dropdown, Space, Table, Tag, message } from "antd";
import Title from "antd/es/typography/Title";
import { waitTime } from "@/constants";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import devicesService from "@/services/deviceService";
import { AxiosInstance } from "axios";
import LineChart from "../components/LineChart";
interface DeviceListProps {}
const columns: ({
  showModal,
  axiosClient,
}: {
  showModal: (props: {
    secretKey: string;
    deviceId: string;
    type: "owner" | "user";
  }) => void;
  axiosClient: AxiosInstance;
}) => ProColumns<deviceType>[] = ({ showModal }) => {
  return [
    {
      title: "#",
      dataIndex: "index",
      valueType: "indexBorder",
      width: 48,
    },
    {
      title: "Mã thiết bị",
      dataIndex: "deviceId",
      copyable: true,
      ellipsis: true,
      tooltip: "Tiêu đề quá dài sẽ tự động co lại",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Điều này là bắt buộc",
          },
        ],
      },
    },
    {
      title: "Mã Khách Hàng",
      dataIndex: "customer_id",
      copyable: true,
      ellipsis: true,
      tooltip: "Tiêu đề quá dài sẽ tự động co lại",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Điều này là bắt buộc",
          },
        ],
      },
    },
    {
      title: "Room",
      dataIndex: "roomId",
      copyable: true,
      ellipsis: true,
      tooltip: "Tiêu đề quá dài sẽ tự động co lại",
    },
    {
      title: "Lựa chọn",
      valueType: "option",
      key: "option",
      render: (_text, record, _, action) => [
        <Tag
          color={"purple"}
          style={{ cursor: "pointer", marginRight: "0" }}
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          Edit
        </Tag>,
        <ModalForm
          style={{
            marginTop: "0",
            height: 600,
            overflow: "auto",
            scrollBehavior: "smooth",
          }}
          title={<Title level={2}>Thông Tin Chi Tiết</Title>}
          trigger={
            <Tag color={"green"} style={{ cursor: "pointer" }}>
              Detail
            </Tag>
          }
          submitter={{
            searchConfig: {
              submitText: "Xác Nhận",
              resetText: "Làm Mới",
            },
          }}
          onFinish={async (values) => {
            await waitTime(2000);
            console.log(values);
            message.success("thành công");
            return true;
          }}
        >
          <ProDescriptions
            column={2}
            title="Thiết Bị"
            tooltip="Danh sách chi tiết của thiết bị"
            className="ml-10"
          >
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="Mã Thiết Bị"
            >
              {record.deviceId}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="Khói"
            >
              {record.sensors?.whiteSmokeVal}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="Dung lượng Pin:"
              tooltip="Dung lượng pin, tối đa là 5000"
            >
              {record.battery?.voltage}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="Time Updated"
              valueType="dateTime"
              span={2}
            >
              {dayjs(record.updatedAt).valueOf()}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2}>
              <Divider style={{ margin: "4px 0" }}></Divider>
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} valueType="text" ellipsis>
              <Title level={3}>Tín Hiệu</Title>
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="Band"
            >
              {record.signal?.band}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="EARFCN"
            >
              {record.signal?.EARFCN}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={2}
              valueType="text"
              ellipsis
              label="Operator"
            >
              {record.signal?.Operator}
            </ProDescriptions.Item>

            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="absoluteRadioFrequencyChannel"
            >
              {record.signal?.PCI}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="RSRP"
            >
              {record.signal?.RSRP}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="RSRQ"
            >
              {record.signal?.RSRQ}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="RSSI"
            >
              {record.signal?.RSSI}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="T3324"
            >
              {record.signal?.T3324}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="T3412"
            >
              {record.signal?.T3412}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="band"
            >
              {record.signal?.band}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="connectionStatus"
            >
              {record.signal?.connectionStatus}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="ipAddress"
            >
              {record.signal?.ipAddress}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="tac"
            >
              {record.signal?.tac}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="Time Updated"
              valueType="dateTime"
              span={2}
            >
              {dayjs(record.updatedAt).valueOf()}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} valueType="text" ellipsis>
              <Title level={2}>Lịch sử</Title>
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} valueType="slider" ellipsis>
              <LineChart deviceId={record.deviceId}></LineChart>
            </ProDescriptions.Item>
          </ProDescriptions>
        </ModalForm>,

        <TableDropdown
          key="actionGroup"
          onSelect={(key: string) => {
            switch (key) {
              case "QRCode":
                showModal({
                  deviceId: record.deviceId,
                  secretKey: record.secretKey,
                  type: "owner",
                });
                break;
              case "copy":
                break;
              case "delete":
                break;
              default:
            }
          }}
          menus={[
            { key: "copy", name: "Edit" },
            { key: "delete", name: "Delete" },
            {
              key: "QRCode",
              name: "QR Code",
            },
          ]}
        />,
      ],
    },
  ];
};
const DeviceList: FunctionComponent<DeviceListProps> = () => {
  const [deviceQRCode, setDeviceQRCode] = useState<
    Array<{
      secretKey: string;
      deviceId: string;
      type: "owner" | "user";
    }>
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const userToken = useAppSelector(userData)?.currentUser as tokenType;
  const actionRef = useRef<ActionType>();
  const axiosClient = createAxios(userToken, dispatch, loginSuccess);
  // const devices = useAppSelector(devicesSelector)?.devices;
  // Modal Antd
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (props: {
    deviceId: string;
    secretKey: string;
    type: "owner" | "user";
  }) => {
    setDeviceQRCode([props]);
    setIsModalOpen(true);
  };

  return (
    <DeviceListLayout
      setIsModalOpen={setIsModalOpen}
      isModalOpen={isModalOpen}
      deviceQRCode={deviceQRCode}
    >
      <ProTable<deviceType>
        columns={(() => columns({ showModal, axiosClient }))()}
        cardBordered
        editable={{
          type: "multiple",
        }}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => {
          return (
            <Space size={24}>
              <span>
                Đang chọn {selectedRowKeys.length} thiết bị
                <a
                  style={{
                    marginInlineStart: 8,
                    fontWeight: 600,
                    marginLeft: 16,
                  }}
                  onClick={onCleanSelected}
                >
                  Hủy lựa chọn
                </a>
              </span>
            </Space>
          );
        }}
        actionRef={actionRef}
        loading={loading}
        request={async () => {
          setLoading(true);
          await waitTime(1000);
          const res: { devices: Array<deviceType> } =
            await devicesService.getAllDevices(axiosClient);
          setLoading(false);
          return {
            data: res.devices
              .filter((device) => device.active)
              .map((device) => {
                const { customer_id, ...props } = device;
                return {
                  ...props,
                  customer_id: customer_id,
                  url: "",
                };
              }),
          };
        }}
        columnsState={{
          persistenceKey: "pro-table-singe-demos",
          persistenceType: "localStorage",
          defaultValue: {
            option: { fixed: "right", disable: true },
          },
          onChange(value) {
            console.log("value: ", value);
          },
        }}
        rowKey="deviceId"
        search={{
          labelWidth: "auto",
        }}
        options={{
          setting: {
            listsHeight: 400,
          },
        }}
        form={{
          syncToUrl: (values, type) => {
            if (type === "get") {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
          },
        }}
        pagination={{
          pageSize: 5,
          onChange: (page) => console.log(page),
        }}
        dateFormatter="string"
        headerTitle="Danh Sách Thiết Bị"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            onClick={() => {}}
            type="primary"
          >
            Thêm
          </Button>,
          <Dropdown
            key="menu"
            menu={{
              items: [
                {
                  label: "1st item",
                  key: "1",
                },
                {
                  label: "2nd item",
                  key: "1",
                },
                {
                  label: "3rd item",
                  key: "1",
                },
              ],
            }}
          >
            <Button>
              <EllipsisOutlined />
            </Button>
          </Dropdown>,
        ]}
      />
    </DeviceListLayout>
  );
};

export default DeviceList;
