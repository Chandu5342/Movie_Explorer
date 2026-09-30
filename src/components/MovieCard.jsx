import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { StarRounded } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  const releaseYear = movie.releaseYear || 'N/A';

  return (
    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
      <Card
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: 1,
          borderColor: 'divider',
          borderRadius: 4,
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
      >
        <CardMedia
          component="img"
          image={movie.posterUrl}
          alt={movie.title}
          sx={{ height: 360, objectFit: 'cover' }}
        />

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
            <Typography variant="h6" component="h3" sx={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3 }}>
              {movie.title}
            </Typography>
            <Chip
              icon={<StarRounded sx={{ fontSize: '0.9rem' }} />}
              label={Number(movie.vote_average || 0).toFixed(1)}
              size="small"
              color="secondary"
              sx={{ fontWeight: 700 }}
            />
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {releaseYear}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
