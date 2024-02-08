import { cn } from "@fyp/class-name-helper";

export type HighlightTagProps = {
  value: string
}

const VARIANTS: { [key: string]: string } = {
  "Kill": "bg-green-500 text-green-500",
  "Double Kill": "bg-green-500 text-green-500",
  "Triple Kill": "bg-green-500 text-green-500",
  "Quadra Kill": "bg-green-500 text-green-500",
  "Penta Kill": "bg-green-500 text-green-500",
  "Tower Kill": "bg-amber-500 text-amber-500",
  "Herald Kill": "bg-purple-500 text-purple-500",
  "Baron Kill": "bg-purple-500 text-purple-500",
  "Dragon Kill": "bg-emerald-500 text-emerald-500",
  "Assist": "bg-blue-500 text-blue-500",
  "Multiple Assists": "bg-blue-500 text-blue-500",
  "Death": "bg-red-500 text-red-500",
  "default": "bg-gray-300 text-gray-300"
} as const;

export const HighlightTag = ({ value }: HighlightTagProps) => {

  const variant = VARIANTS[value] ?? VARIANTS.default;

  return (
    <p className={cn("px-3 py-1 rounded-sm2 text-sm bg-opacity-15", variant)}> { value } </p>
  )
}
