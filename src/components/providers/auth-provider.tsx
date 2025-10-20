import Cookies from "js-cookie";

import { FunctionComponent, ReactNode, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { RootState, actions } from "@/redux";

import { useFetchUserAndLogin } from "@/hooks/useLogin";

const AuthProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const { stopLoading } = actions.auth;

  const dispatch = useDispatch();

  const { fetchUserAndLogin } = useFetchUserAndLogin();

  const { authenticated } = useSelector((state: RootState) => state["auth"]);

  useEffect(() => {
    const token = Cookies.get("access_token") || "";

    if (token && !authenticated) {
      fetchUserAndLogin(token);
    } else {
      dispatch(stopLoading(null));
    }
  }, [authenticated]);

  return children;
};

export default AuthProvider;
