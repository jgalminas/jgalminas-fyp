
export type ErrorMessageProps = {
  children: string
}

const ErrorMessage = ({ children }: ErrorMessageProps) => {
  return (
    <div className="text-red-600 text-sm bg-red-100 p-2.5 rounded">
      { children }
    </div>
  )
}

export default ErrorMessage;