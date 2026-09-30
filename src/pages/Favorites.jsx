import { Box, Paper, Typography } from '@mui/material';
import MovieGrid from '../components/MovieGrid';
import { useMovie } from '../context/MovieContext';

export default function FavoritesPage() {
  const { favorites } = useMovie();

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, border: 1, borderColor: 'divider', borderRadius: 4, mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Favorites
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Save the movies you love and revisit them anytime.
        </Typography>
      </Paper>

      <MovieGrid
        movies={favorites}
        title="Saved movies"
        emptyMessage="You have not added any favorites yet."
      />
    </Box>
  );
}
