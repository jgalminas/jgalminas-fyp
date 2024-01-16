import { QUEUE } from "@fyp/types"
import { SelectOption } from "@renderer/core/Select"
import { queue } from "@renderer/util/queue"
import { useState } from "react"

export type useQueueFilterProps = {
  onClick: (opt: SelectOption) => void
}

export const useQueueFilter = (props?: useQueueFilterProps) => {

  const handleClick = (opt: SelectOption) => {
    setValue(opt);
    if (props) {
      props.onClick(opt);
    }
  }

  const options: SelectOption[] = [
    {
      id: 0,
      value: 'All game modes',
      onClick: handleClick
    },
    ...QUEUE.map(q => ({
      id: q,
      value: queue(q),
      onClick: handleClick
    }))
  ]

  const [value, setValue] = useState<SelectOption>(options[0]);

  return [value, options] as const;
}