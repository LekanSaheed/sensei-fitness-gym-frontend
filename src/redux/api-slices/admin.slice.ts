import {
  ICheckIn,
  PaginatedResponse,
  PaginationQuery,
  ResponseType,
} from "@/types";
import { api } from "../api";

export interface RevenueChart {
  view: "week" | "month" | "year";
  year: number;
  month: number | null;
  start: string;
  end: string;
  unit: "day" | "month";
  totalRevenue: number;
  transactions: number;
  /** Revenue for the period before (last week / month / year) */
  previousTotal: number;
  data: { label: string; total: number; count: number }[];
  /** Years with payments, newest first */
  years: number[];
}
import { Leaderboard, LeaderboardPeriod } from "@/types/Leaderboard";

export interface CheckInLocationSettings {
  enabled: boolean;
  latitude: number | null;
  longitude: number | null;
  radiusMeters: number;
  maxAccuracyMeters: number;
  updatedAt?: string;
}

import IUser from "@/types/User";
import { formatQuery } from "@/utils";
import { ISubscription, ISubscriptionPlan } from "./subscription.slice";
import { EditablePlanFields } from "@/app/admin/plans/page";
import PaymentLog from "@/types/PaymentLog";
import { Permission } from "@/hooks/usePermissions";
import {
  ActivityZoneSettings,
  ActivityZoneSummary,
  InactivityFeedbackSummary,
} from "@/types/ActivityZone";

export type UserWithSub = IUser & {
  latestSubscription:
    | (Pick<
        ISubscription,
        | "status"
        | "startDate"
        | "endDate"
        | "includesTrainer"
        | "planNameSnapshot"
        | "paymentMode"
        | "planDurationInDaysSnapshot"
      > & {
        activatedBy: string | { firstname: string; lastname: string } | null;
      })
    | null;
};

export interface QrCheckInPreview {
  eligible: boolean;
  reason?: string;
  member: {
    _id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    profile_picture: string;
    zone?: string;
  };
  subscription: {
    _id: string;
    planName: string;
    planType: string;
    endDate: string;
    includesTrainer: boolean;
    checkInsPerWeek?: number;
    totalCheckIns?: number;
    checkInsThisWeek?: number;
    totalOnPlan?: number;
    allowedDays?: string[];
  } | null;
  checkedInToday: boolean;
  lastCheckInAt: string | null;
}

export interface AdminNotificationSettings {
  recipients: string[];
  events: Record<string, { enabled: boolean }>;
  availableEvents: { key: string; label: string; description: string }[];
  updatedAt?: string;
}

