export type deviceType = {
  id: string;
  customer_id: string;
  deviceId: string;
  fullname: string;
  email: string;
  roomHistoryLoggerId: string;
  active: boolean;
  phone: string;
  secretKey: string;
  roomId: string;
  battery: {
    voltage: number;
  };
  sim: {
    imsi: string;
  };
  sensors: {
    AlarmSatus: boolean;
    whiteSmokeVal: number;
    blackSmokeVal: number;
    Temperature: number;
    Humidity: number;
  };
  signal: {
    Operator: string;
    band: string;
    EARFCN: string;
    PCI: string;
    connectionStatus: string;
    ipAddress: string;
    RSRP: string;
    RSSI: string;
    RSRQ: string;
    T3324: string;
    T3412: string;
    tac: string;
  };
  createdAt: Date;
  updatedAt: Date;
};
export type historyType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  device: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    deviceId: string;
    deviceName: string;
    secretKey: string;
    AlarmReport: number;
  };
  sensors: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    AlarmSatus: boolean;
    SmokeValue: number;
    Temperature: number;
    Humidity: number;
  };
  battery: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    voltage: number;
  };
  signal: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    Operator: string;
    band: number;
    EARFCN: number;
    PCI: number;
    connectionStatus: number;
    ipAddress: string;
    RSRP: number;
    RSSI: number;
    RSRQ: number;
    T3324: number;
    T3412: number;
    tac: string;
  };
  sim: {
    id: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    imsi: string;
  };
};
export type historyLoggerType = {
  historyId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  logger: string;
};
