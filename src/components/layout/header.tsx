import useUser from "@/hooks/useUser";
import React from "react";
import { useIsSubPath } from "./mobile-nav";
import { ArrowLeft2, Moon, Sun1 } from "iconsax-react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  CHECK_INS,
  DASHBOARD,
  NEW_CHECK_IN,
  PROFILE,
  RENEW_SUBSCRIPTION,
  SUBSCRIPTIONS,
} from "@/constants/routes";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { collocateMemberName, getInitials } from "@/utils";
import { useColorScheme } from "@/hooks/useColorScheme";
import Link from "next/link";

const pathLabels: Record<string, { label: string; subtitle?: string }> = {
  [RENEW_SUBSCRIPTION]: {
    label: "Select a plan",
    subtitle: "Pick the membership that fits you",
  },
  [NEW_CHECK_IN]: { label: "Check In", subtitle: "Log today's session" },
  [SUBSCRIPTIONS]: { label: "My Subscriptions", subtitle: "Your plan history" },
  [CHECK_INS]: { label: "Training log", subtitle: "Every session you've logged" },
  [PROFILE]: { label: "Profile", subtitle: "Your account and settings" },
};

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

const Header = () => {
  const user = useUser();

  const isSubPath = useIsSubPath();

  const router = useRouter();

  const pathname = usePathname();

  const isHome = pathname === DASHBOARD;

  const pathlabel = pathLabels[pathname] || { label: "" };

  const { scheme, toggleScheme } = useColorScheme();

  const avatar = (
    <Avatar className="size-11 ring-2 ring-default/60 ring-offset-2 ring-offset-[#f2f2f2] dark:ring-offset-background">
      <AvatarImage src={user?.profile_picture} />
      <AvatarFallback className="bg-default/15 text-default font-semibold">
        {getInitials(collocateMemberName(user!))}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <header className="sticky top-0 z-[2] px-4 pt-3 pb-2 bg-[#f2f2f2]/85 backdrop-blur-md dark:bg-background/85">
      <div className="h-[60px] flex items-center justify-between gap-3">
        <AnimatePresence mode="wait" initial={false}>
          {isSubPath ? (
            <motion.div
              key="sub"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ type: "tween", duration: 0.15 }}
              className="flex items-center gap-3 min-w-0"
            >
              <button
                aria-label="Go back"
                className="flex items-center justify-center size-[42px] shrink-0 rounded-full bg-white border border-gray-200 transition active:scale-95 dark:bg-card dark:border-border"
                onClick={() => router.back()}
              >
                <ArrowLeft2 color="var(--color-default)" size={20} />
              </button>
              <div className="min-w-0">
                <p className="font-league uppercase text-[26px] leading-none truncate">
                  {pathlabel?.label}
                </p>
                {pathlabel?.subtitle && (
                  <p className="text-[12px] text-gray-500 dark:text-muted-foreground truncate">
                    {pathlabel.subtitle}
                  </p>
                )}
              </div>
            </motion.div>
          ) : isHome ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3 min-w-0"
            >
              <Link href={PROFILE} aria-label="Open profile" className="shrink-0">
                {avatar}
              </Link>
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500 dark:text-muted-foreground">
                  {getGreeting()}
                </p>
                <h1 className="text-[20px] font-bold leading-tight truncate">
                  Hi, {user?.firstname}
                </h1>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-w-0"
            >
              <h1 className="font-league uppercase text-[32px] leading-none truncate">
                {pathlabel?.label}
              </h1>
              {pathlabel?.subtitle && (
                <p className="text-[12px] text-gray-500 dark:text-muted-foreground truncate">
                  {pathlabel.subtitle}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <button
          aria-label={
            scheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          className="size-[42px] flex items-center justify-center shrink-0 rounded-full bg-white border border-gray-200 transition active:scale-95 dark:bg-card dark:border-border"
          onClick={toggleScheme}
        >
          {React.createElement(scheme === "dark" ? Sun1 : Moon, {
            size: 20,
            color: "var(--color-default)",
          })}
        </button>
      </div>
    </header>
  );
};

export default Header;