export interface AdminInvitation {
  email: string;
  permissions: Permission[];
  status: "pending" | "completed";
  createdAt: string;
  _id: string;
}
const adminApi = api.injectEndpoints({
  endpoints(build) {
    return {
      getMembers: build.query<
        PaginatedResponse<UserWithSub[]>,
        PaginationQuery
      >({
        query: (query) => `/admin/members?${formatQuery(query)}`,
        providesTags: ["members"],
      }),
      getMemberById: build.query<
        ResponseType<UserWithSub>,
        { id: string; includeSub?: boolean }
      >({
        query: ({ id, includeSub }) =>
          `/admin/members/${id}?includeSub=${includeSub || false}`,
        providesTags: ["member"],
      }),
      getCheckIns: build.query<
        PaginatedResponse<ICheckIn[]>,
        PaginationQuery & Partial<{ checkInType: string }>
      >({
        query: (query) => `/admin/check-ins?${formatQuery(query)}`,
        providesTags: ["admin-check-ins"],
      }),
      adminGetCheckInAnalytics: build.query<
        ResponseType<{
          total: number;
          today: number;
          yesterday: number;
          thisWeek: number;
          lastWeek: number;
          thisMonth: number;
          lastMonth: number;
        }>,
        null
      >({
        query: () => "/admin/check-ins/analytics",
        providesTags: ["admin-check-ins"],
      }),
      getMembersAnalytics: build.query<
        ResponseType<{
          totalMembers: number;
          activeMembers: number;
          registeredThisMonth: number;
          membersWithoutActiveSub: number;
          totalMembersWithTrainers: number;
          totalMembersWithOutTrainers: number;
        }>,
        null
      >({
        query: () => "/admin/members/analytics",
      }),
      getDashboardRevenueAnalytics: build.query<
        ResponseType<{ total: number }>,
        string
      >({
        query: (range) => `/admin/dashboard/revenue-analytics?range=${range}`,
      }),
      checkUserIn: build.mutation<ResponseType, { userId: string }>({
        query: (payload) => ({
          method: "post",
          url: "/admin/check-ins",
          body: payload,
        }),
        invalidatesTags: ["admin-check-ins", "leaderboard", "activity-zones", "member", "members"],
      }),
      adminGetPlans: build.query<ResponseType<ISubscriptionPlan[]>, undefined>({
        query: () => "/admin/plans",
        providesTags: ["plans"],
      }),
      updatePlan: build.mutation<
        ResponseType,
        { id: string; payload: Partial<EditablePlanFields> }
      >({
        query: ({ id, payload }) => ({
          url: `/admin/plans/${id}`,
          method: "put",
          body: payload,
        }),
        invalidatesTags: ["plans"],
      }),
      createPlan: build.mutation<
        ResponseType,
        Partial<EditablePlanFields> & { isActive: boolean }
      >({
        query: (payload) => ({
          url: "/admin/subscriptions/create",
          body: payload,
          method: "post",
        }),
        invalidatesTags: ["plans"],
      }),
      getPaymentsLogs: build.query<
        PaginatedResponse<PaymentLog[]>,
        PaginationQuery
      >({
        query: (query) => `/admin/payments?${formatQuery(query)}`,
      }),
      getMembersSubscriptions: build.query<
        PaginatedResponse<(ISubscription & { user: IUser })[]>,
        PaginationQuery
      >({
        query: (query) => `/admin/subscriptions?${formatQuery(query)}`,
        providesTags: ["members-sub"],
      }),
      activateMemberSub: build.mutation<
        ResponseType,
        { userId: string; planId: string; includesTrainer: boolean }
      >({
        query: (payload) => ({
          url: `/admin/subscriptions/activate-member`,
          body: payload,
          method: "post",
        }),
        invalidatesTags: ["members-sub", "payment-logs", "members", "member"],
      }),
      getAdmins: build.query<
        ResponseType<IUser[]>,
        Partial<{ search: string }>
      >({
        query: (query) => `/admin/admins?${formatQuery(query)}`,
        providesTags: ["admins"],
      }),
      getPermissions: build.query<
        ResponseType<{ name: Permission; description: string }[]>,
        null
      >({
        query: () => `/admin/permissions`,
      }),
      inviteAdmin: build.mutation<
        ResponseType,
        { email: string; permissions: Permission[] }
      >({
        query: (payload) => ({
          url: "/admin/invite",
          method: "post",
          body: payload,
        }),
        invalidatesTags: ["admin-invites"],
      }),
      getInvitations: build.query<ResponseType<AdminInvitation[]>, null>({
        query: () => "/admin/invite",
        providesTags: ["admin-invites"],
      }),
      resendInviteNotification: build.mutation<ResponseType, { id: string }>({
        query: (payload) => ({
          url: "/admin/invite/resend",
          body: payload,
          method: "post",
        }),
      }),
      updateAdmin: build.mutation<
        ResponseType,
        { id: string; payload: { permissions: Permission[] } }
      >({
        query: ({ id, payload }) => ({
          url: `/admin/update/${id}`,
          method: "put",
          body: payload,
        }),
        invalidatesTags: ["admin", "admins"],
      }),
      getRevenueChartData: build.query<
        ResponseType<RevenueChart>,
        { view?: "week"; year?: number; month?: number }
      >({
        query: ({ view, year, month }) => ({
          url: "/admin/dashboard/revenue-chart",
          method: "get",
          params: view === "week" ? { view } : { year, ...(month ? { month } : {}) },
        }),
      }),
      getRevenuePageAnalytics: build.query<
        ResponseType<{
          todayRevenue: number;
          weekRevenue: number;
          monthRevenue: number;
          yearRevenue: number;
        }>,
        null
      >({
        query: () => "/admin/payments/revenue-analytics",
      }),
      waiveRegistrationFee: build.mutation<ResponseType, { userId: string }>({
        query: (payload) => ({
          url: "/admin/members/waive-registration-fee",
          method: "post",
          body: payload,
        }),
        invalidatesTags: ["member", "members"],
      }),
      getMembersPieChartData: build.query<
        ResponseType<{
          newMembers: number;
          activeMembers: number;
          inactiveMembers: number;
        }>,
        null
      >({
        query: () => "/admin/dashboard/members-pie-chart",
      }),
      getActivityZoneSummary: build.query<
        ResponseType<ActivityZoneSummary>,
        null
      >({
        query: () => "/admin/activity-zones/summary",
        providesTags: ["activity-zones"],
      }),
      getInactivityFeedbackSummary: build.query<
        ResponseType<InactivityFeedbackSummary>,
        null
      >({
        query: () => "/admin/activity-zones/feedback",
        providesTags: ["inactivity-feedback"],
      }),
      previewQrCheckIn: build.mutation<
        ResponseType<QrCheckInPreview>,
        { code: string }
      >({
        query: (body) => ({
          url: "/admin/check-ins/scan/preview",
          method: "post",
          body,
        }),
      }),
      confirmQrCheckIn: build.mutation<
        ResponseType<{ member: QrCheckInPreview["member"] }>,
        { code: string }
      >({
        query: (body) => ({
          url: "/admin/check-ins/scan",
          method: "post",
          body,
        }),
        invalidatesTags: [
          "admin-check-ins",
          "leaderboard",
          "activity-zones",
          "member",
          "members",
        ],
      }),
      getAdminLeaderboard: build.query<
        ResponseType<Leaderboard>,
        { period: LeaderboardPeriod }
      >({
        query: ({ period }) => `/admin/leaderboard?period=${period}`,
        providesTags: ["leaderboard"],
      }),
      getCheckInLocationSettings: build.query<
        ResponseType<CheckInLocationSettings>,
        null
      >({
        query: () => "/admin/check-in-location",
        providesTags: ["check-in-location"],
      }),
      updateCheckInLocationSettings: build.mutation<
        ResponseType<CheckInLocationSettings>,
        Omit<CheckInLocationSettings, "updatedAt">
      >({
        query: (body) => ({
          url: "/admin/check-in-location",
          method: "put",
          body,
        }),
        invalidatesTags: ["check-in-location"],
      }),
      getNotificationSettings: build.query<
        ResponseType<AdminNotificationSettings>,
        null
      >({
        query: () => "/admin/notification-settings",
        providesTags: ["notification-settings"],
      }),
      updateNotificationSettings: build.mutation<
        ResponseType<AdminNotificationSettings>,
        {
          recipients: string;
          events: AdminNotificationSettings["events"];
        }
      >({
        query: (body) => ({
          url: "/admin/notification-settings",
          method: "put",
          body,
        }),
        invalidatesTags: ["notification-settings"],
      }),
      getActivityZoneSettings: build.query<
        ResponseType<ActivityZoneSettings>,
        null
      >({
        query: () => "/admin/activity-zones/settings",
        providesTags: ["activity-zone-settings"],
      }),
      updateActivityZoneSettings: build.mutation<
        ResponseType<ActivityZoneSettings>,
        ActivityZoneSettings
      >({
        query: ({ thresholds, notifications, afterEntering }) => ({
          url: "/admin/activity-zones/settings",
          method: "put",
          body: { thresholds, notifications, afterEntering },
        }),
        invalidatesTags: [
          "activity-zone-settings",
          "activity-zones",
          "members",
          "member",
        ],
      }),
    };
  },
});

