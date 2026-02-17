/**
 * @description A React component that renders the login form for existing users.
 * 
 * @usage This component is used on the /login route to authenticate users and start a session for accessing protected areas like the dashboard.
 * 
 * @param {Object} props - The component props
 * @returns {JSX.Element} The rendered component
 * 
 * @example
 * <Login />
 */
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { login, reset } from '../store/slices/authSlice';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const { email, password, rememberMe } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // Error is displayed via Alert component
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    // Reset state when component unmounts
    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    if (e.target.name === 'rememberMe') {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.checked,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password, rememberMe }));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>

          {isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={onChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={onChange}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="rememberMe"
                  checked={rememberMe}
                  onChange={onChange}
                  color="primary"
                />
              }
              label="Remember me (30 days)"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
