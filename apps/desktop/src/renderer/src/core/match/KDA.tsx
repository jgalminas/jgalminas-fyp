
export type KDAProps = {
  stats: {
    kills: number,
    deaths: number,
    assists: number
  }
}

const KDA = ({ stats }: KDAProps) => {

  return (
    <p className="text-sm text-star-dust-300 flex items-center gap-1">
      { stats.kills }
      <span className="text-star-dust-500 text-xs"> / </span>
      { stats.deaths }
      <span className="text-star-dust-500 text-xs"> / </span>
      { stats.assists }
    </p>
  )
}

export default KDA;