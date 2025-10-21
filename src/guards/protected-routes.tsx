import React, { FunctionComponent, ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import FullLoader from "@/components/full-loader";

import { RootState } from "@/redux";
import useRouter from "@/hooks/useRouter";

interface ProtectedRouteProps {
  children: ReactNode;
}
const ProtectedRoute: FunctionComponent<ProtectedRouteProps> = ({
  children,
}) => {
  const { authenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );
  // get authstate from useSelector - redux
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !authenticated) {
      // if (!router.isReady) return;
      router.push(`/login?return_url=${pathname}`);
    }
  }, [loading, authenticated, router]);
  //   if (!isProtected) return children;

  if (loading && !authenticated) return <FullLoader />;

  if (loading || !authenticated) {
    return <FullLoader />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
