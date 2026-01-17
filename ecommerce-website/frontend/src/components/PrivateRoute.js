import { Navigate, useLocation } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to={`/login?redirect=${location.pathname.replace("/", "")}`}
        replace
      />
    );
  }

  return children;
}

export default PrivateRoute;
