"use client";

import Alert from "@/components/alert";
import Button from "@/components/button";
import DialogModal from "@/components/dialog-modal";
import Input from "@/components/input";
import Select, { SelectDropdownOption } from "@/components/select";
import SelectInput from "@/components/select-input";
import Table, { ColumnProps } from "@/components/table";
import TextArea from "@/components/textarea";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import useStateReducer from "@/hooks/useStateReducer";
import {
  useAdminGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
} from "@/redux/api-slices/admin.slice";
import {
  WeekDay,
  ISubscriptionPlan,
  PlanType,
} from "@/redux/api-slices/subscription.slice";
import { ErrorResponse } from "@/types";
import { isFetchBaseQueryError } from "@/utils";
import React, { FunctionComponent, useState } from "react";
import FormatNumber from "@/utils/format-number";
import {
  CalendarTick,
  Icon,
  ReceiptAdd,
  ReceiptEdit,
  Timer1,
  UserTick,
} from "iconsax-react";
import moment from "moment";
import toast from "react-hot-toast";

const PlansPage = () => {
  const { isError, isLoading, isFetching, refetch, data } =
    useAdminGetPlansQuery(undefined);

  const plans = data?.data || [];

  const columns: ColumnProps[] = [
    { label: "Plan", field: "planCell" },
    { label: "Price", field: "priceCell" },
    { label: "Trainer", field: "trainerCell" },
    { label: "Plan Type", field: "planType" },
    { label: "Duration", field: "durationCell" },
    { label: "Updated", field: "updatedCell" },
  ];

  const [selected, setSelected] = useState("");

  const selectedPlan = plans.find((p) => p?._id === selected);

  const [open, setOpen] = useState(false);

  return (
    <div>
      <Table
        customNode={
          <Button
            size="sm"
            label="Create new plan"
            permissions={["create_subscription_plan"]}
            color="black"
            onClick={() => setOpen(true)}
          />
        }
        onRowClick={(row) => {
          setSelected(row._id);
        }}
        showSearch={false}
        loading={isLoading || isFetching}
        error={isError}
        refetch={refetch}
        totalRecords={plans?.length}
        columns={columns}
        rows={plans.map((plan, id) => {
          return {
            id,
            ...plan,
            planCell: <PlanNameCell plan={plan} />,
            priceCell: (
              <div>
                <p className="font-semibold text-gray-900 tabular-nums">
                  {FormatNumber.ngnAmount(plan.price)}
                </p>
                {(plan.trainerFee || 0) > 0 && (
                  <p className="text-[11px] text-gray-500 tabular-nums">
                    {FormatNumber.ngnAmount(plan.price + plan.trainerFee)} with
                    trainer
                  </p>
                )}
              </div>
            ),
            trainerCell:
              (plan.trainerFee || 0) > 0 ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-semibold text-gray-800 tabular-nums">
                  <UserTick size={13} color="currentColor" variant="Bold" />+
                  {FormatNumber.ngnAmount(plan.trainerFee)}
                </span>
              ) : (
                <span className="text-[12px] text-gray-400">Not offered</span>
              ),
            planType: <PlanTypeCell plan={plan} />,
            durationCell: <DurationCell days={plan.durationInDays} />,
            updatedCell: (
              <div className="text-[12px]">
                <p className="text-gray-800">
                  {plan.updatedAt ? moment(plan.updatedAt).fromNow() : "—"}
                </p>
                {plan.createdAt && (
                  <p className="text-gray-400">
                    Created {moment(plan.createdAt).format("D MMM YYYY")}
                  </p>
                )}
              </div>
            ),
          };
        })}
      />
      <UpdatePlan
        selectedPlan={selectedPlan}
        open={!!selected}
        setOpen={() => setSelected("")}
      />
      <CreateNewPlan open={open} setOpen={setOpen} />
    </div>
  );
};

