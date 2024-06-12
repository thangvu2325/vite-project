import customersService from "@/services/customersService";
import { customerType } from "@/type/customers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosInstance } from "axios";

// Define a type for the slice state
interface CustomersState {
  data: {
    users: customerType[];
    usersCount: number;
  };
  loading: "idle" | "pending" | "success" | "error";
  error: string;
}

// Define the initial state using that type
const initialState: CustomersState = {} as CustomersState;
export const fetchDataCustomers = createAsyncThunk(
  "customers/fetchData",
  // if you type your function argument here
  async (axiosClient: AxiosInstance) => {
    try {
      const data = await customersService.getAllCustomers(axiosClient);
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDataCustomers.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchDataCustomers.fulfilled, (state, action) => {
        state.loading = "success";
        state.data = action.payload;
      })
      .addCase(fetchDataCustomers.rejected, (state) => {
        state.loading = "error";
      });
  },
});

// export const {  } = customersSlice.actions;

export default customersSlice.reducer;
