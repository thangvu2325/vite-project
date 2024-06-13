import DeviceListWaiting from "@/pages/Device/DeviceList/DeviceListWaiting";
import { ComponentType, Fragment, FunctionComponent, lazy } from "react";
// Pages
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ErrorPage = lazy(() => import("@/pages/Error"));
const RegisterPage = lazy(() => import("@/pages/Register"));
const LoginPage = lazy(() => import("@/pages/Login"));
const SettingsPage = lazy(() => import("@/pages/Settings"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const DevicePage = lazy(() => import("@/pages/Device/DeviceList/DevicePage"));
const DeviceListPage = lazy(() => import("@/pages/Device/DeviceList"));
const CustomerListPage = lazy(() => import("@/pages/Customer/CustomerList"));
const ReportListPage = lazy(() => import("@/pages/ReportList"));
const ChatListPage = lazy(() => import("@/pages/ChatList"));
const ChatPage = lazy(() => import("@/pages/ChatList/Chat"));
const ReportPage = lazy(() => import("@/pages/ReportList/ReportPage"));

export type RouteType = {
  path: string;
  component: ComponentType;
  layout?: FunctionComponent<{ children: React.ReactNode }>;
};
export const routes = {
  Dashboard: "/dashboard",
  login: "/login",
  register: "/register",
  settings: "/settings",
  profile: "/profile",
  deviceList: "/device/device-list",
  deviceListWaiting: "/device/device-list/waiting",
  device: "/device/device-list/:deviceId",
  customerList: "/customer/customer-list",
  supportCenter: "/support",
  reportList: "/support/report",
  chatList: "/support/chat",
  chatPage: "/support/chat/:chatId",
  reportPage: "/support/report/:tickedId",
};
const publicRoutes: Array<RouteType> = [
  {
    path: routes.login,
    component: LoginPage,
    layout: AuthLayout,
  },
  { path: routes.register, component: RegisterPage, layout: AuthLayout },
];
const privateRoutes: Array<RouteType> = [
  { path: routes.Dashboard, component: Dashboard },
  { path: routes.settings, component: SettingsPage },
  { path: routes.profile, component: ProfilePage },
  { path: routes.device, component: DevicePage },
  { path: routes.deviceList, component: DeviceListPage },
  { path: routes.deviceListWaiting, component: DeviceListWaiting },
  { path: routes.customerList, component: CustomerListPage },
  { path: routes.reportList, component: ReportListPage },
  { path: routes.chatList, component: ChatListPage },
  { path: routes.reportPage, component: ReportPage },
  { path: routes.chatPage, component: ChatPage },
  { path: "*", component: ErrorPage, layout: Fragment },
];

export { publicRoutes, privateRoutes };
