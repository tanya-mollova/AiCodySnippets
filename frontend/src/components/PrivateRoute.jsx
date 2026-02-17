import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

function PrivateRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  // Check if token exists and is not expired
  const isAuthenticated = () => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Token is still valid
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
