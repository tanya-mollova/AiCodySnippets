import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import LogoutIcon from '@mui/icons-material/Logout';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
          sx={{ 
            flexGrow: 0,
            fontWeight: 700,
            mr: 4,
            cursor: 'pointer',
            fontFamily: 'monospace',
          }}
          onClick={() => navigate('/')}
        >
          {'{AiCodySnippets}'}
        </Typography>
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
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
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
