import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { FC, Fragment, FunctionComponent, Suspense, lazy } from "react";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import viVN from "antd/es/locale/vi_VN"; // Import ngôn ngữ tiếng Việt từ Ant Design
import GlobalStyle from "./components/GlobalStyle";
import { privateRoutes, publicRoutes } from "./routes";
import { ConfigProvider } from "antd";
import LoadingScreen from "./components/LoadingScreen";
import ProtectedRoute from "./routes/ProtectedRoute";
import { PersistGate } from "redux-persist/integration/react";
const DefaultLayout = lazy(() => import("@/layouts/DefaultLayout"));
const App: FC = () => {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>
        <GlobalStyle>
          <ConfigProvider
            locale={viVN}
            theme={{
              token: {
                fontSizeHeading1: 18,
                fontSizeHeading2: 16,
                fontSizeHeading3: 14,
                fontSizeHeading4: 12,
                fontSizeHeading5: 10,
                colorBgBase: "white",
                colorPrimary: "#1677ff",
                colorText: "black",
              },
              components: {
                Layout: {
                  headerBg: "#fff",
                },
                Divider: {
                  textPaddingInline: 0,
                },
              },
            }}
          >
            <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
              <Router>
                <div className="App">
                  <Routes>
                    {publicRoutes.map((route, index) => {
                      const Page = route.component;
                      let Layout: FunctionComponent<{
                        children: React.ReactNode;
                      }> = DefaultLayout;
                      if (route.layout) {
                        Layout = route.layout;
                      } else if (route.layout === null) {
                        Layout = Fragment;
                      }
                      return (
                        <Route
                          key={index}
                          path={route.path}
                          element={
                            <Suspense
                              fallback={
                                <LoadingScreen content="Đang tải vui lòng chờ"></LoadingScreen>
                              }
                            >
                              <Layout>
                                <Suspense
                                  fallback={
                                    <LoadingScreen content="Đang tải vui lòng chờ"></LoadingScreen>
                                  }
                                >
                                  <Page />
                                </Suspense>
                              </Layout>
                            </Suspense>
                          }
                        />
                      );
                    })}
                    {privateRoutes.map((route, index) => {
                      const Page = route.component;
                      let Layout: FunctionComponent<{
                        children: React.ReactNode;
                      }> = DefaultLayout;
                      if (route.layout) {
                        Layout = route.layout;
                      } else if (route.layout === null) {
                        Layout = Fragment;
                      }
                      return (
                        <Route
                          key={index}
                          path={route.path}
                          element={
                            <Suspense
                              fallback={
                                <LoadingScreen content="Đang tải vui lòng chờ"></LoadingScreen>
                              }
                            >
                              <Layout>
                                <ProtectedRoute>
                                  <Page />
                                </ProtectedRoute>
                              </Layout>
                            </Suspense>
                          }
                        />
                      );
                    })}
                  </Routes>
                </div>
              </Router>
            </ThemeProvider>
          </ConfigProvider>
        </GlobalStyle>
      </Provider>
    </PersistGate>
  );
};
export default App;
