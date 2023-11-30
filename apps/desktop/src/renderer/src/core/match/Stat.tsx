
export type StatProps = {
  value: string,
  type: 'KDA' | 'CS' | 'WR' | 'KP'
}

const Stat = ({ value, type }: StatProps) => {
  
  return (
    <p className="text-sm text-star-dust-300 flex items-center gap-1">
      { value }
      <span className="text-star-dust-500 text-xs"> { type } </span>
    </p>
  )
}

export default Stat;