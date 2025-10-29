"use client";

import {
  useGetPlansQuery,
  useSubscribeMutation,
} from "@/redux/api-slices/subscription.slice";
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
  return (
    <LayoutGroup>
      <div>
        <SectionLoader loading={loading} error={isError} refetch={refetch} />
        {plans.map((plan, id) => {
          const hasTrainerFee = plan?.trainerFee > 0;

          const isSelected = selectedPlan === plan._id;
          return (
            <motion.div
              layout
              key={id}
              className={`bg-white p-5 border border-gray-300 rounded-[15px] overflow-hidden mb-3 ${
                isSelected ? "!border-default" : ""
              }`}
              onClick={() => {
                setSelectedPlan(plan._id);
                setIncludeTrainer(false);
              }}
            >
              <motion.div layout>
                <div className="tracking-tight">
                  <h1 className="font-bold text-[18px] mb-1"> {plan?.name}</h1>
                  <p className="font-medium text-[14px] text-gray-500">
                    {" "}
                    {plan?.description}
                  </p>
                </div>
                <div
                  className={`pt-2 mt-2 border-t border-t-gray-300 ${
                    isSelected ? "!border-t-default" : ""
                  }`}
                >
                  <p className="flex justify-between items-end">
                    <span className="font-bold tracking-tighter text-default text-[30px]">
                      {" "}
                      {FormatNumber.ngnAmount(plan?.price)}
                    </span>{" "}
                    <span className="text-[14px]">
                      {plan.durationInDays} day
                      {plan.durationInDays > 1 ? "s" : ""}
                    </span>
                  </p>
                </div>
              </motion.div>

              <AnimatePresence mode="popLayout">
                {isSelected && hasTrainerFee && (
                  <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ type: "tween" }}
                    className="mt-2 bg-gray-50 border border-gray-200 rounded-[8px] p-3"
                  >
                    <label className="text-[14px]  inline-flex items-center">
                      <input
                        checked={includeTrainer}
                        onChange={(e) => setIncludeTrainer(e.target.checked)}
                        type="checkbox"
                        className="size-[20px] mr-2"
                      />
                      <span>
                        Trainer add-on (
                        {FormatNumber.ngnAmount(plan.trainerFee)})
                      </span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        <div className="fixed px-4 bottom-[20px] right-0 left-0 ">
          <Button
            disabled={!selectedPlan}
            size="lg"
            label="Proceed"
            fullWidth
            onClick={() => setOpenModal(true)}
          />
        </div>
      </div>
      <Modal
        isBack={view !== "main"}
        onBack={() => setView("main")}
        onClose={() => setView("main")}
        title="Confirm Details"
        open={openModal}
        setOpen={setOpenModal}
      >
        {view === "main" && (
          <>
            <div className="flex gap-2 border border-gray-300 p-4 rounded-[14px] mb-2">
              <div className="flex-1">
                <h2 className="font-bold">{RawSelectedPlan?.name}</h2>
                <p className="text-[13px] text-gray-500">
                  {RawSelectedPlan?.description}
                </p>
                {includeTrainer && (
                  <p className="text-[12px] border border-default text-default px-2 py-1 w-fit rounded-[10px] mt-1">
                    Trainer included
                  </p>
                )}
              </div>
              <div className="size-[70px] rounded-[16px] shrink-0 bg-black text-center p-0.5 text-white">
                <p className="border border-white border-b-0 rounded-t-[14px] pt-2 mb-1 text-[18px] font-bold">
                  {RawSelectedPlan?.durationInDays}
                </p>
                <p className="uppercase text-[10px] font-light">
                  Day{(RawSelectedPlan?.durationInDays || 0) > 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-[14px] border border-gray-300 mb-4">
              <h2 className="text-[14px] mb-3 font-semibold">
                Payment Summary
              </h2>
              <ul>
                {feesThatApply.map((fee) => {
                  return (
                    <li
                      key={fee.label}
                      className="flex justify-between text-[14px] mb-2 "
                    >
                      <span className="text-[#949494]">{fee?.label}</span>
                      <span className="font-semibold">
                        {FormatNumber.ngnAmount(fee?.amount)}
                      </span>
                    </li>
                  );
                })}
                <li className="flex justify-between text-[14px]  border-t pt-2 border-t-gray-300">
                  <span className="text-[#949494]">Total</span>
                  <span className="font-semibold">
                    {FormatNumber.ngnAmount(totalAmount)}
                  </span>
                </li>
              </ul>
            </div>
            <Button
              label="Proceed"
              color="black"
              fullRadius
              size="lg"
              fullWidth
              onClick={() => setView("undertaking")}
            />
          </>
        )}
        {view === "undertaking" && (
          <UnderTaking
            includeTrainer={includeTrainer}
            selectedPlan={selectedPlan}
          />
        )}
      </Modal>
    </LayoutGroup>
  );
};

const UnderTaking: FunctionComponent<{
  includeTrainer: boolean;
  selectedPlan: string;
}> = ({ includeTrainer, selectedPlan }) => {
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
  return (
    <div className="text-[14px]">
      <p>
        {" "}
        I, <span className="font-semibold">{user?.fullname}</span>, agree to the
        terms below
      </p>
      <br />
      <h2 className="font-bold text-[16px] mb-2">Undertaking</h2>
      <p className="text-justify mb-4 leading-[180%]">
        {" "}
        By subscribing to be a member in SEN-SEI FITNESS, I am fully aware of my
        health status and I hereby agree that my health status permits me to
        exercise.
        <br />
        <br /> I release SEN-SEI FITNESS of any liability relating to injury or
        death during my period of exercising. <br />
        <br />
        I, {user?.fullname}, agree to the terms. <br /> Signature:{" "}
        {user?.fullname}
      </p>
      <Button
        label="Agree & Proceed to payment"
        color="black"
        fullRadius
        size="lg"
        fullWidth
        onClick={subscribeToPlan}
        loading={subscribeStatus.isLoading}
      />
    </div>
  );
};
export default RenewSubPage;
