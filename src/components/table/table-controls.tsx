import {
  ArrowDown2,
  ArrowLeft2,
  ArrowRight2,
  Icon,
  SearchNormal,
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

      <div className="flex flex-col-reverse  sm:flex-row gap-4 justify-between mb-3">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="w-full sm:max-w-[350px]">
            {showSearch && <SearchInput {...search} />}
          </div>
          {filters?.length > 0 && (
            <ul className="flex gap-3 ">
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
                      triggerClassName={`rounded-full ${
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
    <motion.div
      layout
      className="flex relative flex-1 overflow-hidden items-center  border border-gray-300 rounded-full"
    >
      <motion.div layout="position" className="w-full">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={props?.placeholder || "Search"}
          className="w-full placeholder:text-[12px] text-[12px] outline-none border-r border-r-gray-300/50 h-[30px] px-3 bg-transparent"
        />
      </motion.div>

      <div
        className={`px-2.5 cursor-pointer py-2.5 flex items-center justify-center ${
          searchQuery ? "bg-default" : ""
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
    </motion.div>
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
        className="flex cursor-pointer border border-gray-300 justify-between items-center px-3 py-1.5 rounded-[10px]"
      >
        <p className="text-[12px] tracking-n-1">
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
          className="absolute bottom-[50px] bg-white border border-gray-300 rounded-[10px] overflow-hidden w-[140px]"
        >
          {pageSizeOptions.map((option) => {
            const isActive = option == pageSize;
            return (
              <li
                onClick={() => {
                  updateSearchParams("pageSize", option?.toString());

                  setShow(false);
                }}
                className={`px-3 py-1 text-[12px] cursor-pointer hover:bg-gray-100 hover:text-gray-600 ${
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
      className="cursor-pointer p-1.5 active:opacity-40 transition data-[disabled=true]:text-gray-600"
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
    <motion.div layout="position" className="flex items-center  mb-4">
      <motion.div className="border text-[12px] px-3 py-1.5 border-gray-300 gap-1 mr-2 inline-flex  rounded-[8px]">
        <motion.p>
          {" "}
          Page {page} of {totalPages}
        </motion.p>
      </motion.div>
      <div className="border border-gray-300 gap-1  inline-flex   rounded-[8px]">
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
