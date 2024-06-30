/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { deviceType } from "@/type/device";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";
import { createAxios, tokenType } from "@/services/createInstance";
import { loginSuccess } from "@/redux/slices/authSlice";
import { Button, Space, Table, message } from "antd";
import { waitTime } from "@/constants";
import { PlusOutlined } from "@ant-design/icons";
import DeviceListLayout from "../layout";
import devicesService from "@/services/deviceService";
import { DefaultLayoutContext } from "@/layouts/DefaultLayout";
import { routes } from "@/routes";

interface DeviceListWaitingProps {}
const columns: ({
  showModal,
}: {
  showModal: (props: {
    secretKey: string;
    deviceId: string;
    type: "owner" | "user";
  }) => void;
}) => ProColumns<deviceType>[] = () => {
  return [
    {
      title: "#",
      dataIndex: "key",
      width: 48,
      search: false,
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
      ellipsis: true,
      tooltip: "Tiêu đề quá dài sẽ tự động co lại",
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "Điều này là bắt buộc",
          },
        ],
      },
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
      message.error(error.response.data.message);
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
  const { setBreadcrumbst } = useContext(DefaultLayoutContext);
  useEffect(() => {
    setBreadcrumbst([
      {
        content: "Danh sách thiết bị đang chờ",
        href: routes.deviceListWaiting,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        request={async (params) => {
          setLoading(true);
          const res: { devices: Array<deviceType> } =
            await devicesService.getAllDevices(
              axiosClient,
              params.deviceId ?? ""
            );
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
        ]}
      />
    </DeviceListLayout>
  );
};

export default DeviceListWaiting;
