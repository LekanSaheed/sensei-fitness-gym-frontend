import IUser from "@/types/User";
import { api } from "../api";
import { ResponseType } from "@/types";

const userApi = api.injectEndpoints({
  endpoints(build) {
    return {
      updateProfile: build.mutation<
        ResponseType,
        Pick<IUser, "firstname" | "lastname" | "username">
      >({
        query: (payload) => ({
          url: "/user",
          method: "put",
          body: payload,
        }),
      }),

      updatePassword: build.mutation<
        ResponseType,
        { currentPassword: string; newPassword: string }
      >({
        query: (payload) => ({
          url: "/user/update-password",
          method: "post",
          body: payload,
        }),
      }),
    };
  },
});

export const { useUpdateProfileMutation, useUpdatePasswordMutation } = userApi;
