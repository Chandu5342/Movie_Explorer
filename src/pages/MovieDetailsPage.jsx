import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowBackRounded,
  FavoriteBorderRounded,
  FavoriteRounded,
  PlayArrowRounded,
  StarRounded,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useMovie } from '../context/MovieContext';
import { getMovieCredits, getMovieDetails, getMovieVideos } from '../services/tmdbApi';

const fallbackPoster = 'https://via.placeholder.com/500x750?text=Poster+Unavailable';
const fallbackActor = 'https://via.placeholder.com/300x450?text=Actor';

export default function MovieDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addFavorite, isFavorite, removeFavorite } = useMovie();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadMovieData = async () => {
      setLoading(true);
      setError('');

      try {
        const [movieData, creditsData, videosData] = await Promise.all([
          getMovieDetails(id),
          getMovieCredits(id),
          getMovieVideos(id),
        ]);

        if (!isMounted) {
          return;
        }

        const trailerVideo =
          (videosData || []).find((video) => video.type === 'Trailer' && video.site === 'YouTube') ||
          (videosData || []).find((video) => video.site === 'YouTube') ||
          null;

        setMovie(movieData);
        setCast((creditsData || []).slice(0, 8));
        setTrailer(trailerVideo);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(loadError.message || 'Unable to load movie details right now.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadMovieData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const favorite = isFavorite(Number(id));

  const handleFavoriteToggle = () => {
    if (!movie) {
      return;
    }

    if (favorite) {
      removeFavorite(Number(id));
      return;
    }

    addFavorite({
      id: movie.id,
      title: movie.title,
      posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : fallbackPoster,
      releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!movie) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
      <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, border: 1, borderColor: 'divider', borderRadius: 4 }}>
        <Button
          variant="text"
          startIcon={<ArrowBackRounded />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, px: 0 }}
        >
          Back
        </Button>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '300px 1fr' },
            gap: 4,
            alignItems: 'start',
          }}
        >
          <Box
            component="img"
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : fallbackPoster}
            alt={movie.title}
            sx={{ width: '100%', borderRadius: 3, objectFit: 'cover', boxShadow: 3 }}
          />

          <Stack spacing={2.5}>
            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.04em' }}>
              {movie.title}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'} />
              <Chip icon={<StarRounded />} label={`${Number(movie.vote_average || 0).toFixed(1)} / 10`} />
              {movie.runtime ? <Chip label={`${movie.runtime} min`} /> : null}
            </Stack>

            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              <Button
                variant="contained"
                startIcon={favorite ? <FavoriteRounded /> : <FavoriteBorderRounded />}
                onClick={handleFavoriteToggle}
              >
                {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>

              {trailer ? (
                <Button
                  variant="outlined"
                  startIcon={<PlayArrowRounded />}
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch Trailer
                </Button>
              ) : (
                <Button variant="outlined" disabled>
                  Trailer not available
                </Button>
              )}
            </Stack>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {movie.overview || 'No overview is available for this movie yet.'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Genres
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {(movie.genres || []).map((genre) => (
                  <Chip key={genre.id} label={genre.name} variant="outlined" />
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Details
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                {movie.original_language ? <Chip label={`Language: ${movie.original_language.toUpperCase()}`} /> : null}
                {movie.popularity ? <Chip label={`Popularity: ${movie.popularity.toFixed(1)}`} /> : null}
              </Stack>
            </Box>
          </Stack>
        </Box>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Cast
          </Typography>

          <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 1 }}>
            {cast.map((actor) => (
              <Box key={actor.id} sx={{ minWidth: 140, width: 140 }}>
                <Box
                  component="img"
                  src={actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : fallbackActor}
                  alt={actor.name}
                  sx={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 2, mb: 1 }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {actor.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {actor.character || 'Unknown role'}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
