import { useGetCheckInsForMonthQuery } from "@/redux/api-slices/subscription.slice";
import React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import SectionLoader from "./SectionLoader";
import { SecurityUser } from "iconsax-react";
import { FaPersonWalking } from "react-icons/fa6";
import moment from "moment";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import SectionTitle from "./dashboard/SectionTitle";

const CheckInCalendar = () => {
  const defaultClassNames = getDefaultClassNames();

  const [month, setMonth] = React.useState<Date>();

  const date = month || new Date();

  const m = date.getMonth() + 1;

  const y = date.getFullYear();

  const { data, isLoading, isFetching, isError, refetch } =
    useGetCheckInsForMonthQuery({ month: m, year: y });

  const days = data?.data || [];

  const daysCheckedIn = days?.map((d) => new Date(d?.day)) || [];

  const loading = isLoading || isFetching;

  return (
    <section>
      <SectionTitle
        action={
          <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <FaPersonWalking size={12} color="var(--color-default)" />
              Self
            </span>
            <span className="inline-flex items-center gap-1">
              <SecurityUser size={12} color="var(--color-default)" variant="Bold" />
              Admin
            </span>
          </div>
        }
      >
        Training log
      </SectionTitle>
      <div className="rounded-[24px] bg-white dark:bg-card border border-gray-200/70 dark:border-border p-4">
      <SectionLoader loading={loading} error={isError} refetch={refetch} />
      {!loading && !isError && (
        <DayPicker
          animate
          month={month}
          onMonthChange={(month) => setMonth(month)}
          classNames={{
            month_grid: "w-full",
            months: "w-full",
            weeks: `${defaultClassNames.weeks}`,
            today: "",
            day: `${defaultClassNames.day} text-[12px]`,
            chevron: `${defaultClassNames.chevron} !fill-default-secondary`,
          }}
          mode="single"
          modifiers={{
            checkedIn: daysCheckedIn,
          }}
          // modifiersClassNames={{
          //   checkedIn: "bg-default/20 text-default border border-default",
          // }}
          components={{
            Day: (props) => {
              const rawDay = days.find(
                (d) =>
                  moment(d?.day).format("DD/MM/YYYY") ===
                  moment(props.day.date).format("DD/MM/YYYY")
              );

              const checkInType = rawDay?.type;

              return (
                <td {...props} className={`${props.className} pb-[13px]`}>
                  <Popover>
                    <PopoverTrigger
                      asChild
                      disabled={!props.modifiers.checkedIn}
                    >
                      <button
                        className={`${
                          defaultClassNames?.day_button
                        } relative !mx-auto ${
                          props.modifiers.checkedIn
                            ? "!bg-default/10 !text-default !border !border-default !rounded-[10px]"
                            : ""
                        }`}
                      >
                        {props?.modifiers?.checkedIn && (
                          <span className="absolute bg-default-tertiary dark:bg-default text-white size-[25px] rounded-full inline-flex items-center justify-center -top-[10px] -right-[10px] border border-default">
                            {React.createElement(
                              checkInType === "admin"
                                ? SecurityUser
                                : checkInType === "self"
                                ? FaPersonWalking
                                : "span",
                              {
                                size: 16,
                                color: "var(--color-white)",
                                variant: "Bold",
                              }
                            )}
                          </span>
                        )}
                        {props.day.date.getDate()}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent>
                      {props.modifiers.checkedIn && (
                        <div className="text-[14px]">
                          {checkInType === "admin"
                            ? "Checked in by Admin"
                            : checkInType === "self"
                            ? "Self Check-In"
                            : ""}{" "}
                          on {moment(rawDay?.day).format("llll")}
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                </td>
              );
            },
          }}
          showOutsideDays
          selected={undefined}
        />
      )}
      </div>
    </section>
  );
};

export default CheckInCalendar;
