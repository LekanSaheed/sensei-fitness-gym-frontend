import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { openNotification: boolean } = {
  openNotification: false,
};

export const appSlice = createSlice({
  initialState,
  name: "app",
  reducers: {
    setOpenNotification: (state, action: PayloadAction<boolean>) => {
      state.openNotification = action.payload;
    },
  },
});
