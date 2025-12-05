import {
  Document,
  DocumentText,
  HeartCircle,
  HeartTick,
  Home3,
  Icon,
  LocationTick,
  MoneySend,
  People,
  Profile,
  ReceiptEdit,
  SecurityUser,
  Setting2,
} from "iconsax-react";
import {
  ADMIN_DASHBOARD,
  ADMIN_SETTINGS,
  ACCESS_CONTROL,
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
  // { label: "Subscriptions", path: SUBSCRIPTIONS, icon: MoneySend },
  { label: "Home", path: DASHBOARD, icon: Home3 },
  // { label: "Profile", path: PROFILE, icon: Profile },
  { label: "Profile", path: PROFILE, icon: Profile },
];

export interface IMenu {
  links: NavLink[];
  label?: string;
}

export const routesAndTheirPermissions: Record<string, Permission[]> = {
  [MEMBERS]: ["view_all_members"],
  [USER_CHECK_INS]: ["view_check_ins"],
  [USERS_SUBSCRIPTIONS]: ["view_members_subscriptions"],
  [MANAGE_PLANS]: ["view_subscription_plans"],
  [PAYMENT_LOGS]: ["view_payment_logs"],
  [ACCESS_CONTROL]: ["view_access_control"],
};

export const admin_side_bar: IMenu[] = [
  {
    links: [{ label: "Dashboard", path: ADMIN_DASHBOARD, icon: Home3 }],
  },

  {
    label: "Daily Operations",

    links: [
      {
        label: "Members",
        path: MEMBERS,
        icon: People,
        permissions: routesAndTheirPermissions[MEMBERS],
      },
      {
        label: "Check-ins",
        path: USER_CHECK_INS,
        icon: SecurityUser,
        permissions: routesAndTheirPermissions[USER_CHECK_INS],
      },
      {
        label: "Subscriptions",
        path: USERS_SUBSCRIPTIONS,
        icon: HeartCircle,
        permissions: routesAndTheirPermissions[USERS_SUBSCRIPTIONS],
      },
    ],
  },
  {
    label: "In-house",
    links: [
      {
        label: "Subscription Plans",
        path: MANAGE_PLANS,
        icon: ReceiptEdit,
        permissions: routesAndTheirPermissions[MANAGE_PLANS],
      },
      {
        label: "Payment Logs",
        path: PAYMENT_LOGS,
        icon: DocumentText,
        permissions: routesAndTheirPermissions[PAYMENT_LOGS],
      },
    ],
  },
  {
    label: "Control",
    links: [
      {
        label: "Access Control",
        path: ACCESS_CONTROL,
        icon: SecurityUser,
        permissions: routesAndTheirPermissions[ACCESS_CONTROL],
      },
      { label: "Settings", path: ADMIN_SETTINGS, icon: Setting2 },
    ],
  },
];

export const landing_page_nav_links: { label: string; path: string }[] = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about-us" },
  { label: "Contact", path: "/contact" },
];
