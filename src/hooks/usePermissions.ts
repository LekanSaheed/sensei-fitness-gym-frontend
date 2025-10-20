import useUser from "./useUser";

const permissions_string = [
  "super_user",
  "view_all_members",
  "view_check_ins",
  "check_member_in",
  "view_members_subscriptions",
  "view_subscription_plans",
  "create_subscription_plan",
  "modify_subscription_plan",
  "view_payment_logs",
  "activate_member_subscription",
] as const;

export type Permission = (typeof permissions_string)[number];

export const useUserCanPerformAction = () => {
  const user = useUser();

  const permissions = user?.permissions || [];

  return (requiredPermissions: Permission[] = []) => {
    return requiredPermissions?.length < 1
      ? true
      : permissions.some((permission) =>
          requiredPermissions?.includes(permission)
        ) || permissions.includes("super_user");
  };
};
