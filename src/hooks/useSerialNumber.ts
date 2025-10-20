import { defaultPageSize } from "@/utils";
import { useSearchParams } from "next/navigation";

const useSerialNumber = () => {
  const searchParams = useSearchParams();

  const pageSize =
    parseInt(searchParams.get("pageSize") || "") || defaultPageSize;

  const page = parseInt(searchParams.get("page") || "") || 1;

  const currentStart = (page - 1) * pageSize + 1;

  return (num: number) => num + currentStart;
};

export default useSerialNumber;
