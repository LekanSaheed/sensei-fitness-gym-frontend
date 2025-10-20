import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useRouter as useNextRouter } from "next/navigation";

const useRouter = () => {
  const searchParams = useSearchParams();

  const router = useNextRouter();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return {
    ...router,
    createQueryString,
  };
};

export default useRouter;
