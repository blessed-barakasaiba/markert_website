import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }


  return <>{children}</>; // fixed
};

export default PrivateRoute;
