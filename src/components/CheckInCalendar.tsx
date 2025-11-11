import { useGetCheckInsForMonthQuery } from "@/redux/api-slices/subscription.slice";
import React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import SectionLoader from "./SectionLoader";
import { SecurityUser } from "iconsax-react";
import { FaPersonWalking } from "react-icons/fa6";
import moment from "moment";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const CheckInCalendar = () => {
  const defaultClassNames = getDefaultClassNames();

  const [month, setMonth] = React.useState<Date>();

  const date = month || new Date();

  const m = date.getMonth() + 1;

  const y = date.getFullYear();

  console.log(month);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetCheckInsForMonthQuery({ month: m, year: y });

  const days = data?.data || [];

  const daysCheckedIn = days?.map((d) => new Date(d?.day)) || [];

  const loading = isLoading || isFetching;

  console.log({ daysCheckedIn });
  return (
    <div>
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
  );
};

export default CheckInCalendar;
