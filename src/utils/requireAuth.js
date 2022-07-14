import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
    var token = localStorage.getItem("userToken");

    return token ? children : <Navigate to="/signin" replace />;
}
