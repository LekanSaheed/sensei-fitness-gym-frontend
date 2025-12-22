"use client";

import Alert from "@/components/alert";
import Button from "@/components/button";
import DialogModal from "@/components/dialog-modal";
import Input from "@/components/input";
import Select, { SelectDropdownOption } from "@/components/select";
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
import toast from "react-hot-toast";

const PlansPage = () => {
  const { isError, isLoading, isFetching, refetch, data } =
    useAdminGetPlansQuery(undefined);

  const plans = data?.data || [];

  const columns: ColumnProps[] = [
    { label: "Plan Name", field: "name" },
    { field: "price", label: "Price", fieldType: "currency" },
    { field: "trainerFee", label: "Trainer Fee", fieldType: "currency" },
    { field: "planType", label: "Plan Type" },
    { field: "duration", label: "Duration In Days" },
    { field: "createdAt", fieldType: "date", label: "Date Created" },
    { field: "updatedAt", fieldType: "date", label: "Date Modified" },
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
            duration: `${plan?.durationInDays} Day${
              plan?.durationInDays > 1 ? "s" : ""
            }`,
            planType: (
              <div>
                <p>{plan?.type}</p>
                {plan?.type === PlanType.SessionBased && (
                  <>
                    <p>{plan?.checkInsPerWeek}x per week</p>
                    <p>{plan.totalCheckIns} total checkins</p>
                  </>
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
    state.type === PlanType.SessionBased ? state : s
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
          "Checkins per week cannot be more than allowed days. Set it to something less or add more days to the allowed days"
        );
      }

      if (state.checkInsPerWeek && state.totalCheckIns) {
        if (+state.checkInsPerWeek > +state.totalCheckIns) {
          return toast.error(
            "Checkins per week cannot be more than total checkins"
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
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  const allowedDaysOptions: SelectDropdownOption[] = Object.entries(
    WeekDay
  ).map((day) => ({ label: day[0], value: day[1] }));

  const weekStartOptions: SelectDropdownOption[] = [
    { label: WeekDay.Sunday, value: WeekDay.Sunday },
    { label: WeekDay.Monday, value: WeekDay.Monday },
  ];

  const selectedWeekStart = weekStartOptions.find(
    (w) => w.value === state.weekStart
  );
  return (
    <DialogModal
      title="Create Subscription Plan"
      description="Fill out the form below to create a new plan"
      open={open}
      setOpen={setOpen}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="max-h-[70vh] pr-4 -mr-4 overflow-y-auto">
          <Input
            value={state.name}
            onChange={(e) => handleStateChange({ name: e.target.value })}
            required
            label={"Plan Name"}
            placeholder="Plan Name"
          />
          <TextArea
            value={state.description}
            onChange={(e) => handleStateChange({ description: e.target.value })}
            required
            label="Description"
            placeholder="Description"
          />
          <div className="flex gap-4 mb-4">
            <Input
              value={state.price}
              onChange={(e) =>
                handleStateChange({
                  price: e.target.value as unknown as number,
                })
              }
              remove_margin
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
              placeholder="1000"
              type="number"
              inputMode="numeric"
              label={"Trainer Fee"}
            />
          </div>
          <Select
            options={planTypeOptions}
            label="Plan Type"
            selected={rawSelectedType}
            onSelect={(o) => handleStateChange({ type: o.value as PlanType })}
          />
          {state.type === PlanType.SessionBased && (
            <>
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
                      (allowedDay) => allowedDay.value === day
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
              />
            </>
          )}
          <Input
            placeholder="Plan duration"
            label={"Plan Duration or Validity (In Days)"}
            required
            type="number"
            inputMode="numeric"
            value={state.durationInDays}
            onChange={(e) =>
              handleStateChange({
                durationInDays: e.target.value as unknown as number,
              })
            }
          />
        </div>
        <Alert
          title="Create Subscription Plan?"
          description="Are you sure you want to create this subscription plan?"
          onContinueClick={createPlan}
          loading={createStatus.isLoading}
          alertTrigger={
            <Button
              permissions={["create_subscription_plan"]}
              disabled={disabled}
              type="submit"
              fullWidth
              label="Create Plan"
              loading={createStatus.isLoading}
            />
          }
        />
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
      (entry) => entry[1] == selectedPlan?.[entry[0] as PlanKey]
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
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };

  if (!selectedPlan) return null;

  return (
    <DialogModal
      title="Plan Details"
      open={open}
      setOpen={(bool) => {
        setOpen(bool);

        setState({});
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
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
        <div className="flex gap-4 mb-4">
          <Input
            value={getField("price")}
            onChange={(e) =>
              handleStateChange({ price: e.target.value as unknown as number })
            }
            remove_margin
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
            placeholder="1000"
            type="number"
            inputMode="numeric"
            label={"Trainer Fee"}
          />
        </div>
        <Input
          placeholder="Plan duration"
          label={"Plan Duration (In Days)"}
          required
          type="number"
          inputMode="numeric"
          value={getField("durationInDays")}
          onChange={(e) =>
            handleStateChange({
              durationInDays: e.target.value as unknown as number,
            })
          }
        />
        <Alert
          title="Update Subscription Plan?"
          description="Are you sure you want to update this plan?"
          onContinueClick={updatePlan}
          loading={updateStatus.isLoading}
          alertTrigger={
            <Button
              disabled={disabled}
              type="submit"
              fullWidth
              label="Update Plan"
              loading={updateStatus.isLoading}
            />
          }
        />
      </form>
    </DialogModal>
  );
};

export default PlansPage;
