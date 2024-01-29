
export type ErrorMessageProps = {
  children: string
}

const ErrorMessage = ({ children }: ErrorMessageProps) => {
  return (
    <div className="text-accent-red text-sm bg-red-200 bg-opacity-10 p-2.5 rounded">
      { children }
    </div>
  )
}

export default ErrorMessage;