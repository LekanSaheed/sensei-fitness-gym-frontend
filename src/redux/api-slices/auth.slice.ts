import type { ResponseType } from "@/types";
import { api } from "../api";

interface ICountry {
  name: {
    common: string;
  };
  flags: {
    svg: string;
    png: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
}

const authSlice = api.injectEndpoints({
  endpoints(build) {
    return {
      getCountries: build.query<ICountry[], null>({
        query: () => "https://restcountries.com/v3.1/all?fields=name,flags,idd",
      }),
      login: build.mutation<
        ResponseType<string>,
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
          phoneNumber: string;
        }
      >({
        query: (payload) => ({
          url: "/auth/signup",
          body: payload,
          method: "post",
        }),
      }),
      getInvitation: build.query<ResponseType<{ email: string }>, string>({
        query: (id) => `/auth/get-invitation?id=${id}`,
      }),
      createAdminAccount: build.mutation<
        ResponseType<{ token: string }>,
        {
          firstname: string;
          lastname: string;
          invitation_id: string;
          password: string;
        }
      >({
        query: (payload) => ({
          url: "/auth/admin-signup",
          body: payload,
          method: "post",
        }),
      }),
      forgotPassword: build.mutation<ResponseType, { email: string }>({
        query: (payload) => ({
          url: "/auth/forgot-pwd",
          body: payload,
          method: "post",
        }),
      }),
      getResetToken: build.query<ResponseType<{ email: string }>, string>({
        query: (id) => `/auth/get-reset-session?id=${id}`,
      }),
      resetPassword: build.mutation<
        ResponseType,
        { password: string; token: string }
      >({
        query: (payload) => ({
          url: "/auth/reset-pwd",
          method: "post",
          body: payload,
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
  useGetInvitationQuery,
  useCreateAdminAccountMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetResetTokenQuery,
  useGetCountriesQuery,
} = authSlice;
