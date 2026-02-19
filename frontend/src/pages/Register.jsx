/**
 * @description A React component that renders the registration form for new users.
 * 
 * @usage This component is used on the /register route to collect user details and create an account before logging into the dashboard.
 * 
 * @param {Object} props - The component props
 * @returns {JSX.Element} The rendered component
 * 
 * @example
 * <Register />
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
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { register, reset } from '../store/slices/authSlice';

const pwdRules = [
  { key: 'length',    label: 'At least 8 characters',       test: (p) => p.length >= 8 },
  { key: 'upper',     label: 'One uppercase letter',         test: (p) => /[A-Z]/.test(p) },
  { key: 'lower',     label: 'One lowercase letter',         test: (p) => /[a-z]/.test(p) },
  { key: 'number',    label: 'One number',                   test: (p) => /[0-9]/.test(p) },
];

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [fieldErrors, setFieldErrors]   = useState({});

  const { username, email, password, confirmPassword } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess || user) navigate('/my-snippets');
    return () => { dispatch(reset()); };
  }, [user, isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => { const c = { ...prev }; delete c[name]; return c; });
    if (isError) dispatch(reset());
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!username.trim()) errors.username = 'Username is required';
    if (!email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Enter a valid email address';
    const failing = pwdRules.filter((r) => !r.test(password));
    if (failing.length) errors.password = 'Password does not meet all requirements below';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
    if (Object.keys(errors).length) { setFieldErrors(errors); return; }
    dispatch(register({ username, email, password }));
  };

  const pwdStarted = password.length > 0;

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
          <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 0.5 }}>
            Create account
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Join AiCodySnippets today
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
              margin="normal" required fullWidth
              label="Username" name="username" autoComplete="username" autoFocus
              value={username} onChange={onChange}
              error={!!fieldErrors.username} helperText={fieldErrors.username}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small" color={fieldErrors.username ? 'error' : 'action'} /></InputAdornment> }}
            />
            <TextField
              margin="normal" required fullWidth
              label="Email Address" name="email" autoComplete="email"
              value={email} onChange={onChange}
              error={!!fieldErrors.email} helperText={fieldErrors.email}
              InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon fontSize="small" color={fieldErrors.email ? 'error' : 'action'} /></InputAdornment> }}
            />
            <TextField
              margin="normal" required fullWidth
              label="Password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password"
              value={password} onChange={onChange}
              error={!!fieldErrors.password} helperText={fieldErrors.password}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" color={fieldErrors.password ? 'error' : 'action'} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPassword((p) => !p)} edge="end" tabIndex={-1}>{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment>,
              }}
            />

            {/* Password requirements checklist */}
            {pwdStarted && (
              <Box sx={{ mt: 1, mb: 0.5, pl: 0.5 }}>
                {pwdRules.map((rule) => {
                  const ok = rule.test(password);
                  return (
                    <Box key={rule.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                      {ok
                        ? <CheckCircleIcon sx={{ fontSize: 14, color: 'success.main' }} />
                        : <RadioButtonUncheckedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                      }
                      <Typography variant="caption" color={ok ? 'success.main' : 'text.secondary'}>
                        {rule.label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}

            <TextField
              margin="normal" required fullWidth
              label="Confirm Password" name="confirmPassword" type={showConfirm ? 'text' : 'password'} autoComplete="new-password"
              value={confirmPassword} onChange={onChange}
              error={!!fieldErrors.confirmPassword} helperText={fieldErrors.confirmPassword}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockIcon fontSize="small" color={fieldErrors.confirmPassword ? 'error' : 'action'} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowConfirm((p) => !p)} edge="end" tabIndex={-1}>{showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}</IconButton></InputAdornment>,
              }}
            />

            <Button
              type="submit" fullWidth variant="contained" size="large"
              sx={{ mt: 2.5, mb: 2, borderRadius: 2, fontWeight: 600 }}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {isLoading ? 'Creating account…' : 'Sign Up'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary" sx={{ '&:hover': { textDecoration: 'underline' } }}>
                  Already have an account? Sign In
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register;
