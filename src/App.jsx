import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import FavoritesPage from './pages/Favorites';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import MovieDetailsPage from './pages/MovieDetailsPage';

function ProtectedLayout({ mode, toggleTheme }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar mode={mode} toggleTheme={toggleTheme} />
      <Outlet />
    </>
  );
}

export default function App() {
  const [mode, setMode] = useState(() => {
    const savedTheme = localStorage.getItem('movieExplorerTheme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('movieExplorerTheme', mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#7c3aed' },
          secondary: { main: '#f59e0b' },
          background: {
            default: mode === 'dark' ? '#0f172a' : '#f5f7fb',
            paper: mode === 'dark' ? '#111827' : '#ffffff',
          },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((currentMode) => (currentMode === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedLayout mode={mode} toggleTheme={toggleTheme} />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