const WEEK: WeekDay[] = [
  WeekDay.Monday,
  WeekDay.Tuesday,
  WeekDay.Wednesday,
  WeekDay.Thursday,
  WeekDay.Friday,
  WeekDay.Saturday,
  WeekDay.Sunday,
];

/** Name, one-line description and a badge when members can't buy it */
const PlanNameCell = ({ plan }: { plan: ISubscriptionPlan }) => (
  <div className="max-w-[260px]">
    <div className="flex items-center gap-2">
      <p className="font-semibold text-gray-900 truncate">{plan.name}</p>
      {plan.isActive === false && (
        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
          Hidden
        </span>
      )}
    </div>
    {plan.description && (
      <p className="text-[11px] text-gray-500 truncate" title={plan.description}>
        {plan.description}
      </p>
    )}
  </div>
);

/** 30 -> "30 days" with "1 month" underneath */
const DurationCell = ({ days }: { days: number }) => {
  const approx =
    days % 365 === 0
      ? `${days / 365} year${days / 365 === 1 ? "" : "s"}`
      : days % 30 === 0 && days >= 30
      ? `${days / 30} month${days / 30 === 1 ? "" : "s"}`
      : days % 7 === 0 && days >= 7
      ? `${days / 7} week${days / 7 === 1 ? "" : "s"}`
      : days >= 28
      ? `about ${Math.round(days / 30)} month${Math.round(days / 30) === 1 ? "" : "s"}`
      : null;

  return (
    <div>
      <p className="font-semibold text-gray-900 tabular-nums">
        {days} day{days === 1 ? "" : "s"}
      </p>
      {approx && <p className="text-[11px] text-gray-500">{approx}</p>}
    </div>
  );
};

/**
 * Linear: a badge saying members can come any day.
 * Session based: the limits plus a Mon-Sun strip with the allowed days lit.
 */
