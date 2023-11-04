import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export type UnauthedOnlyRouteProps = {
  element: JSX.Element,
  redirectTo?: string
}

const UnauthedOnlyRoute = ({ element, redirectTo = '/' }: UnauthedOnlyRouteProps) => {
  const { user } = useAuth();  
  return user ? <Navigate to={redirectTo} replace/> : element;
}

export default UnauthedOnlyRoute;