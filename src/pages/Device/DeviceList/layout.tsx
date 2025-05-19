import { theme, Modal } from "antd";
import { FunctionComponent, ReactNode, useRef } from "react";
import DeviceQrExportPdf from "./DeviceQrExportPdf";
import ReactToPrint from "react-to-print";

const { useToken } = theme;

interface DeviceListLayoutProps {
  children: ReactNode;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  deviceQRCode: Array<{
    secretKey: string;
    deviceId: string;
    type: "owner" | "user";
  }>;
}

const DeviceListLayout: FunctionComponent<DeviceListLayoutProps> = ({
  children,
  setIsModalOpen,
  isModalOpen,
  deviceQRCode,
}) => {
  const { token } = useToken();
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  console.log(deviceQRCode);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const componentRef = useRef<any>(null);
  const handlePrint = () => {
    if (componentRef.current) {
      // Trigger the print action
      componentRef.current.onPrint();
    }
  };
  return (
    <div className="w-full py-4 px-12">
      <div className="p-4" style={{ color: token.colorText }}>
        {children}
        <Modal
          title={
            <div className="flex justify-between items-center mr-4">
              <h3 className="text-xl font-bold italic">
                QR Code tạo thành công!
              </h3>
              <ReactToPrint
                trigger={() => (
                  <button
                    onClick={handlePrint}
                    className="w-24 h-10 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-[#7dd3fc] hover:cursor-pointer"
                  >
                    Print
                  </button>
                )}
                content={() => componentRef.current}
              />
            </div>
          }
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          width={"auto"}
        >
          <DeviceQrExportPdf
            ref={componentRef}
            formData={deviceQRCode}
          ></DeviceQrExportPdf>
        </Modal>
      </div>
    </div>
  );
};

export default DeviceListLayout;
