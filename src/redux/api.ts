import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const api = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: (headers) => {
      const access_token = Cookies.get("access_token");

      if (access_token) {
        headers.set("Authorization", `Bearer ${access_token}`);
      }
    },
  }),
  endpoints: () => ({}),
  tagTypes: [
    "has-checked-in",
    "members",
    "admin-check-ins",
    "plans",
    "members-sub",
    "member",
    "payment-logs",
  ],
});
