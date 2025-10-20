import IUser from "@/types/User";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return typeof error === "object" && error != null && "status" in error;
};

export const isErrorWithMessage = (
  error: unknown
): error is { message: string } => {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    typeof (error as any).message === "string"
  );
};

export const onlyFieldsWithValue = <T extends object | {}>(obj: T) => {
  const newObj: T = {} as T;
  for (let key of Object.entries(obj)) {
    if (key[1]) {
      newObj[key[0] as keyof T] = key[1];
    }
  }
  return newObj;
};

export const formatQuery = <T extends object>(searchQuery: T) => {
  const arr = Object.entries(onlyFieldsWithValue(searchQuery))
    .map((s) => {
      return Array.isArray(s[1])
        ? s[1]?.map((t) => `${s[0]}=${t}`).join("&")
        : `${[s[0]]}=${s[1]}`;
    })
    .join("&");

  return arr;
};

export const getInitials = (str: string) =>
  `${str.split(" ")[0].charAt(0)?.toUpperCase()}${str
    .split(" ")[1]
    .charAt(0)
    ?.toUpperCase()}`;

export const collocateMemberName = (member: IUser) =>
  `${member?.firstname || ""} ${member?.lastname || ""}`;

export const pageSizeOptions = [24, 40, 50, 100, 500];

export const defaultPageSize = pageSizeOptions[0];
