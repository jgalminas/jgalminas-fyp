
export type PrettyDateProps = {
  date: Date
}

const PrettyDate = ({ date }: PrettyDateProps) => {

  const divider = <span className="text-star-dust-500 text-xs"> / </span>; 

  return (
    <p className="flex h-fit w-fit gap-1.5 text-star-dust-300 items-center font-medium text-sm">
      { `${date.getDate() < 10 ? '0' : ''}${date.getDate()}` }
      { divider }
      {`${date.getMonth() < 10 ? '0' : ''}${date.getMonth()}`}
      { divider }
      { date.getFullYear() }
    </p>
  )
}

export default PrettyDate;