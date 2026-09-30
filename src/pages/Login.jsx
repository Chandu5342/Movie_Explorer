import { useEffect, useState } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.username.trim()) {
      nextErrors.username = 'Username is required.';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.';
    }

    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    login({ username: formData.username, password: formData.password });
    navigate('/');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 4,
        background: 'radial-gradient(circle at top, #ede9fe 0%, #f5f7fb 35%, #eef2ff 100%)',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 430,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          border: 1,
          borderColor: 'divider',
        }}
      >
        <Stack spacing={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.05em' }}>
              Movie Explorer
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Discover your favorite films
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={Boolean(errors.username)}
                helperText={errors.username || ' '}
                fullWidth
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password || ' '}
                fullWidth
              />

              <Button type="submit" variant="contained" size="large" sx={{ py: 1.4, fontWeight: 700 }}>
                Login
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
