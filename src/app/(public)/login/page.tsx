"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import useLogin from "@/hooks/useLogin";
import useStateReducer from "@/hooks/useStateReducer";
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
      />
      <Button label="Login" fullWidth loading={loading} />
    </form>
  );
};

export default LoginPage;
