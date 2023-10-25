import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export type SecureRouteProps = {
  element: JSX.Element,
  redirectTo?: string
}

const SecureRoute = ({ element, redirectTo = '/login' }: SecureRouteProps) => {
  const { user } = useAuth();  
  return user ? element : <Navigate to={redirectTo} replace/>;
}

export default SecureRoute;