import React, { FunctionComponent, ReactNode, RefObject } from "react";
import Spinner from "../Spinner";
import { AnimatePresence, motion } from "framer-motion";

export interface InputProviderProps {
  label: ReactNode;
  children: ReactNode;
  remove_margin: boolean;
  showAsterisk: boolean;
  mainContainerClassName: string;
  loading: boolean;
  topRight: ReactNode;
  error: string;
  innerRef?: RefObject<HTMLDivElement | null>;
}

const InputProvider: FunctionComponent<Partial<InputProviderProps>> = ({
  label,
  children,
  remove_margin,
  showAsterisk,
  mainContainerClassName,
  topRight,
  loading,
  error,
  innerRef,
}) => {
  return (
    <motion.div
      ref={innerRef}
      layout="position"
      className={`text-u-black relative ${
        remove_margin ? "" : "mb-[18px]"
      } ${mainContainerClassName}`}
    >
      <div className="mb-[5px] flex justify-between">
        <div className="flex items-center">
          {label && (
            <label className="text-[12px]  inline-block text-u-gray-3">
              {label}
              {showAsterisk && <span className="text-u-red"> *</span>}
            </label>
          )}
          {loading && <Spinner className="text-[12px] text-u-red ml-1.5" />}
        </div>
        {topRight && (
          <p className="text-[13px] inline-block text-u-gray-3">{topRight}</p>
        )}
      </div>
      {children}

      <AnimatePresence>
        {!!error && (
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="text-[10px] mt-1 text-rose-500 tracking-n-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InputProvider;
