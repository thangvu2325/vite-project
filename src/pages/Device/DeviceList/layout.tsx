import { Button, theme, Modal, QRCode } from "antd";
import { FunctionComponent, ReactNode } from "react";

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
// const downloadQRCode = () => {
//   const canvas = document
//     .getElementById("myqrcode")
//     ?.querySelector<HTMLDivElement>("canvas");
//   if (canvas) {
//     const url = can;
//     const a = document.createElement("a");
//     a.download = "QRCode.png";
//     a.href = url;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   }
// };

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
  return (
    <div className="w-full py-4 px-12">
      <div className="p-4" style={{ color: token.colorText }}>
        {children}
        <Modal
          title={
            <h3 className="text-xl font-bold italic">
              QR Code tạo thành công!
            </h3>
          }
          width={600}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div className="flex justify-center items-center gap-4 w-[560px] max-w-[560px] flex-wrap mt-8">
            {deviceQRCode.length
              ? deviceQRCode.map((device) => (
                  <div
                    key={device.deviceId}
                    className="flex flex-col justify-center items-center mb-6"
                    id="myqrcode"
                  >
                    <div
                      className="flex flex-col items-center gap-4 p-4"
                      id="downloadQR"
                    >
                      <h3 className="text-lg font-bold">
                        Mã Thiết Bị: {device.deviceId}
                      </h3>
                      <QRCode
                        value={JSON.stringify(device)}
                        bgColor="#fff"
                        style={{ marginBottom: 16 }}
                      />
                    </div>
                    <Button type="primary" onClick={() => {}}>
                      Tải Mã QR Code
                    </Button>
                  </div>
                ))
              : ""}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DeviceListLayout;
