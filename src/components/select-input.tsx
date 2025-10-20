import React, { FunctionComponent } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useUpdateSearchParams } from "@/hooks/useSearchParams";

export interface DropdownOption {
  label: string;
  value: any;
}

const SelectInput: FunctionComponent<{
  placeholder?: string;
  options: DropdownOption[];
  selected: DropdownOption | null;
  queryKey?: string;
  triggerClassName?: string;
}> = ({ placeholder, options = [], selected, queryKey, triggerClassName }) => {
  const updateSearchParams = useUpdateSearchParams();

  return (
    <Select
      defaultValue={selected?.value}
      onValueChange={(option) => {
        if (queryKey) {
          updateSearchParams(queryKey, option);
        }
      }}
    >
      <SelectTrigger className={`w-[180px] ${triggerClassName || ""}`}>
        <SelectValue placeholder={placeholder || "Select"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, id) => {
          return (
            <SelectItem key={id} value={option.value}>
              {option.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default SelectInput;
