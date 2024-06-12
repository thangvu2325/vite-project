/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { AppDispatch } from "../redux/store";
import { config } from "@/config";
import { userType } from "@/type";
export type tokenType = {
  user: userType;
  backendTokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
};

export async function refreshToken(
  token: tokenType,
  dispatch: AppDispatch,
  stateSuccess: any
) {
  try {
    const res = await axios.post(
      `${config.baseUrl}/auth/refresh`,
      { ...token.user },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: "Refresh " + token.backendTokens.refreshToken,
        },
      }
    );

    const response = await res.data;
    dispatch(stateSuccess(response));

    return response;
  } catch (error) {
    dispatch(stateSuccess({}));
    console.log(error);
    return null;
  }
}
export const createAxios = (
  token: tokenType,
  dispatch: AppDispatch,
  stateSuccess: any
) => {
  // Create a new instance of Axios with a custom configuration.
  const newInstance = axios.create({
    baseURL: config.baseUrl,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Add a request interceptor to handle token refresh before each request.
  newInstance.interceptors.request.use(
    async (config) => {
      try {
        console.log(new Date().getTime(), token.backendTokens.expiresIn);
        if (new Date().getTime() > token.backendTokens.expiresIn) {
          console.log("Token is expired. Refreshing...");
          const tokenData = await refreshToken(token, dispatch, stateSuccess);
          if (tokenData === null) {
            return config;
          }
          console.log("Token refreshed:", tokenData);
          config.headers["Authorization"] =
            "Bearer " + tokenData.backendTokens.accessToken;
        } else {
          console.log("Token is still valid.");
          config.headers["Authorization"] =
            "Bearer " + token.backendTokens.accessToken;
        }
        return config;
      } catch (error) {
        console.error("Interceptor error:", error);
        return Promise.reject(error);
      }
    },
    (err) => {
      console.error("Interceptor request error:", err);
      return Promise.reject(err);
    }
  );

  // Return the configured Axios instance.
  return newInstance;
};
