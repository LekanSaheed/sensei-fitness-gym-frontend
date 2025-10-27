"use client";

import store from "@/redux";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";

const ReduxProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <Toaster containerStyle={{ zIndex: 10000000 }} />
      {children}
    </Provider>
  );
};

export default ReduxProvider;
