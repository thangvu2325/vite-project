/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { config } from "@/config";
import useMessage from "@/hooks/useMessage";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  logOutFailed,
  logOutStart,
  logOutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "@/redux/slices/authSlice";
import { AppDispatch } from "@/redux/store";
import { loginType, registerType } from "@/type/auth";
import { Dispatch } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from "axios";
import { NavigateFunction } from "react-router";
const { messageConnection } = useMessage();
const register = async (data: registerType, dispatch: Dispatch) => {
  try {
    dispatch(registerStart());
    const res = await axios.post(
      config.baseUrl + "/auth/manager/register",
      data
    );
    dispatch(registerSuccess());
    return res.data;
  } catch (error) {
    dispatch(registerFailed());
    throw error;
  }
};
const checkEmailValid = async (email: string) => {
  try {
    const res = await axios.post(`${config.baseUrl}/auth/checkemailexist`, {
      email,
    });
    return res.data;
  } catch (error: any) {
    console.log(error.message);
  }
};
const checkSecretKey = async (secretKey: string) => {
  try {
    const res = await axios.post(
      `${config.baseUrl}/auth/manager/checksecretKey`,
      {
        secretKey,
      }
    );
    return res.data;
  } catch (error: any) {
    console.log(error.message);
  }
};
const checkPhoneValid = async (phone: string) => {
  try {
    const res = await axios.post(`${config.baseUrl}/auth/checksmsexist`, {
      phone,
    });
    return res.data;
  } catch (error: any) {
    console.log(error.message);
  }
};
const login = async (
  data: loginType,
  dispatch: Dispatch,
  navigate: NavigateFunction
) => {
  try {
    dispatch(loginStart());
    const res = await axios.post(config.baseUrl + "/auth/manager/login", data);
    dispatch(loginSuccess(res.data));
    await messageConnection(
      res?.data?.backendTokens.accessToken,
      res?.data?.user.id
    );
    navigate("/dashboard");
    return res.data;
  } catch (error: any) {
    dispatch(loginFailed(error.response.data));
    throw error;
  }
};
export const logOut = async (
  dispatch: AppDispatch,
  id: string,
  navigate: NavigateFunction,
  axiosClient: AxiosInstance
) => {
  dispatch(logOutStart());
  try {
    await axiosClient.post("/auth/logout", { id: id });
    dispatch(logOutSuccess());
    navigate("/login");
  } catch (err) {
    dispatch(logOutFailed());
  }
};

const authService = {
  register,
  login,
  logOut,
  checkEmailValid,
  checkPhoneValid,
  checkSecretKey,
};

export default authService;
