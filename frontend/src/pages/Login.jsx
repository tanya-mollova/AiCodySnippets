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
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { login, reset } from '../store/slices/authSlice';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const { email, password, rememberMe } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  // Only depend on success/user for navigation — NOT isError.
  // Including isError would trigger the cleanup (reset()) the moment an error lands,
  // clearing it before the Alert can render.
  useEffect(() => {
    if (isSuccess || user) navigate('/my-snippets');
    return () => { dispatch(reset()); };
  }, [user, isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'rememberMe' ? checked : value }));
    // Clear inline field error
    if (fieldErrors[name]) setFieldErrors((prev) => { const c = { ...prev }; delete c[name]; return c; });
    // Clear Redux error so the banner disappears when user starts correcting
    if (isError) dispatch(reset());
  };

  const validate = () => {
    const errors = {};
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Enter a valid email address';
    if (!password) errors.password = 'Password is required';
    return errors;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    dispatch(login({ email, password, rememberMe }));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 6 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            border: isError ? '1px solid' : '1px solid transparent',
            borderColor: isError ? 'error.main' : 'transparent',
            transition: 'border-color 0.2s',
          }}
        >
          {/* Logo / heading */}
          <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 0.5 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Sign in to your account
          </Typography>

          {/* Server-side error banner */}
          {isError && message && (
            <Alert
              severity="error"
              icon={<ErrorOutlineIcon />}
              sx={{
                mb: 2.5,
                borderRadius: 2,
                fontWeight: 500,
                animation: 'shake 0.35s ease',
                '@keyframes shake': {
                  '0%,100%': { transform: 'translateX(0)' },
                  '20%,60%': { transform: 'translateX(-6px)' },
                  '40%,80%': { transform: 'translateX(6px)' },
                },
              }}
            >
              {message}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={onChange}
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon fontSize="small" color={fieldErrors.email ? 'error' : 'action'} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={onChange}
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" color={fieldErrors.password ? 'error' : 'action'} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end" tabIndex={-1}>
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={<Checkbox name="rememberMe" checked={rememberMe} onChange={onChange} color="primary" size="small" />}
              label={<Typography variant="body2">Remember me (30 days)</Typography>}
              sx={{ mt: 0.5 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 2.5, mb: 2, borderRadius: 2, fontWeight: 600 }}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {isLoading ? 'Signing in…' : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  Don&apos;t have an account? Sign Up
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
