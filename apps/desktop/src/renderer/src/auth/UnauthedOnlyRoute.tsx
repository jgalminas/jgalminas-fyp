import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export type UnauthedOnlyRouteProps = {
  element: JSX.Element,
  redirectTo?: string
}

const UnauthedOnlyRoute = ({ element, redirectTo = '/' }: UnauthedOnlyRouteProps) => {
  const { session } = useAuth();  
  return session ? <Navigate to={redirectTo} replace/> : element;
}

export default UnauthedOnlyRoute;