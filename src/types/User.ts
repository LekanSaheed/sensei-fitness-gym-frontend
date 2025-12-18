import { Permission } from "@/hooks/usePermissions";

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
  phoneNumber: string;
}

export default IUser;
