import { cn } from "@fyp/class-name-helper"
import { KeyCombo } from "@root/shared/types"
import { Fragment, useState } from "react"

export type KeySelectorProps = {
  value: KeyCombo,
  onChange: (value: KeyCombo) => void,
  className?: string
}

export const KeySelector = ({ className, value, onChange }: KeySelectorProps) => {

  const [inEdit, setInEdit] = useState<boolean>(false);

  const onEdit = () => {
    if (!inEdit) {
      setInEdit(true);
      const fn = (e: KeyboardEvent) => {
        if (e.key !== "Shift" && e.key !== "Control") {
          onChange({
            key: e.key,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey
          });
          window.removeEventListener("keydown", fn)
          setInEdit(false);
        }
      }
      window.addEventListener("keydown", fn);
    }
  }

  const parsed = () => {
    return `
    ${value.shiftKey ? "Shift +" : ""}
    ${value.ctrlKey ? "Ctrl +" : ""}
    ${value.key[0].toUpperCase() + value.key.substring(1)}`;
  }

  return (
    <button onClick={onEdit} className={cn(
      "bg-woodsmoke-400 text-star-dust-300 border-woodsmoke-50 border flex items-center",
      "text-sm pl-3 pr-1 py-1 min-w-[8rem] w-fit gap-6 rounded-lg",
      className
    )}>
      { inEdit
        ?
        <Fragment>
          Press a key
          <span className="text-xs ml-auto p-1.5 hover:bg-woodsmoke-600 rounded-md" onClick={() => setInEdit(false)}> Cancel </span>
        </Fragment>
        :
        <Fragment>
          { parsed() }
          <span className="text-xs ml-auto p-1.5 hover:bg-woodsmoke-600 rounded-md"> Edit </span>
        </Fragment>
      }
    </button>
  )
}
