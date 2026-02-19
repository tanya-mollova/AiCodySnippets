/**
 * @description A React component that renders the main application navigation bar with branding and user actions.
 * 
 * @usage This component is used at the top of the application layout to display the {AiCodySnippets} logo, show the logged in user, and provide logout navigation.
 * 
 * @param {Object} props - The component props
 * @returns {JSX.Element} The rendered component
 * 
 * @example
 * <Navbar />
 */
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import LogoutIcon from '@mui/icons-material/Logout';

const NAV_LINKS = [
  { label: 'My Snippets', path: '/my-snippets' },
  { label: 'Explore', path: '/explore' },
];

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <AppBar position="sticky" sx={{ top: 0, zIndex: 1100 }}>
      <Toolbar>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: 700, mr: 4, cursor: 'pointer', fontFamily: 'monospace', flexShrink: 0 }}
          onClick={() => navigate('/')}
        >
          {'{AiCodySnippets}'}
        </Typography>

        {/* Nav Links */}
        {user && (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {NAV_LINKS.map(({ label, path }) => {
              const active = location.pathname === path;
              return (
                <Button
                  key={path}
                  color="inherit"
                  onClick={() => navigate(path)}
                  sx={{
                    fontWeight: active ? 700 : 400,
                    position: 'relative',
                    borderRadius: 1,
                    px: 2,
                    color: active ? 'primary.main' : 'inherit',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 6,
                      left: '50%',
                      transform: active ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0)',
                      transformOrigin: 'center',
                      width: '60%',
                      height: '2px',
                      backgroundColor: 'primary.main',
                      borderRadius: 1,
                      transition: 'transform 0.2s ease',
                    },
                    '&:hover::after': {
                      transform: 'translateX(-50%) scaleX(1)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.06)',
                    },
                  }}
                >
                  {label}
                </Button>
              );
            })}
          </Box>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {user.username || user.email}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                transition: 'background-color 0.2s',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
