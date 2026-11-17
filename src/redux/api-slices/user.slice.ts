import IUser from "@/types/User";
import { api } from "../api";
import { ResponseType } from "@/types";
import { ActivityZone } from "@/types/ActivityZone";

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

      getMyCheckInCode: build.query<ResponseType<{ code: string }>, null>({
        query: () => "/user/check-in-code",
      }),

      getMyActivityStatus: build.query<
        ResponseType<{
          zone: ActivityZone;
          zoneEnteredAt: string | null;
          lastCheckInAt: string | null;
          daysSinceLastCheckIn: number | null;
        }>,
        null
      >({
        query: () => "/user/activity-status",
        // refreshed whenever the member checks in
        providesTags: ["has-checked-in"],
      }),

      updateNotificationPreferences: build.mutation<
        ResponseType<{ activityReminders: boolean }>,
        { activityReminders: boolean }
      >({
        query: (body) => ({
          url: "/user/notification-preferences",
          method: "put",
          body,
        }),
      }),

      updateProfilePicture: build.mutation<ResponseType, FormData>({
        query: (body) => ({
          url: "/user/upload-dp",
          method: "post",
          body: body,
        }),
      }),
    };
  },
});

export const {
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useUpdateProfilePictureMutation,
  useUpdateNotificationPreferencesMutation,
  useGetMyActivityStatusQuery,
  useGetMyCheckInCodeQuery,
} = userApi;
