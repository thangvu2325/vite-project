/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, useRef, useState } from "react";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  ModalForm,
  ProDescriptions,
  ProTable,
  TableDropdown,
} from "@ant-design/pro-components";
import { deviceType } from "@/type/device";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";
import { createAxios, tokenType } from "@/services/createInstance";
import { loginSuccess } from "@/redux/slices/authSlice";
import { Button, Dropdown, Space, Table, Tag, message } from "antd";
import Title from "antd/es/typography/Title";
import { waitTime } from "@/constants";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import DeviceListLayout from "../layout";
import devicesService from "@/services/deviceService";

interface DeviceListWaitingProps {}
const columns: ({
  showModal,
}: {
  showModal: (props: {
    secretKey: string;
    deviceId: string;
    type: "owner" | "user";
  }) => void;
}) => ProColumns<deviceType>[] = ({ showModal }) => {
  return [
    {
      title: "#",
      dataIndex: "key",
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
      title: "Mã Bí Mật",
      dataIndex: "secretKey",
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
          style={{ marginTop: "0", top: "50px" }}
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
          onFinish={async () => {
            await waitTime(2000);
            message.success("Refresh thành công!");
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
              {record?.deviceId}
            </ProDescriptions.Item>
            {/* <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="Khói"
            >
              {record?.sensors?.smokeValue}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="Dung lượng Pin:"
              tooltip="Dung lượng pin, tối đa là 5000"
            >
              {record?.battery?.voltage}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="Nguồn"
            >
              {record?.battery?.source.toUpperCase()}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="Time Updated"
              valueType="dateTime"
              span={2}
            >
              {dayjs(record?.updatedAt).valueOf()}
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
              {record?.signal?.band}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="deviceNetworkRssiDbm"
            >
              {record?.signal?.deviceNetworkRssiDbm}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={2}
              valueType="text"
              ellipsis
              label="gsmStatus"
            >
              {record?.signal?.gsmStatus}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} valueType="text" ellipsis>
              <Title level={3}>Network</Title>
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="absoluteRadioFrequencyChannel"
            >
              {record.signal?.networkReport.absoluteRadioFrequencyChannel}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="areaTacChangeCount"
            >
              {record.signal?.networkReport.areaTacChangeCount}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="cellChangeCount"
            >
              {record.signal?.networkReport.cellChangeCount}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="cellId"
            >
              {record.signal?.networkReport?.cellId}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="connectionStatus"
            >
              {record.signal?.networkReport?.connectionStatus}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="extendedDiscontinuousReception"
            >
              {record.signal?.networkReport?.extendedDiscontinuousReception}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="ipAddress"
            >
              {record.signal?.networkReport?.ipAddress}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="mcc"
            >
              {record.signal?.networkReport?.mcc}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="mnc"
            >
              {record.signal?.networkReport?.mnc}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="referenceSignalReceivedPower"
            >
              {record.signal?.networkReport?.referenceSignalReceivedPower}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="referenceSignalReceivedQuality"
            >
              {record.signal?.networkReport?.referenceSignalReceivedQuality}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="requestedActiveTime"
            >
              {record.signal?.networkReport?.requestedActiveTime}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="requestedPeriodicTrackingAreaUpdate"
            >
              {
                record.signal?.networkReport
                  ?.requestedPeriodicTrackingAreaUpdate
              }
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              valueType="text"
              ellipsis
              label="tac"
            >
              {record.signal?.networkReport?.tac}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="Time Updated"
              valueType="dateTime"
              span={2}
            >
              {dayjs(record.signal?.networkReport?.updatedAt).valueOf()}
            </ProDescriptions.Item> */}
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
              default:
            }
          }}
          menus={[
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
const DeviceListWaiting: FunctionComponent<DeviceListWaitingProps> = () => {
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
  // Modal Antd
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCreateDevice = async () => {
    try {
      await devicesService.createDevice(axiosClient);
      message.success("Thèm thiết bị thành công!");
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const showModal = (pros: {
    secretKey: string;
    deviceId: string;
    type: "owner" | "user";
  }) => {
    setDeviceQRCode([pros]);
    setIsModalOpen(true);
  };

  return (
    <DeviceListLayout
      setIsModalOpen={setIsModalOpen}
      isModalOpen={isModalOpen}
      deviceQRCode={deviceQRCode}
    >
      <ProTable<deviceType>
        columns={(() => columns({ showModal }))()}
        cardBordered
        editable={{
          type: "multiple",
        }}
        actionRef={actionRef}
        loading={loading}
        request={async () => {
          setLoading(true);
          const res: { devices: Array<deviceType> } =
            await devicesService.getAllDevices(axiosClient);
          await waitTime(2000);
          setLoading(false);
          return {
            data: res.devices
              ?.filter((device) => !device.active)
              .map((device, index) => {
                const { ...props } = device;
                return {
                  key: index + 1,
                  ...props,

                  url: "",
                };
              }),
          };
        }}
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          onChange: (_selectedRowKeys, selectedRows) => {
            setDeviceQRCode(
              selectedRows.map((row) => {
                return {
                  deviceId: row.deviceId,
                  secretKey: row.secretKey,
                  type: "owner",
                };
              })
            );
          },
        }}
        rowKey="deviceId"
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
        headerTitle="Danh Sách Thiết Bị đang chờ kết nối"
        toolBarRender={(action) => [
          <Button
            key="createQR"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
            type="primary"
          >
            Tạo Mã QR
          </Button>,
          <Button
            key="buttonAdd"
            icon={<PlusOutlined />}
            onClick={async () => {
              await handleCreateDevice();
              action?.reload();
            }}
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
                  key: "1st item",
                },
                {
                  label: "2nd item",
                  key: "2nd item",
                },
                {
                  label: "3rd item",
                  key: "3rd item",
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

export default DeviceListWaiting;
