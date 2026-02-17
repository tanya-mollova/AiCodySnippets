/**
 * @description A React component that guards routes and only renders children when the user is authenticated.
 * 
 * @usage This component is used in React Router configuration to wrap protected pages like the dashboard, redirecting unauthenticated users to the login page.
 * 
 * @param {Object} props - The component props
 * @returns {JSX.Element} The rendered component
 * 
 * @example
 * <PrivateRoute><Dashboard /></PrivateRoute>
 */
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
