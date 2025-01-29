import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.token) {
      navigate("/login"); // Redirect to login if user is not authenticated
    }
  }, [user, navigate]);

  return user?.token ? children : null; // Render children only if authenticated
};

export default ProtectedRoute;