export const {
  useGetMembersQuery,
  useGetCheckInsQuery,
  useAdminGetCheckInAnalyticsQuery,
  useGetMembersAnalyticsQuery,
  useGetDashboardRevenueAnalyticsQuery,
  useCheckUserInMutation,
  useAdminGetPlansQuery,
  useUpdatePlanMutation,
  useCreatePlanMutation,
  useGetPaymentsLogsQuery,
  useGetMemberByIdQuery,
  useGetMembersSubscriptionsQuery,
  useActivateMemberSubMutation,
  useGetAdminsQuery,
  useGetPermissionsQuery,
  useInviteAdminMutation,
  useGetInvitationsQuery,
  useResendInviteNotificationMutation,
  useUpdateAdminMutation,
  useGetRevenueChartDataQuery,
  useGetRevenuePageAnalyticsQuery,
  useWaiveRegistrationFeeMutation,
  useGetMembersPieChartDataQuery,
  useGetActivityZoneSummaryQuery,
  useGetActivityZoneSettingsQuery,
  useGetAdminLeaderboardQuery,
  useGetCheckInLocationSettingsQuery,
  useUpdateCheckInLocationSettingsMutation,
  useGetNotificationSettingsQuery,
  usePreviewQrCheckInMutation,
  useConfirmQrCheckInMutation,
  useUpdateNotificationSettingsMutation,
  useGetInactivityFeedbackSummaryQuery,
  useUpdateActivityZoneSettingsMutation,
} = adminApi;
