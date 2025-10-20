/**
 *
 * @description This blocks users from accessing routes they don't have access to
 */

import { routesAndTheirPermissions } from "@/constants";
import { useUserCanPerformAction } from "@/hooks/usePermissions";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const PermissionRoute = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const routePermissions = routesAndTheirPermissions[pathname];

  const canView = useUserCanPerformAction();

  if (!!routePermissions) {
    const userCanAccess = canView(routePermissions);
    if (userCanAccess) {
      return children;
    } else {
      return (
        <div>You do not have the required permissions to view this page</div>
      );
    }
  }
  return children;
};

export default PermissionRoute;
