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

// import { useIsSearching } from "@/hooks/useSearchParams";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/button";
import useSerialNumber from "@/hooks/useSerialNumber";
import { InfoCircle } from "iconsax-react";
import moment from "moment";
import usePaginate from "@/hooks/usePaginate";
import Spinner from "../Spinner";
import FormatNumber from "@/utils/format-number";

export interface ColumnProps {
  label: string;
  field: string;
  fieldType?: "currency" | "default" | "date";
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

  const isSearching = false;

  const getSerial = useSerialNumber();

  const renderable_columns = columns?.filter((c) => !c?.hide);

  const { totalPages } = usePaginate(totalRecords);

  return (
    <div className="">
      <div className="">
        <div className="md:sticky top-[40px] ">
          <TableControls
            showSearch={showSearch}
            filters={filters}
            search={search!}
            totalRecords={totalRecords}
            showDateRange={showDateRange}
            customNode={customNode}
          />
        </div>
      </div>
      <div className="shrink-0 overflow-hidden ">
        {beforeTable}
        <motion.div
          layout="position"
          className="border bg-white overflow-auto relative border-gray-300 rounded-[8px] min-h-[400px] max-h-[80vh]"
        >
          {(loading || noRecords || error) && (
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center">
              {loading ? (
                <div className="text-default">
                  <Spinner className="text-[30px]" />
                </div>
              ) : error ? (
                <div className="flex pointer-events-auto items-center flex-col">
                  <p className="text-[14px] mb-1">Failed to fetch</p>
                  <Button
                    label="Retry"
                    fullWidth={false}
                    onClick={refetch}
                    size="sm"
                    variant="outlined"
                    className="h-[33px]"
                  />
                </div>
              ) : noRecords ? (
                <p className="text-[14px] tracking-n-3">
                  NO RECORDS {isSearching ? "FOUND" : ""}
                </p>
              ) : (
                ""
              )}
            </div>
          )}
          <table className="w-full max-w-full">
            <thead className=" z-[1] sticky top-0">
              <tr className=" ">
                {useSerial && (
                  <th
                    className="font-semibold  
                    whitespace-nowrap bg-[#f5faf4] px-3 py-4 text-start text-[12px]  tracking-n-1"
                  >
                    S/N
                  </th>
                )}
                {renderable_columns.map((column, id) => {
                  return (
                    <th
                      key={id}
                      className="font-semibold bg-[#f5faf4]  
                       whitespace-nowrap px-3 py-4 text-start text-[12px]  tracking-n-1"
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
                      className={`${
                        !!onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""
                      } transition relative`}
                      key={id}
                    >
                      {useSerial && (
                        <td className="px-3 py-4 text-[13px] tracking-n-1 border border-gray-200 ">
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

                        return (
                          <td
                            key={id}
                            className={`px-3 py-4 text-[12px] tracking-n-1 border  ${
                              bold || ["date", "currency"].includes(fieldType!)
                                ? "font-semibold"
                                : ""
                            } border-gray-200 ${
                              !wrap ? "whitespace-nowrap" : ""
                            }`}
                          >
                            {fieldType === "currency"
                              ? FormatNumber.ngnAmount(cellValue as number)
                              : fieldType === "date"
                              ? !!cellValue
                                ? moment(cellValue)?.format("llll")
                                : "N/A"
                              : cellValue || "N/A"}
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
        <div className="flex justify-end mt-4 gap-4">
          <PageSize totalRecords={totalRecords} />
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};

export default Table;
