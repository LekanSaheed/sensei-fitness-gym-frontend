import { useState } from "react";

const useStateReducer = <T extends Record<string, any>>(states: T) => {
  const [state, setState] = useState<T>(states);

  const handleStateChange = (change: Partial<T>) =>
    setState((prev) => ({ ...prev, ...change }));

  return { state, handleStateChange, setState };
};

export default useStateReducer;
