"use client";

import {
  PlanType,
  useGetActiveSubscriptionQuery,
  useGetPlansQuery,
  useGetUpcomingSubscriptionQuery,
  useSubscribeMutation,
} from "@/redux/api-slices/subscription.slice";
import moment from "moment";
import FormatNumber from "@/utils/format-number";
import React, { FunctionComponent, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Button from "@/components/button";
import { isFetchBaseQueryError } from "@/utils";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import useUser from "@/hooks/useUser";
import SectionLoader from "@/components/SectionLoader";
import Link from "next/link";
import { LOGIN, TERMS } from "@/constants/routes";
import DialogModal from "@/components/dialog-modal";
import { Switch } from "@/components/ui/switch";
import {
  Calendar,
  HeartTick,
  Lock1,
  Profile2User,
  ShieldTick,
  TickCircle,
} from "iconsax-react";

const RenewSubPage = () => {
  const { isLoading, isFetching, isError, data, refetch } =
    useGetPlansQuery(null);

  const loading = isLoading || isFetching;

  const plans = data?.data?.plans || [];

  const registrationFee = data?.data?.registrationFee;

  const [selectedPlan, setSelectedPlan] = useState("");

  const [includeTrainer, setIncludeTrainer] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  const RawSelectedPlan = plans.find((p) => p?._id === selectedPlan);

  const user = useUser();

  const paymentSummary: { label: string; amount: number; hide?: boolean }[] = [
    {
      label: "One-time Registration fee",
      amount: registrationFee!,
      hide: user?.registrationFeePaid,
    },
    { label: "Subscription fee", amount: RawSelectedPlan?.price || 0 },
    {
      label: "Trainer fee",
      amount: RawSelectedPlan?.trainerFee || 0,
      hide: !includeTrainer,
    },
  ];

  const feesThatApply = paymentSummary?.filter((p) => !p?.hide);

  const totalAmount = feesThatApply.reduce(
    (acc, curr) => acc + curr?.amount,
    0
  );

  const [view, setView] = useState<"main" | "undertaking">("main");


  // Renewals are queued: the new plan starts when the current one ends
  const activeSub = useGetActiveSubscriptionQuery(null).data?.data || null;

  const upcoming = useGetUpcomingSubscriptionQuery(null).data?.data || null;

  const newPlanStart = activeSub
    ? moment(activeSub.endDate).add(1, "minute").startOf("day")
    : null;

  const sessionBasedNow = activeSub?.planType === PlanType.SessionBased;

  const queueNote = activeSub
    ? `Your current plan (${activeSub.planNameSnapshot}) keeps running. Your new plan will start on ${newPlanStart?.format(
        "ddd, D MMM YYYY"
      )}${sessionBasedNow ? ", or sooner if you use up your current sessions" : ""}.`
    : "";

  return (
    <LayoutGroup>
      <div>
        <div className="pt-2 pb-[120px]">
          {upcoming ? (
            <div className="mb-4 rounded-[18px] border border-sky-200 bg-sky-50 px-4 py-3 text-[13px] text-sky-900 dark:bg-sky-500/10 dark:border-sky-500/30 dark:text-sky-100">
              <p className="font-semibold">You already have a plan waiting</p>
              <p className="mt-0.5">
                {upcoming.planNameSnapshot} starts on{" "}
                {moment(upcoming.startDate).format("ddd, D MMM YYYY")}. You can
                buy another plan once it has started.
              </p>
            </div>
          ) : activeSub ? (
            <div className="mb-4 rounded-[18px] border border-default/30 bg-default/[0.06] px-4 py-3 text-[13px]">
              <p className="font-semibold">You won&apos;t lose any days</p>
              <p className="mt-0.5 text-gray-600 dark:text-gray-300">{queueNote}</p>
            </div>
          ) : null}
          <SectionLoader loading={loading} error={isError} refetch={refetch} />
          {!loading && !isError && plans.length === 0 && (
            <p className="text-center text-[14px] text-gray-500 py-10">
              No plans are available right now.
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {plans.map((plan, id) => {
              const hasTrainerFee = plan?.trainerFee > 0;

              const isSelected = selectedPlan === plan._id;
              return (
                <motion.div
                  layout
                  key={id}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedPlan(plan._id);
                      setIncludeTrainer(false);
                    }
                  }}
                  className={`relative cursor-pointer p-5 border-2 rounded-[22px] overflow-hidden transition dark:text-card-foreground ${
                    isSelected
                      ? "border-default bg-default/[0.06] dark:bg-default/10"
                      : "border-transparent bg-white dark:bg-card"
                  }`}
                  onClick={() => {
                    setSelectedPlan(plan._id);
                    setIncludeTrainer(false);
                  }}
                >
                  <motion.div layout>
                    <div className="flex items-start justify-between gap-3">
                      <div className="tracking-tight min-w-0">
                        <h1 className="font-bold text-[18px] mb-1">{plan?.name}</h1>
                        <p className="font-medium text-[13px] text-gray-500 dark:text-gray-400">
                          {plan?.description}
                        </p>
                      </div>
                      <span
                        className={`size-6 shrink-0 rounded-full border-2 inline-flex items-center justify-center transition ${
                          isSelected
                            ? "border-default bg-default"
                            : "border-gray-300 dark:border-border"
                        }`}
                      >
                        {isSelected && (
                          <TickCircle size={16} color="var(--color-white)" variant="Bold" />
                        )}
                      </span>
                    </div>
                    <div className="flex items-end justify-between gap-2 mt-4">
                      <span className="font-league text-default text-[38px] leading-none">
                        {FormatNumber.ngnAmount(plan?.price)}
                      </span>
                      <span className="rounded-full bg-default-black text-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide dark:bg-secondary">
                        {plan.durationInDays} day
                        {plan.durationInDays > 1 ? "s" : ""}
                      </span>
                    </div>
                  </motion.div>

                  <AnimatePresence mode="popLayout">
                    {isSelected && hasTrainerFee && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ type: "tween" }}
                        className="mt-4 bg-white/80 border border-default/30 rounded-[14px] p-3 dark:bg-muted dark:border-sidebar-border"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <label className="text-[14px] flex items-center justify-between gap-3 cursor-pointer">
                          <span className="flex items-center gap-2">
                            <Profile2User size={18} color="var(--color-default)" variant="Bold" />
                            <span>
                              Include a trainer
                              <span className="block text-[12px] text-gray-500 dark:text-muted-foreground">
                                +{FormatNumber.ngnAmount(plan.trainerFee)}
                              </span>
                            </span>
                          </span>
                          <Switch
                            checked={includeTrainer}
                            onCheckedChange={(checked) => setIncludeTrainer(checked)}
                            aria-label="Include trainer on current plan"
                          />
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="fixed px-4 bottom-0 pb-5 pt-3 right-0 left-0 z-[3] bg-[#f2f2f2]/95 backdrop-blur-md border-t border-gray-200 dark:bg-background/95 dark:border-border">
          <div className="sm:max-w-[560px] mx-auto">
            {RawSelectedPlan && (
              <div className="flex items-center justify-between text-[13px] mb-2 px-1">
                <span className="truncate">
                  {RawSelectedPlan.name}
                  {includeTrainer ? " + trainer" : ""}
                </span>
                <span className="font-semibold shrink-0">
                  {FormatNumber.ngnAmount(totalAmount)}
                </span>
              </div>
            )}
            <Button
              disabled={!selectedPlan || !!upcoming}
              size="lg"
              label={
                upcoming
                  ? "A plan is already waiting"
                  : selectedPlan
                  ? "Proceed"
                  : "Select a plan"
              }
              fullWidth
              fullRadius
              onClick={() => setOpenModal(true)}
            />
          </div>
        </div>
      </div>
      <Modal
        isBack={view !== "main"}
        onBack={() => setView("main")}
        onClose={() => setView("main")}
        title={view === "main" ? "Review your plan" : "Member undertaking"}
        open={openModal}
        setOpen={setOpenModal}
      >
        <StepDots step={view === "main" ? 1 : 2} />

        {view === "main" && (
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-[20px] bg-default-black text-white p-4">
              <div className="pointer-events-none absolute -right-10 -top-12 size-36 rounded-full bg-default/40 blur-2xl" />
              <div className="relative flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-default-tertiary">
                    Your plan
                  </p>
                  <h2 className="font-league uppercase text-[28px] leading-none mt-1 break-words">
                    {RawSelectedPlan?.name}
                  </h2>
                  {RawSelectedPlan?.description && (
                    <p className="text-[12px] text-white/65 mt-1.5">
                      {RawSelectedPlan.description}
                    </p>
                  )}
                  {includeTrainer && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-default/25 border border-default/50 px-2.5 py-0.5 text-[11px] font-semibold text-default-tertiary">
                      <Profile2User size={12} color="currentColor" variant="Bold" />
                      Trainer included
                    </span>
                  )}
                </div>
                <div className="shrink-0 rounded-[16px] bg-white/10 border border-white/15 px-3 py-2 text-center">
                  <p className="font-league text-[30px] leading-none">
                    {RawSelectedPlan?.durationInDays}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-white/60 mt-1">
                    Day{(RawSelectedPlan?.durationInDays || 0) === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-[16px] border border-gray-200 bg-white px-3.5 py-3 text-[13px] dark:bg-card dark:border-border">
              <Calendar size={18} color="var(--color-default)" variant="Bulk" className="shrink-0 mt-0.5" />
              <p className="text-gray-600 dark:text-muted-foreground">
                {activeSub ? (
                  queueNote
                ) : (
                  <>
                    Starts <span className="font-semibold text-gray-900 dark:text-foreground">today</span> as soon as your payment goes through.
                  </>
                )}
              </p>
            </div>

            <div className="rounded-[16px] border border-gray-200 bg-white px-4 py-3.5 dark:bg-card dark:border-border">
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-gray-500 mb-2">
                Payment summary
              </h3>
              <ul className="text-[14px]">
                {feesThatApply.map((fee) => (
                  <li key={fee.label} className="flex justify-between gap-3 py-1.5">
                    <span className="text-gray-500 dark:text-muted-foreground">{fee.label}</span>
                    <span className="font-semibold tabular-nums">
                      {FormatNumber.ngnAmount(fee.amount)}
                    </span>
                  </li>
                ))}
                <li className="flex items-end justify-between gap-3 border-t border-dashed border-gray-300 dark:border-border mt-2 pt-3">
                  <span className="font-semibold">Total</span>
                  <span className="font-league text-[30px] leading-none tabular-nums">
                    {FormatNumber.ngnAmount(totalAmount)}
                  </span>
                </li>
              </ul>
            </div>

            <Button
              label="Continue"
              color="black"
              fullRadius
              size="lg"
              fullWidth
              onClick={() => setView("undertaking")}
            />
          </div>
        )}
        {view === "undertaking" && (
          <UnderTaking
            includeTrainer={includeTrainer}
            selectedPlan={selectedPlan}
            planName={RawSelectedPlan?.name || ""}
            total={totalAmount}
          />
        )}
      </Modal>
    </LayoutGroup>
  );
};

/** Two dots above the sheet: 1 Review, 2 Undertaking */
const StepDots = ({ step }: { step: 1 | 2 }) => (
  <ol className="flex items-center justify-center gap-2 -mt-2 mb-4 text-[11px] font-semibold">
    {["Review", "Undertaking"].map((label, i) => {
      const n = i + 1;

      const on = n <= step;

      return (
        <li key={label} className="flex items-center gap-2">
          {i > 0 && <span className={`h-px w-6 ${on ? "bg-default" : "bg-gray-300"}`} />}
          <span className={`inline-flex items-center gap-1.5 ${on ? "text-default" : "text-gray-400"}`}>
            <span
              className={`size-5 rounded-full inline-flex items-center justify-center text-[10px] ${
                on ? "bg-default text-white" : "bg-gray-200 text-gray-500 dark:bg-muted"
              }`}
            >
              {n}
            </span>
            {label}
          </span>
        </li>
      );
    })}
  </ol>
);

const UnderTaking: FunctionComponent<{
  includeTrainer: boolean;
  selectedPlan: string;
  planName: string;
  total: number;
}> = ({ includeTrainer, selectedPlan, planName, total }) => {
  const [subscribe, subscribeStatus] = useSubscribeMutation();

  const router = useRouter();

  const subscribeToPlan = async () => {
    const res = await subscribe({ includeTrainer, plan: selectedPlan });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res?.data;

      if (response?.success) {
        const url = response?.data?.authorization_url;

        router.push(url!);
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  const user = useUser();

  const name = user?.fullname || `${user?.firstname || ""} ${user?.lastname || ""}`.trim();

  const [acceptedUndertaking, setAcceptedUndertaking] = useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const declarations = [
    {
      icon: HeartTick,
      title: "My health",
      text: "By subscribing to be a member in SEN-SEI FITNESS, I am fully aware of my health status and I hereby agree that my health status permits me to exercise.",
    },
    {
      icon: ShieldTick,
      title: "Liability",
      text: "I release SEN-SEI FITNESS of any liability relating to injury or death during my period of exercising.",
    },
  ];

  const checkboxClass =
    "flex items-start gap-3 rounded-[14px] border border-gray-200 bg-white p-3 cursor-pointer text-[13px] has-[:checked]:border-default has-[:checked]:bg-default/5 dark:bg-card dark:border-border";

  return (
    <div className="flex flex-col gap-3 font-jakarta">
      {/* The document */}
      <article className="rounded-[20px] border border-gray-200 bg-[#fcfbf8] dark:bg-card dark:border-border overflow-hidden">
        <header className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 dark:border-border bg-white/60 dark:bg-transparent">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-default font-semibold">
              SEN-SEI Fitness
            </p>
            <h2 className="text-[15px] font-bold">Member undertaking</h2>
          </div>
          <span className="text-[11px] text-gray-500 text-right">
            {moment().format("D MMM YYYY")}
            {planName && (
              <span className="block font-semibold text-gray-700 dark:text-foreground truncate max-w-[140px]">
                {planName}
              </span>
            )}
          </span>
        </header>

        <div className="px-4 py-4 text-[13px] leading-[170%]">
          <p className="mb-3">
            I, <span className="font-semibold">{name || "the member"}</span>,
            agree to the following:
          </p>
          <ol className="flex flex-col gap-2.5">
            {declarations.map((d, i) => (
              <li key={d.title} className="flex gap-3 rounded-[14px] bg-white dark:bg-muted border border-gray-200/80 dark:border-border p-3">
                <span className="size-8 rounded-full bg-default/10 inline-flex items-center justify-center shrink-0">
                  {React.createElement(d.icon, { size: 17, color: "var(--color-default)", variant: "Bold" })}
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    {i + 1}. {d.title}
                  </p>
                  <p className="text-gray-800 dark:text-foreground mt-0.5">{d.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <footer className="grid grid-cols-2 gap-4 px-4 pb-4">
          <div>
            <p
              className={`font-[cursive] italic text-[20px] leading-tight truncate text-gray-900 dark:text-foreground transition-opacity ${
                acceptedUndertaking ? "opacity-100" : "opacity-25"
              }`}
            >
              {name || "Your name"}
            </p>
            <p className="border-t border-gray-300 dark:border-border mt-1 pt-1 text-[10px] uppercase tracking-wider text-gray-500">
              Signature
            </p>
          </div>
          <div>
            <p className="text-[14px] font-semibold leading-tight pt-1.5">
              {moment().format("DD/MM/YYYY")}
            </p>
            <p className="border-t border-gray-300 dark:border-border mt-1 pt-1 text-[10px] uppercase tracking-wider text-gray-500">
              Date
            </p>
          </div>
        </footer>
      </article>

      {/* Consent */}
      <label className={checkboxClass}>
        <input
          type="checkbox"
          checked={acceptedUndertaking}
          onChange={(e) => setAcceptedUndertaking(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--color-default)]"
        />
        <span>I have read this undertaking and I sign it as {name || "myself"}.</span>
      </label>
      <label className={checkboxClass}>
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 accent-[var(--color-default)]"
        />
        <span>
          I also agree to the{" "}
          <Link href={TERMS} target="_blank" className="text-default underline font-semibold">
            terms and conditions
          </Link>{" "}
          of the company.
        </span>
      </label>

      <Button
        label={
          acceptedUndertaking && acceptedTerms
            ? `Agree & pay ${FormatNumber.ngnAmount(total)}`
            : "Tick both boxes to continue"
        }
        color="black"
        fullRadius
        disabled={!acceptedUndertaking || !acceptedTerms}
        size="lg"
        fullWidth
        onClick={subscribeToPlan}
        loading={subscribeStatus.isLoading}
      />
      <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 dark:text-muted-foreground">
        <Lock1 size={12} color="currentColor" variant="Bold" />
        You&apos;ll be taken to Paystack to pay securely.
      </p>
    </div>
  );
};
export default RenewSubPage;
