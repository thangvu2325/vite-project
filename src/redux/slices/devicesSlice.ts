import devicesService from "@/services/deviceService";
import { deviceType } from "@/type/device";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";

// Define a type for the slice state
interface DevicesState {
  data: {
    devices: deviceType[];
    devicesCount: number;
  };
  loading: "idle" | "pending" | "success" | "error";
  error: string;
}

// Define the initial state using that type
const initialState: DevicesState = {} as DevicesState;
export const fetchDataDevices = createAsyncThunk(
  "devices/fetchData",
  // if you type your function argument here
  async (axiosClient: AxiosInstance) => {
    try {
      const data = await devicesService.getAllDevices(axiosClient);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const deviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataDevices.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDataDevices.fulfilled, (state, action) => {
        state.loading = "success";
        state.data = action.payload;
      })
      .addCase(fetchDataDevices.rejected, (state) => {
        state.loading = "error";
      });
  },
});

// export const {  } = deviceSlice.actions;

export default deviceSlice.reducer;
