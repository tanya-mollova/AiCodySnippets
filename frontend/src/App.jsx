import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { Login, Register, Dashboard, Welcome } from './pages';
import { PrivateRoute } from './components';
import { checkTokenExpiration } from './store/slices/authSlice';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Check token expiration on app initialization
  useEffect(() => {
    dispatch(checkTokenExpiration());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Welcome />} />

        {/* Auth Routes */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
