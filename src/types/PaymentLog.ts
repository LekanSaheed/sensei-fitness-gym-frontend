import { PaymentMode } from "@/redux/api-slices/subscription.slice";
import IUser from "./User";

export type PaymentLogStatus = "pending" | "successful" | "failed";

interface PaymentLog {
  _id: string;
  user: Pick<IUser, "firstname" | "lastname" | "email" | "_id">;
  plan: string;
  subscription: string | null;
  amount: number;
  paymentMode: PaymentMode;
  breakDown: {
    subscriptionFeeSnapshot: number;
    registrationFeeSnapshot: number;
    trainerFeeSnapshot: number;
    planNameSnapshot: string;
    planDurationSnapshot: number;
  };
  status: PaymentLogStatus;
  createdAt: string;
  updatedAt: string;
}

export default PaymentLog;
