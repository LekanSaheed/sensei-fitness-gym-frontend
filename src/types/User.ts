import { Permission } from "@/hooks/usePermissions";
import { MemberActivity } from "./ActivityZone";

interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  profile_picture: string;
  role: "user" | "admin";
  fullname: string;
  registrationFeePaid: boolean;
  disabled: boolean;
  permissions?: Permission[];
  hasActiveSub: boolean;
  registrationFeeWaivedBy: Pick<IUser, "firstname" | "lastname"> | null;
  /** Set when an admin recorded the fee as paid at the desk */
  registrationFeePayment?: { _id: string; amount: number; createdAt: string } | null;
  phoneNumber: string;
  /** When the account was created */
  createdAt: string;
  lastLoginAt?: string | null;
  lastCheckInAt?: string | null;
  activity?: MemberActivity;
  notificationPreferences?: {
    activityReminders: boolean;
  };
}

export default IUser;
