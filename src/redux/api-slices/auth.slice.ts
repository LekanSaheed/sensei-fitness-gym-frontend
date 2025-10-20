import type { ResponseType } from "@/types";
import { api } from "../api";

const authSlice = api.injectEndpoints({
  endpoints(build) {
    return {
      login: build.mutation<
        ResponseType<{ token: string }>,
        { username: string; password: string }
      >({
        query: (payload) => ({
          url: `/auth/login`,
          method: "post",
          body: payload,
        }),
      }),
      createSession: build.mutation<
        ResponseType<{ url: string } | null>,
        string
      >({
        query: (email) => ({
          url: `/auth/create-session`,
          method: "post",
          body: { email },
        }),
      }),
      getSession: build.query<ResponseType<{ email: string }>, string>({
        query: (id) => `/auth/get-session?id=${id}`,
      }),
      checkUsername: build.query<
        ResponseType<{ isAvailable: boolean }>,
        string
      >({
        query: (username) => `/auth/check-username?username=${username}`,
        keepUnusedDataFor: 0,
      }),
      createAccount: build.mutation<
        ResponseType<{ token: string }>,
        {
          firstname: string;
          lastname: string;
          password: string;
          username: string;
          session_id: string;
        }
      >({
        query: (payload) => ({
          url: "/auth/signup",
          body: payload,
          method: "post",
        }),
      }),
    };
  },
});

export const {
  useCreateSessionMutation,
  useGetSessionQuery,
  useCheckUsernameQuery,
  useCreateAccountMutation,
  useLoginMutation,
} = authSlice;
