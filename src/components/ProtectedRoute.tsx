import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";


const ProtectedRoute = ({ children }: any) => {
    const token = useAuthStore.getState().token
    const expiresAt = new Date(useAuthStore.getState().expiresAt)
    if (!token || new Date() > expiresAt) return <Navigate to={'/login'} />
    return children
}

export default ProtectedRoute