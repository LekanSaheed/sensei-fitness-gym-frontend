import { ResponseType } from "@/types";
import { api } from "../api";

export interface ISubscriptionPlan {
  name: string;
  durationInDays: number;
  price: number;
  trainerFee: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

export type PaymentMode = "gateway" | "admin";

export type SubscriptionStatus = "active" | "expired" | "canceled";

export interface ISubscription {
  user: string;
  plan: {
    _id: string;
    name: string;
    durationInDays: number;
    price: number;
    trainerFee: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  paymentMode: PaymentMode;
  paymentRef: string;
  activatedBy?: string;
  planNameSnapshot: string;
  planDurationInDaysSnapshot: number;
  planBasePriceSnapshot: number;
  trainerFeeSnapshot?: number;
  includesTrainer: boolean;
  totalAmount: number;
}

const subscriptionApi = api.injectEndpoints({
  endpoints(build) {
    return {
      getPlans: build.query<
        ResponseType<{
          plans: ISubscriptionPlan[];
          registrationFee: number;
        }>,
        null
      >({
        query: () => `/subscriptions/plans`,
      }),
      getActiveSubscription: build.query<ResponseType<ISubscription>, null>({
        query: () => "/subscriptions/active",
      }),
      subscribe: build.mutation<
        ResponseType<{ authorization_url: string }>,
        { includeTrainer: boolean; plan: string }
      >({
        query: (payload) => ({
          url: `/subscriptions`,
          method: "post",
          body: payload,
        }),
      }),
      activateSub: build.query<
        ResponseType<{ status: "success" | "failed" | "pending" | "reversed" }>,
        string
      >({
        query: (ref) => `/subscriptions/activate?ref=${ref}`,
        keepUnusedDataFor: 0,
      }),
      checkIn: build.mutation<ResponseType, null>({
        query: () => ({
          url: "/subscriptions/check-ins",
          method: "post",
          body: {},
        }),
        invalidatesTags: ["has-checked-in"],
      }),
      checkIfCheckedInToday: build.query<
        ResponseType<{ checkedIn: boolean }>,
        null
      >({
        query: () => "/subscriptions/check-ins/is-checked-in-today",
        keepUnusedDataFor: 0,
        providesTags: ["has-checked-in"],
      }),
      getCheckInAnalytics: build.query<
        ResponseType<{ totalOnSub: number }>,
        null
      >({
        query: () => "/subscriptions/check-ins/analytics",
        providesTags: ["has-checked-in"],
      }),
    };
  },
});

export const {
  useGetPlansQuery,
  useGetActiveSubscriptionQuery,
  useSubscribeMutation,
  useActivateSubQuery,
  useCheckInMutation,
  useCheckIfCheckedInTodayQuery,
  useGetCheckInAnalyticsQuery,
} = subscriptionApi;
