"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { FORGOT_PASSWORD } from "@/constants/routes";
import useLogin from "@/hooks/useLogin";
import useStateReducer from "@/hooks/useStateReducer";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
  const { state, handleStateChange } = useStateReducer({
    username: "",
    password: "",
  });

  const { loading, loginUser } = useLogin();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        loginUser(state);
      }}
    >
      <Input
        required
        value={state.username}
        label={"Username or Email"}
        placeholder="Username or email"
        onChange={(e) => handleStateChange({ username: e.target.value })}
      />
      <Input
        required
        type="password"
        value={state.password}
        onChange={(e) => handleStateChange({ password: e.target.value })}
        label={"Password"}
        toggle
        placeholder="Password"
        dark
      />
      <div className="mb-5  flex justify-end">
        <p className="text-[14px] ">
          <Link href={FORGOT_PASSWORD} className="text-default  font-semibold">
            Forgot Password?{" "}
          </Link>
        </p>
      </div>
      <Button
        label="Login"
        fullWidth
        loading={loading}
        font="regular"
        brandedFont
      />
    </form>
  );
};

export default LoginPage;
