import { Permission } from "@/hooks/usePermissions";

interface IUser {
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
  _id: string;
}

export default IUser;
