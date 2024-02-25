import { cn } from "@fyp/class-name-helper"

export type KDAProps = {
  className?: string,
  stats: {
    kills: number | string,
    deaths: number | string,
    assists: number | string
  }
}

const KDA = ({ stats, className }: KDAProps) => {

  return (
    <p className={cn("text-sm text-star-dust-300 flex items-center gap-1", className)}>
      { stats.kills }
      <span className="text-star-dust-500 text-xs"> / </span>
      { stats.deaths }
      <span className="text-star-dust-500 text-xs"> / </span>
      { stats.assists }
    </p>
  )
}

export default KDA;