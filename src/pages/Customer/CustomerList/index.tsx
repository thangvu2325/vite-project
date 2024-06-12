import { Button, Dropdown, Tag, theme, message } from "antd";
import { Fragment, FunctionComponent, useRef, useState } from "react";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable, TableDropdown, ModalForm } from "@ant-design/pro-components";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { customersSelector, userData } from "@/redux/selector";
import { createAxios, tokenType } from "@/services/createInstance";
import { loginSuccess } from "@/redux/slices/authSlice";
import { waitTime } from "@/constants";
import Title from "antd/es/typography/Title";
import { customerType } from "@/type/customers";
import { fetchDataCustomers } from "@/redux/slices/customersSlice";
import customersService from "@/services/customersService";
const { useToken } = theme;

interface CustomerListProps {}

const columns: ProColumns<customerType>[] = [
  {
    title: "#",
    dataIndex: "index",
    valueType: "indexBorder",
    width: 48,
    key: "index",
  },
  {
    title: "Tài Khoản",
    dataIndex: "username",
    key: "username",
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
    title: "Tên Khách Hàng",
    valueType: "text",
    render: (_text, record) => [
      <Fragment>{record.customer?.fullName ?? ""}</Fragment>,
    ],
    key: "text",
    copyable: true,
    search: false,
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
    title: "Email",
    dataIndex: "email",
    key: "email",
    ellipsis: true,
    tooltip: "Tiêu đề quá dài sẽ tự động co lại",
  },
  {
    title: "Điện Thoại",
    render: (_text, record) => [
      <Fragment>{record.customer?.phone ?? ""}</Fragment>,
    ],
    copyable: true,
    key: "phone",
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
          message.success("Thành công!");
          return true;
        }}
      ></ModalForm>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: "copy", name: "Edit" },
          { key: "delete", name: "Delete" },
        ]}
      />,
    ],
  },
];

const CustomerList: FunctionComponent<CustomerListProps> = () => {
  const { token } = useToken();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const userToken = useAppSelector(userData)?.currentUser as tokenType;
  const actionRef = useRef<ActionType>();

  const axiosClient = createAxios(userToken, dispatch, loginSuccess);
  const customerList = useAppSelector(customersSelector)?.users;
  console.log(customerList);

  // const deviceCount = devicesData.devicesCount;
  return (
    <div className="w-full py-4 px-12">
      <div className="p-4" style={{ color: token.colorText }}>
        <ProTable<customerType>
          columns={columns}
          cardBordered
          editable={{
            type: "multiple",
          }}
          actionRef={actionRef}
          loading={loading}
          request={async () => {
            setLoading(true);
            await waitTime(1000);
            const res: {
              customers: Array<customerType>;
              customersCount: number;
            } = await customersService.getAllCustomers(axiosClient);
            setLoading(false);
            console.log(res);
            return {
              data: res.customers.map((cus) => {
                return {
                  ...cus,
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
          rowKey="id"
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
          headerTitle="Danh sách khách hàng"
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
      </div>
    </div>
  );
};

export default CustomerList;
