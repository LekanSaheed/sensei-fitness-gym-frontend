"use client";

import Alert from "@/components/alert";
import Button from "@/components/button";
import DialogModal from "@/components/dialog-modal";
import Input from "@/components/input";
import Table, { ColumnProps } from "@/components/table";
import TextArea from "@/components/textarea";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import useStateReducer from "@/hooks/useStateReducer";
import {
  useAdminGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
} from "@/redux/api-slices/admin.slice";
import { ISubscriptionPlan } from "@/redux/api-slices/subscription.slice";
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
  const { state, handleStateChange } = useStateReducer<EditablePlanFields>({
    description: "",
    durationInDays: "" as any,
    name: "",
    price: "" as any,
    trainerFee: "" as any,
  });

  const disabled = Object.entries(state).some((s) => !s[1]);

  const [create, createStatus] = useCreatePlanMutation();

  const createPlan = async () => {
    const res = await create({ ...state, isActive: true });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData = res.error.data as ErrorResponse;

      toast.error(errorData?.error || DEFAULT_ERROR_MESSAGE);
    } else {
      const response = res?.data;

      if (response?.success) {
        toast.success(response?.message || "Successful");
        setOpen(false);
      } else {
        toast.error(response?.error || DEFAULT_ERROR_MESSAGE);
      }
    }
  };
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
        <Input
          placeholder="Plan duration"
          label={"Plan Duration (In Days)"}
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
        <Alert
          title="Create Subscription Plan?"
          description="Are you sure you want to create this subscription plan?"
          onContinueClick={createPlan}
          loading={createStatus.isLoading}
          alertTrigger={
            <Button
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
  "description" | "durationInDays" | "name" | "price" | "trainerFee"
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
    const res = await update({ id: selectedPlan?._id!, payload: state });

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
