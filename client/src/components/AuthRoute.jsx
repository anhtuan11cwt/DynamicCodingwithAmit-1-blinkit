import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const user = useSelector((state) => state.user);

  if (user._id) {
    return <Navigate replace to="/" />;
  }

  return children;
};

export default AuthRoute;
