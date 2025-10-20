import {
  Action,
  combineReducers,
  configureStore,
} from "@reduxjs/toolkit/react";
import { authSlice } from "./auth.slice";
import { api } from "./api";

import { appSlice } from "./app.slice";

const combinedReducer = combineReducers({
  [authSlice.name]: authSlice.reducer,
  [appSlice.name]: appSlice.reducer,
  [api.reducerPath]: api.reducer,
  // ... more reducers
});
const rootReducer = (state: any, action: Action) => {
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) => getDefault().concat(api.middleware),
});

export const actions = {
  [authSlice.name]: authSlice.actions,
  [appSlice.name]: appSlice.actions,
};

export type RootState = ReturnType<typeof rootReducer>;

export default store;
