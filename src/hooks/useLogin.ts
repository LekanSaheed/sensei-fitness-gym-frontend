import { ADMIN_DASHBOARD, DASHBOARD } from "@/constants/routes";
import { actions } from "@/redux";
import { useLoginMutation } from "@/redux/api-slices/auth.slice";

import { ErrorResponse, ResponseType } from "@/types";
import type IUser from "@/types/User";
import { isFetchBaseQueryError } from "@/utils";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

const useLogin = () => {
  const [login, loginStatus] = useLoginMutation();

  const { fetchUserAndLogin, loading } = useFetchUserAndLogin();

  const router = useRouter();

  const loginUser = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    const res = await login({ username, password });

    if ("error" in res && isFetchBaseQueryError(res.error)) {
      const errorData: ErrorResponse = res.error.data!;

      toast.error(errorData?.error || "An error occured");
    } else {
      const response = res?.data;

      if (response?.success) {
        fetchUserAndLogin(response?.data as string, (user) => {
          if (user?.role === "admin") {
            return router.push(ADMIN_DASHBOARD);
          }

          router.push(DASHBOARD);
        });
      }
    }
  };

  return { loginUser, loading: loginStatus.isLoading || loading };
};

export const fetchUser = async (token: string) => {
  const res: ResponseType = await (
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  ).json();

  return res;
};

export const useFetchUserAndLogin = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { login: l, saveToken } = actions["auth"];

  const fetchUserAndLogin = async (
    token: string,
    callback?: (user: IUser) => void
  ) => {
    setLoading(true);

    const userResponse = await fetchUser(token);

    setLoading(false);

    if (!userResponse?.success) {
      return toast.error(
        userResponse?.message ||
          userResponse?.error ||
          ">>Could not get profile<<"
      );
    }
    const user: IUser = userResponse?.data;

    dispatch(saveToken(token));

    dispatch(l(user));

    if (callback) {
      callback(user);
    }
  };

  return { fetchUserAndLogin, loading };
};

export default useLogin;