const PlanTypeCell = ({ plan }: { plan: ISubscriptionPlan }) => {
  if (plan.type !== PlanType.SessionBased) {
    return (
      <div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[12px] font-semibold text-sky-700">
          <CalendarTick size={14} color="currentColor" variant="Bold" />
          Linear
        </span>
        <p className="text-[11px] text-gray-500 mt-1">Check in any day</p>
      </div>
    );
  }

  const allowed = new Set(plan.allowedDays || []);

  return (
    <div className="min-w-[190px]">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[12px] font-semibold text-violet-700">
        <Timer1 size={14} color="currentColor" variant="Bold" />
        Session based
      </span>
      <div className="flex flex-wrap gap-1.5 mt-1.5 text-[11px]">
        <span className="rounded-[6px] bg-gray-100 px-1.5 py-0.5 font-semibold text-gray-700 tabular-nums">
          {plan.checkInsPerWeek ?? "—"}× a week
        </span>
        <span className="rounded-[6px] bg-gray-100 px-1.5 py-0.5 font-semibold text-gray-700 tabular-nums">
          {plan.totalCheckIns ?? "—"} check-ins total
        </span>
      </div>
      <div
        className="flex gap-1 mt-1.5"
        aria-label={`Allowed days: ${[...allowed].join(", ") || "none"}`}
      >
        {WEEK.map((day) => {
          const on = allowed.has(day);

          const startsWeek = plan.weekStart === day;

          return (
            <span
              key={day}
              title={`${day}${on ? " (allowed)" : ""}${startsWeek ? " · week starts" : ""}`}
              className={`size-7 rounded-full inline-flex items-center justify-center text-[10px] font-bold ${
                on ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {day.slice(0, 2)}
            </span>
          );
        })}
      </div>
      {plan.weekStart && (
        <p className="text-[11px] text-gray-500 mt-1">
          Week starts {plan.weekStart}
        </p>
      )}
    </div>
  );
};

/** Titled group of fields inside the plan modals */
const FormSection: FunctionComponent<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <section className="mb-6 last:mb-0">
    <div className="mb-3">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-default-secondary">
        {title}
      </h3>
      {description && (
        <p className="text-[12px] text-gray-500 mt-0.5">{description}</p>
      )}
    </div>
    {children}
  </section>
);

const planTypeCards: {
  value: PlanType;
  title: string;
  description: string;
  icon: Icon;
}[] = [
  {
    value: PlanType.Linear,
    title: "Linear",
    description: "Check in any day until the plan ends",
    icon: CalendarTick,
  },
  {
    value: PlanType.SessionBased,
    title: "Session based",
    description: "A set number of check-ins on chosen days",
    icon: Timer1,
  },
];

/** Live one-line summary shown above the main button */
const PlanSummary: FunctionComponent<{
  name?: string;
  price?: number | string;
  trainerFee?: number | string;
  days?: number | string;
}> = ({ name, price, trainerFee, days }) => (
  <div className="flex items-center justify-between gap-3 mb-3 text-[12px]">
    <span className="truncate text-gray-600">
      <span className="font-semibold text-gray-900">{name || "New plan"}</span>
      {days ? ` · ${days} day${Number(days) === 1 ? "" : "s"}` : ""}
    </span>
    <span className="shrink-0 font-semibold text-gray-900">
      {FormatNumber.ngnAmount(Number(price) || 0)}
      {Number(trainerFee) > 0 && (
        <span className="font-normal text-gray-500">
          {" "}
          + {FormatNumber.ngnAmount(Number(trainerFee))} trainer
        </span>
      )}
    </span>
  </div>
);

const CreateNewPlan: FunctionComponent<{
  open: boolean;
  setOpen: (bool: boolean) => void;
}> = ({ open, setOpen }) => {
  const defaultValues: EditablePlanFields = {
    description: "",
    durationInDays: "" as unknown as number,
    name: "",
    price: "" as unknown as number,
    trainerFee: "" as unknown as number,
    type: "" as unknown as PlanType,
    allowedDays: [],
    checkInsPerWeek: "" as unknown as number,
    totalCheckIns: "" as unknown as number,
    weekStart: "" as WeekDay,
  };

  const { state, handleStateChange } =
    useStateReducer<EditablePlanFields>(defaultValues);

  const { allowedDays, totalCheckIns, checkInsPerWeek, weekStart, ...s } =
    state;

  const disabled = Object.entries(
    state.type === PlanType.SessionBased ? state : s,
  ).some((s) => !s[1]);

  const [create, createStatus] = useCreatePlanMutation();

  const planTypeOptions: SelectDropdownOption[] = [
    { label: "Linear", value: PlanType.Linear },
    { label: "Session Based", value: PlanType.SessionBased },
  ];

  const rawSelectedType = planTypeOptions.find((t) => t.value === state.type);

  const createPlan = async () => {
    const getPayload = (): Partial<EditablePlanFields> => {
      if (state.type === PlanType.SessionBased) {
        return {
          ...state,
          checkInsPerWeek: +(state.checkInsPerWeek || 0),
          totalCheckIns: +(state.totalCheckIns || 0),
        };
      } else {
        return s;
      }
    };

    if (state.type === PlanType.SessionBased) {
      if (
        state.checkInsPerWeek &&
        +state.checkInsPerWeek > state.allowedDays.length
      ) {
        return toast.error(
          "Checkins per week cannot be more than allowed days. Set it to something less or add more days to the allowed days",
        );
      }

      if (state.checkInsPerWeek && state.totalCheckIns) {
        if (+state.checkInsPerWeek > +state.totalCheckIns) {
          return toast.error(
            "Checkins per week cannot be more than total checkins",
          );
        }
      } else {
        return toast.error("Checkins per week and total checkins are required");
      }

      if (!state.weekStart) return toast.error("Please select a week start");
    }
    const res = await create({
      ...getPayload(),
      isActive: true,
    });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res?.data;

      if (response?.success) {
        toast.success(response?.message || "Successful");
        setOpen(false);
        handleStateChange(defaultValues);
        await fetch("/admin/api/revalidate?tag=plans");
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  const allowedDaysOptions: SelectDropdownOption[] = Object.entries(
    WeekDay,
  ).map((day) => ({ label: day[0], value: day[1] }));

  const weekStartOptions: SelectDropdownOption[] = [
    { label: WeekDay.Sunday, value: WeekDay.Sunday },
    { label: WeekDay.Monday, value: WeekDay.Monday },
  ];

  const selectedWeekStart = weekStartOptions.find(
    (w) => w.value === state.weekStart,
  );
  return (
    <DialogModal
      title="Create Subscription Plan"
      description="Fill out the form below to create a new plan"
      icon={ReceiptAdd}
      size="md"
      open={open}
      setOpen={setOpen}
      footer={
        <>
          <PlanSummary
            name={state.name}
            price={state.price}
            trainerFee={state.trainerFee}
            days={state.durationInDays}
          />
          <Alert
            title="Create Subscription Plan?"
            description="Are you sure you want to create this subscription plan?"
            onContinueClick={createPlan}
            loading={createStatus.isLoading}
            alertTrigger={
              <Button
                permissions={["create_subscription_plan"]}
                disabled={disabled}
                type="button"
                fullWidth
                fullRadius
                size="lg"
                label="Create Plan"
                loading={createStatus.isLoading}
              />
            }
          />
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <FormSection title="Basics">
          <Input
            value={state.name}
            onChange={(e) => handleStateChange({ name: e.target.value })}
            required
            label={"Plan Name"}
            placeholder="e.g. Monthly plan"
          />
          <TextArea
            value={state.description}
            onChange={(e) => handleStateChange({ description: e.target.value })}
            required
            label="Description"
            placeholder="What members get with this plan"
          />
        </FormSection>

        <FormSection title="Pricing">
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={state.price}
              onChange={(e) =>
                handleStateChange({
                  price: e.target.value as unknown as number,
                })
              }
              remove_margin
              isCurrency
              placeholder="1000"
              type="number"
              inputMode="numeric"
              label={"Subscription Fee"}
              required
            />
            <Input
              value={state.trainerFee}
              info="Leave as 0 if it does not apply to plan"
              onChange={(e) =>
                handleStateChange({
                  trainerFee: e.target.value as unknown as number,
                })
              }
              remove_margin
              isCurrency
              placeholder="0"
              type="number"
              inputMode="numeric"
              label={"Trainer Fee"}
            />
          </div>
        </FormSection>

        <FormSection title="Plan Type">
          <div
            role="radiogroup"
            aria-label="Plan Type"
            className="grid grid-cols-2 gap-3"
          >
            {planTypeCards.map((card) => {
              const selected = state.type === card.value;

              return (
                <button
                  key={card.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => handleStateChange({ type: card.value })}
                  className={`text-left rounded-[14px] border-2 p-3.5 transition ${
                    selected
                      ? "border-default bg-default/[0.06]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span
                    className={`size-9 rounded-[10px] inline-flex items-center justify-center mb-2 ${
                      selected ? "bg-default" : "bg-gray-100"
                    }`}
                  >
                    {React.createElement(card.icon, {
                      size: 18,
                      variant: "Bold",
                      color: selected
                        ? "var(--color-white)"
                        : "var(--color-gray-500)",
                    })}
                  </span>
                  <span className="block text-[13px] font-semibold">
                    {card.title}
                  </span>
                  <span className="block text-[11px] text-gray-500 leading-snug mt-0.5">
                    {card.description}
                  </span>
                </button>
              );
            })}
          </div>

          {state.type === PlanType.SessionBased && (
            <div className="mt-4 rounded-[16px] bg-gray-50 border border-gray-100 p-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={"Check-ins Per week"}
                  max={6}
                  value={state.checkInsPerWeek}
                  onChange={(e) => {
                    handleStateChange({
                      checkInsPerWeek: e.target.value as unknown as number,
                    });
                  }}
                  required
                  info="The number of days a member can check-in in a week"
                  type="number"
                  inputMode="numeric"
                />
                <Input
                  label={"Total check-ins"}
                  value={state.totalCheckIns}
                  onChange={(e) => {
                    handleStateChange({
                      totalCheckIns: e.target.value as unknown as number,
                    });
                  }}
                  required
                  info="The total number of days a member can check-in for"
                  type="number"
                  inputMode="numeric"
                />
              </div>

              <Select
                multi
                onMultiSelect={(options) =>
                  handleStateChange({
                    allowedDays: options.map((o) => o.value as WeekDay),
                  })
                }
                info={`A member will be allowed to check-in for ${
                  state.checkInsPerWeek || "n"
                } times only across any of these days`}
                label="Allowed Days"
                multipleSelected={state.allowedDays
                  .map((day) => {
                    const optionObject = allowedDaysOptions.find(
                      (allowedDay) => allowedDay.value === day,
                    );

                    return optionObject as SelectDropdownOption;
                  })
                  .filter(Boolean)}
                options={allowedDaysOptions}
              />
              <Select
                label="Week Start"
                info="Select when the week starts"
                options={weekStartOptions}
                onSelect={(o) =>
                  handleStateChange({ weekStart: o.value as WeekDay })
                }
                selected={selectedWeekStart}
                remove_margin
              />
            </div>
          )}
        </FormSection>

        <FormSection title="Validity">
          <Input
            placeholder="e.g. 30"
            label={"Plan Duration or Validity (In Days)"}
            required
            type="number"
            inputMode="numeric"
            remove_margin
            value={state.durationInDays}
            onChange={(e) =>
              handleStateChange({
                durationInDays: e.target.value as unknown as number,
              })
            }
          />
        </FormSection>
      </form>
    </DialogModal>
  );
};

export type EditablePlanFields = Pick<
  ISubscriptionPlan,
  | "description"
  | "durationInDays"
  | "name"
  | "price"
  | "trainerFee"
  | "type"
  | "allowedDays"
  | "checkInsPerWeek"
  | "totalCheckIns"
  | "weekStart"
>;

type PlanKey = keyof EditablePlanFields;

const UpdatePlan: FunctionComponent<{
  open: boolean;
  setOpen: (bool: boolean) => void;
  selectedPlan: ISubscriptionPlan | undefined;
}> = ({ open, setOpen, selectedPlan }) => {
  const { state, handleStateChange, setState } = useStateReducer<
    Partial<EditablePlanFields>
  >({});

  const getField = (keyName: PlanKey) => {
    return (keyName in state ? state[keyName] : selectedPlan?.[keyName]) || "";
  };

  const disabled =
    Object.entries(state).some((a) => !a[1]) ||
    Object.entries(state).length < 1 ||
    Object.entries(state).every(
      (entry) => entry[1] == selectedPlan?.[entry[0] as PlanKey],
    );

  const [update, updateStatus] = useUpdatePlanMutation();

  const updatePlan = async () => {
    const res = await update({ id: selectedPlan?._id || "", payload: state });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res?.data;

      if (response?.success) {
        toast.success(response?.message || "Successful");
        setOpen(false);
        setState({});
        await fetch("/admin/api/revalidate?tag=plans");
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  const type = selectedPlan?.type;

  const selectedDays = (getField("allowedDays") || []) as WeekDay[];

  const selectedAllowedDaysOptions = selectedDays.map((day) => {
    const optionObject = Object.entries(WeekDay).find(
      (entry) => entry[1] === day,
    );

    if (!optionObject) return;

    return {
      label: optionObject[0],
      value: optionObject[1],
    };
  });

  const allowedDaysOptions: SelectDropdownOption[] = Object.entries(
    WeekDay,
  ).map((day) => ({ label: day[0], value: day[1] }));

  if (!selectedPlan) return null;

  const typeCard = planTypeCards.find((c) => c.value === type);

  return (
    <DialogModal
      title="Plan Details"
      description={`Edit ${selectedPlan.name}. Changes apply to new subscriptions.`}
      icon={ReceiptEdit}
      size="md"
      open={open}
      setOpen={(bool) => {
        setOpen(bool);

        setState({});
      }}
      footer={
        <>
          <PlanSummary
            name={getField("name") as string}
            price={getField("price") as number}
            trainerFee={getField("trainerFee") as number}
            days={getField("durationInDays") as number}
          />
          <Alert
            title="Update Subscription Plan?"
            description="Are you sure you want to update this plan?"
            onContinueClick={updatePlan}
            loading={updateStatus.isLoading}
            alertTrigger={
              <Button
                disabled={disabled}
                type="button"
                fullWidth
                fullRadius
                size="lg"
                label="Update Plan"
                loading={updateStatus.isLoading}
              />
            }
          />
        </>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {typeCard && (
          <div className="flex items-center gap-3 rounded-[14px] bg-gray-50 border border-gray-100 p-3 mb-6">
            <span className="size-9 rounded-[10px] bg-default inline-flex items-center justify-center shrink-0">
              {React.createElement(typeCard.icon, {
                size: 18,
                variant: "Bold",
                color: "var(--color-white)",
              })}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold">
                {typeCard.title} plan
              </p>
              <p className="text-[11px] text-gray-500">
                {typeCard.description}. The plan type can&apos;t be changed.
              </p>
            </div>
          </div>
        )}

        <FormSection title="Basics">
          <Input
            value={getField("name")}
            onChange={(e) => handleStateChange({ name: e.target.value })}
            required
            label={"Plan Name"}
            placeholder="Plan Name"
          />
          <TextArea
            value={getField("description")}
            onChange={(e) => handleStateChange({ description: e.target.value })}
            required
            label="Description"
            placeholder="Description"
          />
        </FormSection>

        <FormSection title="Pricing">
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={getField("price")}
              onChange={(e) =>
                handleStateChange({
                  price: e.target.value as unknown as number,
                })
              }
              remove_margin
              isCurrency
              placeholder="1000"
              type="number"
              inputMode="numeric"
              label={"Subscription Fee"}
              required
            />
            <Input
              value={getField("trainerFee")}
              onChange={(e) =>
                handleStateChange({
                  trainerFee: e.target.value as unknown as number,
                })
              }
              remove_margin
              isCurrency
              placeholder="0"
              type="number"
              inputMode="numeric"
              label={"Trainer Fee"}
            />
          </div>
        </FormSection>

        {type === PlanType.SessionBased && (
          <FormSection title="Sessions">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label={"Check-ins Per week"}
                max={6}
                value={getField("checkInsPerWeek")}
                onChange={(e) => {
                  handleStateChange({
                    checkInsPerWeek: e.target.value as unknown as number,
                  });
                }}
                required
                info="The number of days a member can check-in in a week"
                type="number"
                inputMode="numeric"
              />
              <Input
                label={"Total check-ins"}
                value={getField("totalCheckIns")}
                onChange={(e) => {
                  handleStateChange({
                    totalCheckIns: e.target.value as unknown as number,
                  });
                }}
                required
                info="The total number of days a member can check-in for"
                type="number"
                inputMode="numeric"
              />
            </div>
            <Select
              label="Allowed Days"
              multi
              options={allowedDaysOptions}
              multipleSelected={
                selectedAllowedDaysOptions as SelectDropdownOption[]
              }
              onMultiSelect={(options) => {
                handleStateChange({
                  allowedDays: options.map((o) => o.value as WeekDay),
                });
              }}
              remove_margin
            />
          </FormSection>
        )}

        <FormSection title="Validity">
          <Input
            placeholder="Plan duration"
            label={"Plan Duration (In Days)"}
            required
            type="number"
            inputMode="numeric"
            remove_margin
            value={getField("durationInDays")}
            onChange={(e) =>
              handleStateChange({
                durationInDays: e.target.value as unknown as number,
              })
            }
          />
        </FormSection>
      </form>
    </DialogModal>
  );
};

export default PlansPage;
