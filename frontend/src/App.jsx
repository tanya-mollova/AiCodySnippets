import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, Button } from '@mui/material';
import { Code as CodeIcon } from '@mui/icons-material';
import './App.css';
import { Login, Register, Dashboard } from './pages';
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
        <Route
          path="/"
          element={
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '100vh',
                  textAlign: 'center',
                  gap: 3,
                }}
              >
                <CodeIcon sx={{ fontSize: 80, color: 'primary.main' }} />
                <Typography variant="h2" component="h1" gutterBottom>
                  Welcome to AiCodySnippets
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                  A modern code snippets management application
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
                  Organize, store, and manage your code snippets with ease. Create private snippets
                  or share them with the community.
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  {user ? (
                    <Button
                      component={Link}
                      to="/dashboard"
                      variant="contained"
                      size="large"
                    >
                      Go to Dashboard
                    </Button>
                  ) : (
                    <>
                      <Button
                        component={Link}
                        to="/register"
                        variant="contained"
                        size="large"
                      >
                        Get Started
                      </Button>
                      <Button
                        component={Link}
                        to="/login"
                        variant="outlined"
                        size="large"
                      >
                        Sign In
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </Container>
          }
        />

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
