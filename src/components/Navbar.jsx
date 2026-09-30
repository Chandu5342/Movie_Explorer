import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  DarkModeRounded,
  FavoriteRounded,
  HomeRounded,
  LightModeRounded,
  LogoutRounded,
  MovieRounded,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ mode, toggleTheme }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, minHeight: 72 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'primary.main', color: 'white', borderRadius: 2, width: 38, height: 38 }}>
            <MovieRounded fontSize="small" />
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            Movie Explorer
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Button component={RouterLink} to="/" color="inherit" startIcon={<HomeRounded />} sx={{ color: 'text.primary' }}>
            Home
          </Button>
          <Button component={RouterLink} to="/favorites" color="inherit" startIcon={<FavoriteRounded />} sx={{ color: 'text.primary' }}>
            Favorites
          </Button>
          <IconButton onClick={toggleTheme} color="primary" aria-label="Toggle theme">
            {mode === 'dark' ? <LightModeRounded /> : <DarkModeRounded />}
          </IconButton>
          <Button onClick={handleLogout} color="inherit" startIcon={<LogoutRounded />} sx={{ color: 'text.primary' }}>
            Logout
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
