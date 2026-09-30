import { Paper, Stack, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <Stack spacing={3} sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, border: 1, borderColor: 'divider', borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {user?.username || 'movie lover'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Discover trending films, search for your favorites, and keep track of the movies you want to revisit.
        </Typography>
      </Paper>

      <Paper elevation={0} sx={{ p: 4, border: 1, borderColor: 'divider', borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Trending movies
        </Typography>
        <Typography variant="body2" color="text.secondary">
          This section will be connected to TMDb in the next phase of development.
        </Typography>
      </Paper>
    </Stack>
  );
}
