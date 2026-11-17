import {
  ArrowDown2,
  ArrowLeft2,
  ArrowRight2,
  Icon,
  SearchNormal,
  SearchNormal1,
} from "iconsax-react";
import React, {
  FunctionComponent,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { color, LayoutGroup, motion } from "framer-motion";

import { useRouter } from "next/navigation";
import usePaginate from "@/hooks/usePaginate";
import { useIsSearching, useUpdateSearchParams } from "@/hooks/useSearchParams";
import { MdClose } from "react-icons/md";
import eventEmitter from "@/utils/events";
import { defaultPageSize, pageSizeOptions } from "@/utils";
import { useSearchParams } from "next/navigation";
import SelectInput from "../select-input";
import DatePicker from "../date-picker";

export interface TableFilter {
  options: { label: string; value: string | number | undefined | null }[];
  title: string;
  keyName: string;
  doNotDefaultFirstElement?: boolean;
  classNames?: Partial<{
    trigger: string;
  }>;
}

const TableControls: FunctionComponent<{
  totalRecords: number;
  search: InputHTMLAttributes<HTMLInputElement>;
  filters?: TableFilter[];
  showSearch?: boolean;
  showDateRange?: boolean;
  customNode?: ReactNode;
}> = ({ search, filters = [], showSearch, showDateRange, customNode }) => {
  const searchParams = useSearchParams();

  const isSearching = useIsSearching();

  const updateSearchParams = useUpdateSearchParams();

  const searchQuery = searchParams.get("searchQuery") || "";

  const defaultStartDate = searchParams.get("startDate");

  const defaultEndDate = searchParams.get("endDate");

  const startDate = defaultStartDate ? new Date(defaultStartDate) : undefined;

  const endDate = defaultEndDate ? new Date(defaultEndDate) : undefined;

  // const [startDate, setStartDate] = useState<Date | undefined>(
  //   defaultStartDate ? new Date(defaultStartDate) : undefined
  // );

  // const [endDate, setEndDate] = useState<Date | undefined>(
  //   defaultEndDate ? new Date(defaultEndDate) : undefined
  // );
  return (
    <LayoutGroup>
      {isSearching && (
        <motion.div
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          className="mb-2 inline-block"
        >
          <span className="font-bold ">Showing results for: </span>

          <span className="italic text-gray-600 break-all hyphens-auto">
            {searchQuery}
          </span>
          <MdClose
            className="cursor-pointer ml-2 inline"
            onClick={() => {
              updateSearchParams("searchQuery", "");
              eventEmitter.emit("queryCleared");
            }}
          />
        </motion.div>
      )}

      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between mb-4">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
          <div className="w-full sm:w-[300px]">
            {showSearch && <SearchInput {...search} />}
          </div>
          {filters?.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {filters?.map((filter, id) => {
                const selectedValue = searchParams.get(filter?.keyName);

                const selected = filter.options.find(
                  (option) => option.value === selectedValue
                );
                return (
                  <li key={id}>
                    <SelectInput
                      options={filter?.options}
                      placeholder={filter?.title}
                      triggerClassName={`rounded-full !h-10 bg-white border-gray-200 px-4 text-[13px] shadow-[0_1px_2px_rgb(0_0_0/0.04)] hover:border-gray-300 ${
                        filter?.classNames?.trigger || ""
                      }`}
                      selected={
                        selected ||
                        (filter?.doNotDefaultFirstElement
                          ? null
                          : filter.options[0])
                      }
                      queryKey={filter?.keyName}
                    />
                  </li>
                );
              })}
              {showDateRange && (
                <>
                  <li>
                    <DatePicker
                      placeholder="Start Date"
                      date={startDate}
                      setDate={(date) => {
                        updateSearchParams("startDate", date.toISOString());
                      }}
                    />
                  </li>
                  <li>
                    <DatePicker
                      placeholder="End Date"
                      date={endDate}
                      setDate={(date) => {
                        updateSearchParams("endDate", date.toISOString());
                      }}
                    />
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
        <div className="flex gap-4">{customNode}</div>
      </div>
    </LayoutGroup>
  );
};

const SearchInput: FunctionComponent<InputHTMLAttributes<HTMLInputElement>> = ({
  ...props
}) => {
  const searchParams = useSearchParams();

  const updateSearchParams = useUpdateSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("searchQuery") || ""
  );

  const isSearching = useIsSearching();

  useEffect(() => {
    const clearQuery = () => {
      setSearchQuery("");
    };

    eventEmitter.on("queryCleared", clearQuery);

    return () => {
      eventEmitter.off("queryCleared", clearQuery);
    };
  }, []);

  return (
    <motion.form
      layout
      onSubmit={(e) => {
        e.preventDefault();
        if (searchQuery) {
          updateSearchParams("searchQuery", searchQuery);
        }
      }}
      className="flex relative flex-1 overflow-hidden items-center bg-white border border-gray-200 rounded-full shadow-[0_1px_2px_rgb(0_0_0/0.04)] transition focus-within:border-default focus-within:ring-4 focus-within:ring-default/15"
    >
      <SearchNormal1
        size={16}
        color="var(--color-gray-400)"
        className="shrink-0 ml-3.5"
      />
      <motion.div layout="position" className="w-full">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={props?.placeholder || "Search"}
          className="w-full placeholder:text-[13px] placeholder:text-gray-400 text-[13px] outline-none h-[40px] px-2.5 bg-transparent"
        />
      </motion.div>

      <div
        className={`m-1 size-8 shrink-0 rounded-full cursor-pointer flex items-center justify-center transition ${
          searchQuery ? "bg-default" : "bg-gray-100"
        }`}
      >
        {isSearching && searchQuery === searchParams.get("searchQuery") ? (
          <MdClose
            onClick={() => {
              updateSearchParams("searchQuery", "");
              setSearchQuery("");
            }}
            color=""
            className=""
          />
        ) : (
          <SearchNormal
            onClick={() => {
              if (searchQuery) {
                updateSearchParams("searchQuery", searchQuery);
              }
            }}
            color={searchQuery ? "#fff" : "#000"}
            size={15}
          />
        )}
      </div>
    </motion.form>
  );
};

export const PageSize: FunctionComponent<{ totalRecords: number }> = ({
  totalRecords = 0,
}) => {
  const [show, setShow] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  const updateSearchParams = useUpdateSearchParams();

  const page = parseInt(searchParams.get("page")?.toString() || "") || 1;

  const pageSize =
    parseInt(searchParams.get("pageSize")?.toString() || "") || defaultPageSize;

  const limitStart = (page - 1) * pageSize + 1;

  const limitEnd = page * pageSize;

  const { totalPages } = usePaginate(totalRecords);

  return (
    <motion.div layout="size" className="relative">
      <motion.div
        onClick={() => setShow(!show)}
        layout="preserve-aspect"
        className="flex cursor-pointer bg-white border border-gray-200 justify-between items-center px-3.5 py-2 rounded-full shadow-[0_1px_2px_rgb(0_0_0/0.04)] hover:border-gray-300 transition"
      >
        <p className="text-[12px] text-gray-600 tabular-nums">
          Results {totalRecords <= 0 ? 0 : limitStart} -{" "}
          {totalRecords <= 0
            ? 0
            : page === totalPages
            ? totalRecords
            : limitEnd}{" "}
          of {totalRecords}
        </p>
        <motion.div className="ml-2" animate={{ rotate: show ? 180 : 0 }}>
          <ArrowDown2 size={18} color="var(--color-secondary-foreground)" />
        </motion.div>
      </motion.div>
      {show && (
        <motion.ul
          layout="position"
          className="absolute z-[5] bottom-[46px] bg-white border border-gray-200 rounded-[14px] shadow-xl overflow-hidden w-[160px] p-1"
        >
          {pageSizeOptions.map((option) => {
            const isActive = option == pageSize;
            return (
              <li
                onClick={() => {
                  updateSearchParams("pageSize", option?.toString());

                  setShow(false);
                }}
                className={`px-3 py-2 rounded-[10px] text-[12px] cursor-pointer hover:bg-gray-100 ${
                  isActive ? "bg-default/10 text-default" : ""
                }`}
                key={option}
              >
                {option} records
              </li>
            );
          })}
        </motion.ul>
      )}
    </motion.div>
  );
};

export const PaginationControl: FunctionComponent<{
  icon: Icon;
  disabled: boolean;
  handleClick: () => void;
}> = ({ icon, disabled, handleClick }) => {
  return (
    <div
      data-disabled={disabled}
      onClick={() => {
        if (!disabled) {
          handleClick();
        }
      }}
      role="button"
      aria-disabled={disabled}
      className="cursor-pointer size-9 rounded-full flex items-center justify-center transition hover:bg-default hover:text-white active:scale-95 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:text-gray-300 data-[disabled=true]:hover:bg-transparent"
    >
      {React.createElement(icon, { size: 18 })}
    </div>
  );
};

export const Pagination: FunctionComponent<{
  totalPages: number;
}> = ({ totalPages = 1 }) => {
  const searchParams = useSearchParams();

  const updateSearchParams = useUpdateSearchParams();

  const page = parseInt(searchParams.get("page")?.toString() || "") || 1;

  const handlePage = (index: number) => {
    updateSearchParams("page", index.toString());
  };

  const prevDisabled = page < 2;

  const nextDisabled = totalPages <= page;
  return (
    <motion.div layout="position" className="flex items-center gap-2">
      <motion.div className="text-[12px] text-gray-600 tabular-nums px-1">
        <motion.p>
          {" "}
          Page {page} of {totalPages}
        </motion.p>
      </motion.div>
      <div className="bg-white border border-gray-200 inline-flex rounded-full p-0.5 shadow-[0_1px_2px_rgb(0_0_0/0.04)]">
        <PaginationControl
          handleClick={() => handlePage(page - 1)}
          disabled={prevDisabled}
          icon={ArrowLeft2}
        />
        <PaginationControl
          handleClick={() => handlePage(page + 1)}
          disabled={nextDisabled}
          icon={ArrowRight2}
        />
      </div>
    </motion.div>
  );
};

export default TableControls;
