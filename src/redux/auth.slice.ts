import type IUser from "@/types/User";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface InitialState {
  user: IUser | null;
  authenticated: boolean;
  loading: boolean;
}

const initialState: InitialState = {
  user: null,
  authenticated: false,
  loading: true,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.authenticated = true;
      state.loading = false;
    },

    saveToken: (state, action: PayloadAction<string>) => {
      Cookies.set("access_token", action.payload);
    },

    stopLoading: (state, action: PayloadAction<null>) => {
      state.loading = false;
    },

    logout: (state, action) => {
      state.user = null;
      state.authenticated = false;
      state.loading = true;
      Cookies.remove("access_token");
    },
  },
});
