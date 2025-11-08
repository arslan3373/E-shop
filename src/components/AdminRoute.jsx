import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;
