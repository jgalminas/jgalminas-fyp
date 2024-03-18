import { cn } from "@fyp/class-name-helper";

export type HighlightTagProps = {
  value: string
}

const VARIANTS: { [key: string]: string } = {
  "Kill": "bg-green-500 text-green-400",
  "Double Kill": "bg-green-500 text-green-400",
  "Triple Kill": "bg-green-500 text-green-400",
  "Quadra Kill": "bg-green-500 text-green-400",
  "Penta Kill": "bg-green-500 text-green-400",
  "Tower Kill": "bg-amber-500 text-amber-400",
  "Herald Kill": "bg-purple-500 text-purple-400",
  "Baron Kill": "bg-purple-500 text-purple-400",
  "Dragon Kill": "bg-emerald-500 text-emerald-400",
  "Assist": "bg-blue-500 text-blue-400",
  "Multiple Assists": "bg-blue-500 text-blue-400",
  "Death": "bg-red-500 text-red-400",
  "default": "bg-gray-300 text-gray-200"
} as const;

export const HighlightTag = ({ value }: HighlightTagProps) => {

  const variant = VARIANTS[value] ?? VARIANTS.default;

  return (
    <p className={cn("px-3 py-1 rounded-sm2 text-sm bg-opacity-15", variant)}> { value } </p>
  )
}
