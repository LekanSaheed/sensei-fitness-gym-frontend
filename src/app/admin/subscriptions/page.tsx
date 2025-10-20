"use client";

import Alert from "@/components/alert";
import Button from "@/components/button";
import DialogModal from "@/components/dialog-modal";
import Input from "@/components/input";
import SectionLoader from "@/components/SectionLoader";
import Select, { SelectDropdownOption } from "@/components/select";
import Table, { ColumnProps } from "@/components/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";
import useDebounceValue from "@/hooks/useDebounce";
import useStateReducer from "@/hooks/useStateReducer";
import {
  useActivateMemberSubMutation,
  useGetMembersQuery,
  useGetMembersSubscriptionsQuery,
  UserWithSub,
} from "@/redux/api-slices/admin.slice";
import {
  SubscriptionStatus,
  useGetPlansQuery,
} from "@/redux/api-slices/subscription.slice";
import { ErrorResponse } from "@/types";
import {
  collocateMemberName,
  defaultPageSize,
  getInitials,
  isFetchBaseQueryError,
  onlyFieldsWithValue,
} from "@/utils";
import FormatNumber from "@/utils/format-number";
import { CloseCircle, InfoCircle, User } from "iconsax-react";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const SubscriptionsPage = () => {
  const searchParams = useSearchParams();

  const page = searchParams.get("page") || "1";

  const limit = searchParams.get("pageSize") || String(defaultPageSize);

  const statusFilter = searchParams.get("statusFilter") || "";

  const { isError, isLoading, isFetching, data, refetch } =
    useGetMembersSubscriptionsQuery(
      onlyFieldsWithValue({ page, limit, statusFilter })
    );

  const pageProps = data?.data;

  const rows = pageProps?.data || [];

  const paginationInfo = pageProps?.paginationInfo;

  const columns: ColumnProps[] = [
    { label: "Member Name", field: "memberName" },
    { label: "Plan Name", field: "planNameSnapshot" },
    { label: "Status", field: "status" },
    { label: "Plan Duration", field: "dur" },
    { label: "Includes Trainer", field: "hasTrainer" },
    { label: "Payment Mode", field: "paymentMode" },
    { label: "Start Date", field: "startDate", fieldType: "date" },
    { label: "End Date", field: "endDate", fieldType: "date" },
    {
      label: "Subscription Fee",
      field: "planBasePriceSnapshot",
      fieldType: "currency",
    },
    {
      label: "Trainer Fee",
      field: "trainerFeeSnapshot",
      fieldType: "currency",
    },
    {
      label: "Total Amount",
      field: "totalAmount",
      fieldType: "currency",
    },
    {
      label: "Payment Reference",
      field: "paymentRef",
    },
  ];

  const statusClass: Record<SubscriptionStatus, string> = {
    expired: "bg-rose-500",
    canceled: "bg-gray-500",
    active: "bg-emerald-500",
  };

  const [open, setOpen] = useState(false);
  return (
    <div>
      <Table
        columns={columns}
        totalRecords={paginationInfo?.totalPages || 0}
        loading={isLoading || isFetching}
        error={isError}
        refetch={refetch}
        filters={[
          {
            keyName: "statusFilter",
            options: [
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Expired", value: "expired" },
              { label: "Canceled", value: "canceled" },
            ],
            title: "Status",
            classNames: {
              trigger: "w-[130px]",
            },
          },
        ]}
        rows={rows.map((row, id) => {
          const user = row?.user;
          return {
            ...row,
            id,
            memberName: `${user?.firstname} ${user?.lastname}`,
            dur: `${row?.planDurationInDaysSnapshot} day${
              row?.planDurationInDaysSnapshot > 1 ? "s" : ""
            }`,
            hasTrainer: row?.includesTrainer ? "Yes" : "No",
            status: (
              <div className="inline-flex items-center">
                <div
                  className={`size-[10px] rounded-full mr-1 shrink-0 ${
                    statusClass[row?.status]
                  }`}
                />
                <span className="">{row?.status}</span>
              </div>
            ),
          };
        })}
        customNode={
          <Button
            label={"Activate member's subscription"}
            color="black"
            size="sm"
            onClick={() => setOpen(true)}
          />
        }
      />
      <ActivateMemberSubModal open={open} setOpen={setOpen} />
    </div>
  );
};

const ActivateMemberSubModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (bool: boolean) => void;
}) => {
  const { handleStateChange, state } = useStateReducer<{
    searchQuery: string;
    selectedMember: UserWithSub | null;
    selectedPlan: SelectDropdownOption | null;
    includesTrainer: boolean;
  }>({
    searchQuery: "",
    selectedMember: null,
    selectedPlan: null,
    includesTrainer: false,
  });

  const debouncedSearchValue = useDebounceValue(state.searchQuery, 500);

  const { data, isLoading, isFetching, isError, refetch } = useGetMembersQuery(
    { limit: 1000, page: 1, search: debouncedSearchValue },
    { skip: !debouncedSearchValue }
  );

  const members = data?.data?.data || [];

  const loading = isLoading || isFetching;

  const noMember = debouncedSearchValue && members.length < 1 && !isError;

  const disabled =
    !state.selectedMember ||
    state.selectedMember?.latestSubscription?.status === "active" ||
    !state.selectedPlan;

  const [activate, activateStatus] = useActivateMemberSubMutation();

  const getPlans = useGetPlansQuery(null);

  const plansLoading = getPlans.isLoading || getPlans.isFetching;

  const plansError = getPlans.isError;

  const plans = getPlans.data?.data?.plans || [];

  const plansOptions: SelectDropdownOption[] = plans.map((plan) => ({
    label: `${plan.name} - ${FormatNumber.ngnAmount(plan?.price)}`,
    value: plan.name,
    externalId: plan?._id,
  }));

  const checkUserIn = async () => {
    const res = await activate({
      userId: state?.selectedMember?._id!,
      includesTrainer: state.includesTrainer,
      planId: state.selectedPlan?.externalId,
    });

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

  const BooleanOptions: SelectDropdownOption[] = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const RawSelectedPlan = plans.find(
    (p) => p?._id === state?.selectedPlan?.externalId
  );

  const hasTrainer = (RawSelectedPlan?.trainerFee || 0) > 0;

  if (!open) return <></>;

  return (
    <DialogModal
      title="Select a member"
      description="Select a member you want to activate"
      open={open}
      setOpen={setOpen}
    >
      <Select
        options={plansOptions}
        label="Select a membership plan"
        loading={plansLoading}
        onSelect={(option) =>
          handleStateChange({ selectedPlan: option, includesTrainer: false })
        }
        selected={state.selectedPlan!}
      />
      {hasTrainer && (
        <Select
          selected={BooleanOptions.find(
            (o) => o?.value === state.includesTrainer
          )}
          label="Include Trainer?"
          options={BooleanOptions}
          onSelect={(o) => handleStateChange({ includesTrainer: o?.value })}
        />
      )}
      <Input
        value={state.searchQuery}
        onChange={(e) =>
          handleStateChange({
            searchQuery: e.target.value,
            selectedMember: null,
          })
        }
        label={"Member name, username or email"}
        placeholder="Member name, username or email address"
      />

      <SectionLoader loading={loading} error={isError} refetch={refetch} />
      {(noMember || !debouncedSearchValue) && !loading && !isError && (
        <Empty className="border border-gray-400">
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <User color="#222" />
            </EmptyMedia>
            <EmptyTitle>
              {noMember ? "No Member" : "Search for a member"}
            </EmptyTitle>
            <EmptyDescription>
              {noMember
                ? "No member matches your search"
                : "Start by searching for a member in the input box"}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
      {!noMember && !loading && !isError && !!debouncedSearchValue && (
        <div className="min-h-[200px] max-h-[570px] overflow-y-auto">
          <ItemGroup>
            {members.map((member, id) => {
              const isSelected = member?._id === state.selectedMember?._id;

              const memberSub = member?.latestSubscription;
              return (
                <Item
                  onClick={() => {
                    handleStateChange({ selectedMember: member });
                  }}
                  size={"sm"}
                  key={id}
                  variant={"outline"}
                  className="cursor-pointer hover:bg-gray-50 mb-2"
                >
                  <ItemMedia>
                    <Avatar className="size-10">
                      <AvatarFallback>
                        {getInitials(collocateMemberName(member))}
                      </AvatarFallback>
                    </Avatar>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      {collocateMemberName(member)}
                      <span className="text-[10px]">- @{member?.username}</span>
                    </ItemTitle>
                    <ItemDescription className="text-[10px]">
                      {member?.email}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <div
                      className={`border flex items-center justify-center shrink-0 border-default rounded-full size-[20px]`}
                    >
                      {isSelected && (
                        <div className="bg-default size-[14px] rounded-full" />
                      )}
                    </div>
                  </ItemActions>
                  {/* <ITem */}
                  {isSelected && (
                    <ItemFooter className="w-full">
                      {memberSub ? (
                        <div className="border-t mt-2 pt-2 w-full">
                          <h3 className="text-[10px] text-gray-700 ">
                            Current subscription
                          </h3>
                          <div className="flex justify-between mb-2">
                            <h1 className="font-semibold text-[14px]">
                              {memberSub?.planNameSnapshot}
                            </h1>
                            <div
                              className={`capitalize text-[12px] rounded-[4px] px-2 py-0.5 ${
                                memberSub?.status === "active"
                                  ? "text-emerald-600 bg-emerald-500/10"
                                  : "text-rose-600 bg-rose-500/10"
                              }`}
                            >
                              {memberSub?.status}
                            </div>
                          </div>
                          <p className="text-gray-500 flex items-center gap-1.5 mt-1 text-[12px]">
                            {memberSub?.status === "active" ? (
                              <>
                                {" "}
                                <InfoCircle
                                  size={15}
                                  color="var(--color-amber-500)"
                                />{" "}
                                {member?.firstname} has an active subscription
                              </>
                            ) : (
                              <>
                                Subscription has expired for {member?.firstname}
                              </>
                            )}
                          </p>
                        </div>
                      ) : (
                        <Item
                          size={"sm"}
                          variant={"outline"}
                          className="text-gray-700"
                        >
                          {member?.firstname} has not subscribed to any plan yet
                        </Item>
                      )}
                    </ItemFooter>
                  )}
                </Item>
              );
            })}
          </ItemGroup>
        </div>
      )}
      <Alert
        title={
          state?.selectedMember?.latestSubscription
            ? "Renew Membership?"
            : "Activate Membership?"
        }
        description={`Are you sure you want to ${
          state?.selectedMember?.latestSubscription ? "renew" : "activate "
        } membership for ${state?.selectedMember?.firstname}?`}
        alertTrigger={
          <Button
            color="black"
            label={
              state?.selectedMember?.latestSubscription
                ? "Renew Membership"
                : "Activate Membership"
            }
            fullWidth
            className="mt-2"
            disabled={disabled}
            loading={activateStatus.isLoading}
          />
        }
        onContinueClick={checkUserIn}
        loading={activateStatus.isLoading}
      />
    </DialogModal>
  );
};

export default SubscriptionsPage;
