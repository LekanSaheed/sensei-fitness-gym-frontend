import useUser from "@/hooks/useUser";
import React from "react";
import { useIsSubPath } from "./mobile-nav";
import { ArrowLeft2 } from "iconsax-react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { NEW_CHECK_IN, RENEW_SUBSCRIPTION } from "@/constants/routes";
import moment from "moment";
import { label } from "framer-motion/client";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { collocateMemberName, getInitials } from "@/utils";

const Header = () => {
  const user = useUser();

  const isSubPath = useIsSubPath();

  const router = useRouter();

  const pathname = usePathname();

  const pathLabels: Record<string, { label: string }> = {
    [RENEW_SUBSCRIPTION]: {
      label: "Select a plan",
    },
    [NEW_CHECK_IN]: {
      label: "Check In",
    },
  };

  const pathlabel = pathLabels[pathname] || { label: "Route" };

  function getGreeting() {
    const currentHour = moment().hour(); // Get the current hour (0-23)

    if (currentHour >= 5 && currentHour < 12) {
      return "Good Morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good Afternoon";
    } else if (currentHour >= 18 && currentHour < 22) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  }

  return (
    <header className="sticky top-0 px-4  pt-4">
      <div className="bg-white rounded-full px-3 h-[70px] flex items-center border border-gray-200">
        <div className="flex justify-between items-center flex-1">
          <AnimatePresence>
            {isSubPath ? (
              <>
                <div>
                  <div
                    className="flex items-center border rounded-full bg-white border-default/50  justify-center size-[40px]"
                    onClick={() => router.back()}
                  >
                    {" "}
                    <ArrowLeft2 color="var(--color-default)" size={20} />
                  </div>
                </div>
                <motion.p
                  transition={{ type: "tween", duration: 0.09 }}
                  initial={{ x: "-100%" }}
                  animate={{ x: "0" }}
                  exit={{ x: "-100%" }}
                  className="font-semibold text-[18px]"
                >
                  {pathlabel?.label}
                </motion.p>
              </>
            ) : (
              <div className="flex items-center">
                <Avatar className="size-11 border border-gray-400 mr-2">
                  <AvatarFallback>
                    {getInitials(collocateMemberName(user!))}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-[18px] font-bold">
                    Hi, {user?.firstname}.
                  </h1>
                  <p className="text-[12px]">{getGreeting()}</p>
                </div>
              </div>
            )}
          </AnimatePresence>
          <div className="size-[40px]"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
