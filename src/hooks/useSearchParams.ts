import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export const useIsSearching = () => {
  const searchParams = useSearchParams();

  const isSearching = !!searchParams.get("searchQuery");

  return isSearching;
};

export const useUpdateSearchParams = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (name: string, value: string, scroll?: boolean) => {
    const queryString = createQueryString(name, value);
    router.replace(pathname + `?${queryString}`, { scroll: scroll || false });
  };
};
