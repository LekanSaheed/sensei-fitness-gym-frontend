import { admin_side_bar, IMenu } from "@/constants";
import { useUserCanPerformAction } from "./usePermissions";

const useNav = () => {
  const userCanPerformAction = useUserCanPerformAction();

  const newNav: IMenu[] = admin_side_bar
    .map((menu) => {
      return {
        ...menu,
        links: menu.links.filter((l) => {
          return userCanPerformAction(l?.permissions || []);
        }),
      };
    })
    .filter((m) => m?.links?.length > 0);

  return newNav;
};

export default useNav;
