import {
  Home3,
  Icon,
  LocationTick,
  MoneySend,
  People,
  Profile,
  SecurityUser,
  Setting2,
} from "iconsax-react";
import {
  ADMIN_DASHBOARD,
  ADMIN_SETTINGS,
  ADMINS,
  CHECK_INS,
  DASHBOARD,
  MANAGE_PLANS,
  MEMBERS,
  PAYMENT_LOGS,
  PROFILE,
  SUBSCRIPTIONS,
  USER_CHECK_INS,
  USERS_SUBSCRIPTIONS,
} from "./routes";
import { Permission } from "@/hooks/usePermissions";

interface NavLink {
  label: string;
  path: string;
  icon: Icon;
  permissions?: Permission[];
}

export const currency = "₦";

export const DEFAULT_ERROR_MESSAGE =
  "There was a problem while processing the request, please try again later";

export const nav_links: NavLink[] = [
  { label: "Check-ins", path: CHECK_INS, icon: LocationTick },
  { label: "Subscriptions", path: SUBSCRIPTIONS, icon: MoneySend },
  { label: "Home", path: DASHBOARD, icon: Home3 },
  { label: "Profile", path: PROFILE, icon: Profile },
  { label: "Profile", path: PROFILE, icon: Profile },
];

export interface IMenu {
  links: NavLink[];
}

export const routesAndTheirPermissions: Record<string, Permission[]> = {
  [MEMBERS]: ["view_all_members"],
  [USER_CHECK_INS]: ["view_check_ins"],
  [USERS_SUBSCRIPTIONS]: ["view_members_subscriptions"],
  [MANAGE_PLANS]: ["view_subscription_plans"],
  [PAYMENT_LOGS]: ["view_payment_logs"],
};

export const admin_side_bar: IMenu[] = [
  { links: [{ label: "Dashboard", path: ADMIN_DASHBOARD, icon: Home3 }] },
  {
    links: [
      {
        label: "Members",
        path: MEMBERS,
        icon: People,
        permissions: routesAndTheirPermissions[MEMBERS],
      },
      { label: "Admins", path: ADMINS, icon: SecurityUser },
    ],
  },
  {
    links: [
      {
        label: "Check-ins",
        path: USER_CHECK_INS,
        icon: SecurityUser,
        permissions: routesAndTheirPermissions[USER_CHECK_INS],
      },
      {
        label: "Members Subscriptions",
        path: USERS_SUBSCRIPTIONS,
        icon: MoneySend,
        permissions: routesAndTheirPermissions[USERS_SUBSCRIPTIONS],
      },
      {
        label: "Subscription Plans",
        path: MANAGE_PLANS,
        icon: MoneySend,
        permissions: routesAndTheirPermissions[MANAGE_PLANS],
      },
      {
        label: "Payment Logs",
        path: PAYMENT_LOGS,
        icon: Setting2,
        permissions: routesAndTheirPermissions[PAYMENT_LOGS],
      },
    ],
  },
  { links: [{ label: "Settings", path: ADMIN_SETTINGS, icon: Setting2 }] },
];
