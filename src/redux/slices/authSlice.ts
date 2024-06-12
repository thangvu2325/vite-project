import { userType } from "@/type";
import { createSlice } from "@reduxjs/toolkit";
export type currentUserType = {
  user: userType;
  backendTokens: {
    accessToken: string;
    refreshToken: string;
  };
};
interface AuthState {
  login: {
    currentUser: currentUserType;
    isFetching: boolean;
    errorMessage: string | null;
    successMessage: string | null;
    error: boolean;
  };
  register: {
    isFetching: boolean;
    error: boolean;
    success: boolean;
  };
  logout: {
    isFetching: boolean;
    error: boolean;
    success: boolean;
  };
}
const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentUser: {} as currentUserType,
      isFetching: false,
      errorMessage: null,
      successMessage: null,
      error: false,
    },
    register: {
      isFetching: false,
      error: false,
      success: false,
    },
    logout: {
      isFetching: false,
      error: false,
      success: false,
    },
  } as AuthState,
  reducers: {
    loginStart: (state) => {
      state.login.isFetching = true;
    },
    loginSuccess: (state, action) => {
      state.login.isFetching = false;
      state.login.currentUser = action.payload;
      state.login.errorMessage = null;
      state.login.successMessage = "Đăng nhập thành công!";
      state.login.error = false;
    },
    loginFailed: (state, action) => {
      state.login.isFetching = false;
      state.login.errorMessage = action.payload;
      state.login.successMessage = null;
      state.login.error = true;
    },
    registerStart: (state) => {
      state.register.isFetching = true;
    },
    registerSuccess: (state) => {
      state.register.isFetching = false;
      state.register.error = false;
      state.register.success = true;
    },
    registerFailed: (state) => {
      state.register.isFetching = false;
      state.register.error = true;
      state.register.success = false;
    },
    logOutSuccess: (state) => {
      state.logout.isFetching = false;
      state.login.currentUser = {} as currentUserType;
      state.logout.error = false;
    },
    logOutFailed: (state) => {
      state.logout.isFetching = false;
      state.logout.error = true;
    },
    logOutStart: (state) => {
      state.logout.isFetching = true;
    },
  },
});

export const {
  loginStart,
  loginFailed,
  loginSuccess,
  registerStart,
  registerSuccess,
  registerFailed,
  logOutStart,
  logOutSuccess,
  logOutFailed,
} = authSlice.actions;

export default authSlice;
