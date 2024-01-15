import { SelectOption } from "@renderer/core/Select";
import { useState } from "react";

export type useDateFilterProps = {
  onClick: (opt: SelectOption) => void
}

export const useDateFilter = (props?: useDateFilterProps) => {

  const handleClick = (opt: SelectOption) => {
    setValue(opt);
    if (props) {
      props.onClick(opt);
    }
  }

  const options: SelectOption[] = [
    {
      id: -1,
      value: 'Latest',
      onClick: handleClick
    },
    {
      id: 1,
      value: 'Oldest',
      onClick: handleClick
    }
  ]

  const [value, setValue] = useState<SelectOption>(options[0]);

  return [value, options] as const;
}