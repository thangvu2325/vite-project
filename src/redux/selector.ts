import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const authSelector = (state: RootState) => state.persistedReducer.auth;
export const userData = createSelector(authSelector, (authData) => {
  if (authData.login.currentUser?.backendTokens?.accessToken) {
    return {
      isLogin: true,
      currentUser: authData.login.currentUser,
    };
  }
  return {
    isLogin: false,
    currentUser: null,
  };
});
export const devicesSelector = (state: RootState) => state.devices.data;
export const customersSelector = (state: RootState) => state.customer.data;
