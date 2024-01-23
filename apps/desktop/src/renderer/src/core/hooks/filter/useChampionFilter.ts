import { SearchSelectOption } from "@renderer/core/SearchSelect";
import { CHAMPIONS } from "@root/constants";
import { useState } from "react";

export type useChampionFilterProps = {
  onClick: (opt: SearchSelectOption) => void
}

export const useChampionFilter = (props?: useChampionFilterProps) => {

  const handleClick = (opt: SearchSelectOption) => {
    setValue(opt);
    if (props) {
      props.onClick(opt);
    }
  }

  const options: SearchSelectOption[] = [
    {
      id: 'all',
      value: 'All champions',
      onClick: handleClick
    },
    ...Object.values(CHAMPIONS).map((ch) => {
      return {
        id: ch.id,
        value: ch.name,
        onClick: handleClick
      }
    })
  ]

  const [value, setValue] = useState<SearchSelectOption>(options[0]);

  return [value, options] as const;
}