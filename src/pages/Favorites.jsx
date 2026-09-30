import { Paper, Typography } from '@mui/material';

export default function FavoritesPage() {
  return (
    <Paper elevation={0} sx={{ p: 4, border: 1, borderColor: 'divider', borderRadius: 3, mt: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Favorites
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Your saved movies will appear here once the favorite logic is connected in later phases.
      </Typography>
    </Paper>
  );
}
