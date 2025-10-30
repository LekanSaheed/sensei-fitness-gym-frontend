import { defaultPageSize } from "@/utils";
import { useSearchParams } from "next/navigation";

const usePaginate = (totalRecords: number) => {
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page")?.toString() || "") || 1;

  const pageSize =
    parseInt(searchParams.get("pageSize")?.toString() || "") || defaultPageSize;

  const totalPages = Math.ceil(totalRecords / pageSize);

  return { totalRecords, totalPages, page, pageSize };
};
export default usePaginate;

export const usePaginationProps = () => {
  const searchParams = useSearchParams();

  const page = searchParams.get("page") || "1";

  const limit = searchParams.get("pageSize") || String(defaultPageSize);

  return { page, limit };
};
