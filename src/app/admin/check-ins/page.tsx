"use client";

import DialogModal from "@/components/dialog-modal";
import Input from "@/components/input";
import SectionCard from "@/components/SectionCard";
import SectionLoader from "@/components/SectionLoader";
import Table, { ColumnProps } from "@/components/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import useDebounceValue from "@/hooks/useDebounce";
import useStateReducer from "@/hooks/useStateReducer";
import {
  useAdminGetCheckInAnalyticsQuery,
  useCheckUserInMutation,
  useGetCheckInsQuery,
  useGetMembersQuery,
  UserWithSub,
} from "@/redux/api-slices/admin.slice";
import IUser from "@/types/User";
import {
  collocateMemberName,
  defaultPageSize,
  getInitials,
  isFetchBaseQueryError,
  onlyFieldsWithValue,
} from "@/utils";
import { CloseCircle, User } from "iconsax-react";
import { useSearchParams } from "next/navigation";
import React, { ReactNode, useState } from "react";

import MainButton from "@/components/button";
import { Separator } from "@/components/ui/separator";
import moment from "moment";
import Alert from "@/components/alert";
import toast from "react-hot-toast";
import { ErrorResponse } from "@/types";
import { DEFAULT_ERROR_MESSAGE } from "@/constants";

const CheckInsPage = () => {
  const searchParams = useSearchParams();

  const timeFilter = searchParams.get("timeFilter");

  const startDate = searchParams?.get("startDate");

  const endDate = searchParams.get("endDate");

  const skip =
    (timeFilter === "custom" && !startDate) ||
    (timeFilter === "custom" && !endDate);

  const { data, isLoading, isFetching, isError, refetch } = useGetCheckInsQuery(
    onlyFieldsWithValue({
      limit: searchParams.get("pageSize") || String(defaultPageSize),
      page: searchParams.get("page") || String(1),
      search: searchParams.get("searchQuery") || "",
      timeFilter: timeFilter || "",
      checkInType: searchParams.get("checkInType") || "",
      startDate: startDate || "",
      endDate: endDate || "",
    }),
    { skip }
  );

  const loading = isLoading || isFetching;

  const columns: ColumnProps[] = [
    { label: "Member Name", field: "member" },
    { label: "Member Email", field: "email" },
    {
      label: "Time Checked In",
      field: "createdAt",
      fieldType: "date",
      bold: true,
    },
    { label: "Time Checked In From Now", field: "fromNow" },
    { label: "Check-in type", field: "checkInType" },
    { label: "Checked in by", field: "checkedBy" },
  ];

  const pageProps = data?.data;

  const paginationInfo = pageProps?.paginationInfo;

  const rows = pageProps?.data || [];

  const getCheckInAnalyticsQuery = useAdminGetCheckInAnalyticsQuery(null);

  const checkInAnalytics = getCheckInAnalyticsQuery?.data?.data;

  const checkInLoading =
    getCheckInAnalyticsQuery?.isLoading || getCheckInAnalyticsQuery?.isFetching;

  const cards: { description: string; value: any; footer?: ReactNode }[] = [
    {
      description: "Check-ins Today",
      value: checkInAnalytics?.today,
      footer:
        Number(checkInAnalytics?.today || 0) >
        Number(checkInAnalytics?.yesterday || 0)
          ? `Greater than ${checkInAnalytics?.yesterday} of yesterday`
          : Number(checkInAnalytics?.today) ===
            Number(checkInAnalytics?.yesterday)
          ? "Same as yesterday"
          : `Down by ${
              Number(checkInAnalytics?.yesterday || 0) -
              Number(checkInAnalytics?.today || 0)
            } today`,
    },
    { description: "This Week", value: checkInAnalytics?.thisWeek },
    { description: "This Month", value: checkInAnalytics?.thisMonth },
    { description: "All Time", value: checkInAnalytics?.total },
  ];

  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="mb-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, id) => {
          return <SectionCard {...card} key={id} loading={checkInLoading} />;
        })}
      </div>
      <Table
        totalRecords={paginationInfo?.totalItems!}
        loading={loading}
        error={isError}
        refetch={refetch}
        rows={rows.map((row, id) => {
          return {
            ...row,
            id,
            member: `${row?.user?.firstname} ${row?.user?.lastname}`,
            email: row?.user?.email,
            checkedBy:
              row?.checkInType === "admin"
                ? `${row?.checkedInBy?.firstname} ${row?.checkedInBy?.lastname}`
                : "Self",
            fromNow: moment(row?.createdAt).fromNow(),
          };
        })}
        filters={[
          {
            keyName: "checkInType",
            title: "Checked In By",
            doNotDefaultFirstElement: true,
            options: [
              { label: "All", value: "all" },
              { label: "Admin", value: "admin" },
              { label: "Self", value: "self" },
            ],
            classNames: {
              trigger: "w-[150px]",
            },
          },
          {
            keyName: "timeFilter",
            title: "Time filter",

            options: [
              { label: "All", value: null },
              { label: "Today", value: "today" },
              { label: "Yesterday", value: "yesterday" },
              { label: "This Week", value: "thisWeek" },
              { label: "This Month", value: "thisMonth" },
              { label: "Custom", value: "custom" },
            ],
            classNames: {
              trigger: "w-[120px]",
            },
          },
        ]}
        showDateRange={timeFilter === "custom"}
        columns={columns}
        customNode={
          <>
            <Button onClick={() => setOpen(true)}>Check a member in</Button>
          </>
        }
      />
      <CheckInUserModal open={open} setOpen={setOpen} />
    </div>
  );
};

const CheckInUserModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (bool: boolean) => void;
}) => {
  const { handleStateChange, state } = useStateReducer<{
    searchQuery: string;
    selectedMember: UserWithSub | null;
  }>({ searchQuery: "", selectedMember: null });

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
    state.selectedMember?.latestSubscription?.status !== "active";

  const [checkIn, checkInStatus] = useCheckUserInMutation();

  const checkUserIn = async () => {
    const res = await checkIn({ userId: state?.selectedMember?._id! });

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
      title="Select a member"
      description="Select a member you want to check in"
      open={open}
      setOpen={setOpen}
    >
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
                          <p className="text-gray-500 mt-1 text-[12px]">
                            Started on{" "}
                            <span className="font-medium tracking-tight">
                              {moment(memberSub?.startDate).format("llll")}
                            </span>{" "}
                            and{" "}
                            {memberSub?.status === "active"
                              ? "will expire on"
                              : "expired on"}{" "}
                            <span className="font-medium">
                              {moment(memberSub?.endDate).format("llll")}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <Item
                          size={"sm"}
                          variant={"outline"}
                          className="text-rose-400"
                        >
                          <ItemMedia
                            variant={"icon"}
                            className="size-6 border-rose-100 bg-rose-50"
                          >
                            <CloseCircle color="var(--color-rose-400)" />
                          </ItemMedia>
                          <ItemContent className="text-[12px]">
                            This user has not subscribed to any plan yet
                          </ItemContent>
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
        title="Check member in?"
        description={`Are you sure you want to check ${state?.selectedMember?.firstname} in for today?`}
        alertTrigger={
          <MainButton
            color="black"
            label="Check In user"
            fullWidth
            className="mt-2"
            disabled={disabled}
            loading={checkInStatus.isLoading}
          />
        }
        onContinueClick={checkUserIn}
        loading={checkInStatus.isLoading}
      />
    </DialogModal>
  );
};

export default CheckInsPage;
