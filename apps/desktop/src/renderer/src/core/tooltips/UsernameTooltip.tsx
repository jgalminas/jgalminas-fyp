
export type UsernameTooltipProps = {
  username: string,
  tag: string
}

export const UsernameTooltip = ({ username, tag }: UsernameTooltipProps) => {

  return (
    <p className="flex items-center">
      { username }
      <span className="ml-0.5 text-star-dust-300 text-xs"> #{tag} </span>
    </p>
  )
}
