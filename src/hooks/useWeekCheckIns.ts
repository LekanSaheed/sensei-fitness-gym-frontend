import { useGetCheckInsForMonthQuery } from "@/redux/api-slices/subscription.slice";
import moment from "moment";

/**
 * Check-ins for the current week (Mon - Sun) and current month, built from the
 * existing month check-in endpoint (shared cache with the calendar).
 */
const useWeekCheckIns = () => {
  const today = moment();

  const weekStart = today.clone().startOf("isoWeek");

  const weekStartsLastMonth = weekStart.month() !== today.month();

  const thisMonth = useGetCheckInsForMonthQuery({
    month: today.month() + 1,
    year: today.year(),
  });

  // Only needed when the week started in the previous month
  const lastMonth = useGetCheckInsForMonthQuery(
    { month: weekStart.month() + 1, year: weekStart.year() },
    { skip: !weekStartsLastMonth }
  );

  const checkedInDays = new Set(
    [...(thisMonth.data?.data || []), ...(lastMonth.data?.data || [])].map(
      (d) => moment(d.day).format("YYYY-MM-DD")
    )
  );

  const week = Array.from({ length: 7 }, (_, i) => {
    const date = weekStart.clone().add(i, "day");

    return {
      key: date.format("YYYY-MM-DD"),
      label: date.format("dd").charAt(0),
      dayOfMonth: date.date(),
      checkedIn: checkedInDays.has(date.format("YYYY-MM-DD")),
      isToday: date.isSame(today, "day"),
      isFuture: date.isAfter(today, "day"),
    };
  });

  return {
    week,
    weekCount: week.filter((d) => d.checkedIn).length,
    monthCount: (thisMonth.data?.data || []).length,
    loading:
      thisMonth.isLoading ||
      (weekStartsLastMonth && lastMonth.isLoading),
    isError: thisMonth.isError || lastMonth.isError,
  };
};

export default useWeekCheckIns;
