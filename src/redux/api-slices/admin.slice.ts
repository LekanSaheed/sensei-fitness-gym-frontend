import {
  ICheckIn,
  PaginatedResponse,
  PaginationQuery,
  ResponseType,
} from "@/types";
import { api } from "../api";
import IUser from "@/types/User";
import { formatQuery } from "@/utils";
import { ISubscription, ISubscriptionPlan } from "./subscription.slice";
import { EditablePlanFields } from "@/app/admin/plans/page";
import PaymentLog from "@/types/PaymentLog";

export type UserWithSub = IUser & {
  latestSubscription: Pick<
    ISubscription,
    | "status"
    | "startDate"
    | "endDate"
    | "includesTrainer"
    | "planNameSnapshot"
    | "paymentMode"
  > | null;
};

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
      getMemberById: build.query<ResponseType<IUser>, string>({
        query: (id) => `/admin/members/${id}`,
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
        invalidatesTags: ["admin-check-ins"],
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
        EditablePlanFields & { isActive: boolean }
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
} = adminApi;
