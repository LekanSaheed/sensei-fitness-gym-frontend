import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { openNotification: boolean; navigation: boolean } = {
  openNotification: false,
  navigation: false,
};

export const appSlice = createSlice({
  initialState,
  name: "app",
  reducers: {
    setOpenNotification: (state, action: PayloadAction<boolean>) => {
      state.openNotification = action.payload;
    },

    openNavigation: (state, action: PayloadAction<boolean>) => {
      state.navigation = action.payload;
    },
  },
});
