/* eslint-disable @typescript-eslint/no-unused-vars */
import { theme } from "antd";
import {
  Fragment,
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { userData } from "@/redux/selector";
import { createAxios, tokenType } from "@/services/createInstance";
import { loginSuccess } from "@/redux/slices/authSlice";
import { waitTime } from "@/constants";
import { customerType } from "@/type/customers";
import customersService from "@/services/customersService";
import { DefaultLayoutContext } from "@/layouts/DefaultLayout";
import { routes } from "@/routes";
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
    title: "Mã Khách Hàng",
    dataIndex: "customer_id",
    key: "customer_id",
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
      <Fragment key={record.customer_id + "-name"}>
        {record.last_name + " " + record.first_name}
      </Fragment>,
    ],
    key: "fullName",
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
    render: (_text, record) => (
      <Fragment key={record.customer_id + "-phone"}>
        {record.phone ?? ""}
      </Fragment>
    ),
    copyable: true,
    search: false,
    key: "phone",
    ellipsis: true,
    tooltip: "Tiêu đề quá dài sẽ tự động co lại",
  },
];

const CustomerList: FunctionComponent<CustomerListProps> = () => {
  const { token } = useToken();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const userToken = useAppSelector(userData)?.currentUser as tokenType;
  const actionRef = useRef<ActionType>();

  const axiosClient = createAxios(userToken, dispatch, loginSuccess);
  const { setBreadcrumbst } = useContext(DefaultLayoutContext);
  useEffect(() => {
    setBreadcrumbst([
      {
        content: "CustomerList",
        href: routes.customerList,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="w-full py-4 px-12">
      <div className="p-4" style={{ color: token.colorText }}>
        <ProTable<customerType>
          columns={columns}
          cardBordered
          actionRef={actionRef}
          loading={loading}
          request={async (params) => {
            setLoading(true);
            await waitTime(1000);
            const res: {
              customers: Array<customerType>;
              customersCount: number;
            } = await customersService.getAllCustomers(axiosClient);
            setLoading(false);
            console.log(params);

            return {
              data: res.customers
                .filter((cus) => {
                  return params.email
                    ? cus.email.includes(params.email.trim())
                    : true && params.customer_id
                    ? cus.customer_id.includes(params.customer_id.trim())
                    : true && true;
                })
                .map((cus) => {
                  console.log(cus);
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
          rowKey="customer_id"
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
        />
      </div>
    </div>
  );
};

export default CustomerList;
