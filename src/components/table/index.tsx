import React, {
  FunctionComponent,
  InputHTMLAttributes,
  ReactNode,
  useState,
} from "react";
import TableControls, {
  PageSize,
  Pagination,
  TableFilter,
} from "./table-controls";

import { useIsSearching } from "@/hooks/useSearchParams";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/button";
import useSerialNumber from "@/hooks/useSerialNumber";
import { InfoCircle, SearchNormal1 } from "iconsax-react";
import moment from "moment";
import usePaginate from "@/hooks/usePaginate";
import Spinner from "../Spinner";
import FormatNumber from "@/utils/format-number";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export interface ColumnProps {
  label: string;
  field: string;
  fieldType?: "currency" | "default" | "date" | "avatar";
  wrap?: boolean;
  hide?: boolean;
  bold?: boolean;
}

interface TableProps<T> {
  columns: ColumnProps[];
  rows: T[];
  totalRecords: number;
  loading: boolean;
  search?: InputHTMLAttributes<HTMLInputElement>;
  error?: boolean;
  refetch?: () => void;
  onRowClick?: (data: T) => void;
  useSerial?: boolean;
  filters?: TableFilter[];
  beforeTable?: ReactNode;
  showSearch?: boolean;
  showDateRange?: boolean;
  customNode?: ReactNode;
}

const Table = <
  T extends {
    [key: string]: unknown;
  }
>({
  columns = [],
  rows = [],
  totalRecords,
  loading = false,
  search,
  error,
  onRowClick,
  refetch,
  useSerial = true,
  filters,
  beforeTable,
  showSearch = true,
  showDateRange = false,
  customNode,
}: TableProps<T>) => {
  const showRecords = !loading && !error;

  const noRecords = !loading && rows?.length === 0 && !error;

  const isSearching = useIsSearching();

  const getSerial = useSerialNumber();

  const renderable_columns = columns?.filter((c) => !c?.hide);

  const { totalPages } = usePaginate(totalRecords);

  return (
    <div className="">
      <TableControls
        showSearch={showSearch}
        filters={filters}
        search={search!}
        totalRecords={totalRecords}
        showDateRange={showDateRange}
        customNode={customNode}
      />
      <div className="shrink-0 overflow-hidden">
        {beforeTable}
        <motion.div
          layout="position"
          className="bg-white overflow-auto relative border border-gray-200/80 rounded-[18px] shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.08)] min-h-[400px] max-h-[80vh]"
        >
          {(loading || noRecords || error) && (
            <div className="absolute pointer-events-none inset-0 top-[48px] flex items-center justify-center">
              {loading ? (
                <div className="text-default">
                  <Spinner className="text-[30px]" />
                </div>
              ) : error ? (
                <div className="flex pointer-events-auto items-center flex-col text-center">
                  <span className="size-12 rounded-full bg-rose-50 inline-flex items-center justify-center mb-3">
                    <InfoCircle size={22} color="var(--color-rose-500)" />
                  </span>
                  <p className="text-[14px] font-semibold mb-1">
                    Failed to fetch
                  </p>
                  <p className="text-[12px] text-gray-500 mb-3">
                    Something went wrong while loading this list.
                  </p>
                  <Button
                    label="Retry"
                    fullWidth={false}
                    onClick={refetch}
                    size="sm"
                    variant="outlined"
                    fullRadius
                    className="h-[34px] !px-5"
                  />
                </div>
              ) : noRecords ? (
                <div className="flex flex-col items-center text-center">
                  <span className="size-12 rounded-full bg-default/10 inline-flex items-center justify-center mb-3">
                    <SearchNormal1 size={22} color="var(--color-default)" />
                  </span>
                  <p className="text-[14px] font-semibold uppercase tracking-wide">
                    No records {isSearching ? "found" : ""}
                  </p>
                  <p className="text-[12px] text-gray-500 mt-1">
                    Try changing your filters or search.
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
          )}
          <table className="w-full max-w-full border-separate border-spacing-0">
            <thead className="z-[1] sticky top-0">
              <tr>
                {useSerial && (
                  <th className="bg-gray-50/95 backdrop-blur border-b border-gray-200 whitespace-nowrap px-4 py-3.5 text-start text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    S/N
                  </th>
                )}
                {renderable_columns.map((column, id) => {
                  return (
                    <th
                      key={id}
                      className="bg-gray-50/95 backdrop-blur border-b border-gray-200 whitespace-nowrap px-4 py-3.5 text-start text-[11px] font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {column?.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            {showRecords && (
              <tbody>
                {rows.map((row, id) => {
                  const cellMap = Object.entries(row);

                  return (
                    <tr
                      onClick={() => {
                        if (!!onRowClick) {
                          onRowClick(row);
                        }
                      }}
                      className={`group transition relative ${
                        !!onRowClick
                          ? "cursor-pointer hover:bg-default/[0.05]"
                          : "hover:bg-gray-50/70"
                      }`}
                      key={id}
                    >
                      {useSerial && (
                        <td className="px-4 py-3.5 text-[12px] text-gray-400 tabular-nums border-b border-gray-100">
                          {getSerial(id)}
                        </td>
                      )}
                      {renderable_columns.map((col, id) => {
                        const cell = cellMap?.find((c) => c[0] === col?.field);

                        const cellValue = cell?.[1] as string | number | null;

                        const colDeets = renderable_columns.find(
                          (c) => c?.field === cell?.[0]
                        );

                        const fieldType = colDeets?.fieldType;

                        const wrap = colDeets?.wrap;

                        const bold = colDeets?.bold;

                        const avatarProps = cellValue as unknown as {
                          src: string;
                          initials: string;
                        };

                        return (
                          <td
                            key={id}
                            className={`px-4 py-3.5 text-[13px] text-gray-800 border-b border-gray-100 ${
                              bold || fieldType === "currency"
                                ? "font-semibold text-gray-900"
                                : ""
                            } ${fieldType === "date" ? "text-gray-600" : ""} ${
                              !wrap ? "whitespace-nowrap" : ""
                            }`}
                          >
                            {fieldType === "avatar" ? (
                              <Avatar className="size-9 ring-2 ring-white shadow-sm">
                                <AvatarImage src={avatarProps.src} />
                                <AvatarFallback className="bg-default/15 text-default-secondary text-[12px] font-semibold">
                                  {avatarProps?.initials}
                                </AvatarFallback>
                              </Avatar>
                            ) : fieldType === "currency" ? (
                              FormatNumber.ngnAmount(cellValue as number)
                            ) : fieldType === "date" ? (
                              !!cellValue ? (
                                moment(cellValue)?.format("llll")
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )
                            ) : (
                              cellValue || <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </motion.div>
        <div className="flex flex-wrap items-center justify-between mt-4 gap-3">
          <PageSize totalRecords={totalRecords} />
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};

export default Table;
