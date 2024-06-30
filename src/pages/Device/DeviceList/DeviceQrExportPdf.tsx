/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component, Fragment } from "react";
import { QRCode } from "antd";
import { cn } from "@/lib/utils";

type DeviceQrExportPdfProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: React.MutableRefObject<any>;
  className?: string;
  formData: Array<{
    secretKey: string;
    deviceId: string;
    type: "owner" | "user";
  }>;
};
export default class DeviceQrExportPdf extends Component<DeviceQrExportPdfProps> {
  formData = this.props.formData;
  render() {
    return (
      <div className="grid grid-cols-4 flex-wrap mt-8 px-4 ">
        {this.formData.length
          ? this.formData.map((device, index) => {
              return (
                <Fragment key={device.deviceId}>
                  <div
                    className={cn(
                      " col-span-1 flex flex-col items-center justify-center border-2 border-[#ccc] border-dotted text-center",
                      index !== 0 && index % 16 === 0
                        ? "break-before-page mt-4"
                        : ""
                    )}
                  >
                    <h3 className="text-lg font-bold">
                      Mã Thiết Bị: {device.deviceId}
                    </h3>
                    <QRCode
                      value={JSON.stringify(device)}
                      bgColor="#fff"
                      style={{ marginBottom: 16 }}
                      icon="https://volunteer.hcmute.edu.vn/uploads/images/hcmute.svg"
                      iconSize={48}
                    />
                  </div>
                </Fragment>
              );
            })
          : ""}
      </div>
    );
  }
}
