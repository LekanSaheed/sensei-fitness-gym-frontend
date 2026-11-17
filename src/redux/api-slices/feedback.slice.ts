import { ResponseType } from "@/types";
import {
  InactivityReasonOption,
  NotifiableZone,
} from "@/types/ActivityZone";
import { api } from "../api";

export interface InactivityFeedbackSession {
  firstname: string;
  reminderZone: NotifiableZone;
  reasons: InactivityReasonOption[];
  existing: { reason: string; note: string; updatedAt: string } | null;
}

const feedbackApi = api.injectEndpoints({
  endpoints(build) {
    return {
      getInactivityFeedbackSession: build.query<
        ResponseType<InactivityFeedbackSession>,
        string
      >({
        query: (token) =>
          `/feedback/inactivity?token=${encodeURIComponent(token)}`,
      }),
      submitInactivityFeedback: build.mutation<
        ResponseType<{ submitted: boolean }>,
        { token: string; reason: string; note: string }
      >({
        query: (body) => ({
          url: "/feedback/inactivity",
          method: "post",
          body,
        }),
        invalidatesTags: ["inactivity-feedback", "member"],
      }),
    };
  },
});

export const {
  useGetInactivityFeedbackSessionQuery,
  useSubmitInactivityFeedbackMutation,
} = feedbackApi;
