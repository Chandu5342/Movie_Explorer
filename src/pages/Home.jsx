import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { SearchRounded } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/MovieGrid';
import { getTrendingMovies, searchMovies as searchTmdbMovies } from '../services/tmdbApi';

const LAST_SEARCH_KEY = 'movieExplorerLastSearch';

export default function HomePage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem(LAST_SEARCH_KEY) || '');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(Boolean(localStorage.getItem(LAST_SEARCH_KEY)));

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const movies = await getTrendingMovies();
        setTrendingMovies(movies);
      } catch (error) {
        setSearchError(error.message || 'Unable to load trending movies right now.');
      } finally {
        setLoadingTrending(false);
      }
    };

    loadTrending();
  }, []);

  useEffect(() => {
    const savedSearch = localStorage.getItem(LAST_SEARCH_KEY);

    if (!savedSearch) {
      return;
    }

    const restoreLastSearch = async () => {
      setLoadingSearch(true);

      try {
        const response = await searchTmdbMovies(savedSearch);
        setSearchResults(response.results || []);
        setSearchError('');
      } catch (error) {
        setSearchError(error.message || 'Unable to load your last searched movie.');
      } finally {
        setLoadingSearch(false);
      }
    };

    restoreLastSearch();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    const trimmedTerm = searchTerm.trim();

    if (!trimmedTerm) {
      setSearchError('Please enter a movie title to search.');
      return;
    }

    setHasSearched(true);
    setLoadingSearch(true);
    setSearchError('');

    try {
      const response = await searchTmdbMovies(trimmedTerm);
      setSearchResults(response.results || []);
      localStorage.setItem(LAST_SEARCH_KEY, trimmedTerm);
    } catch (error) {
      setSearchError(error.message || 'Something went wrong while searching for movies.');
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
      <Stack spacing={4}>
        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, border: 1, borderColor: 'divider', borderRadius: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back, {user?.username || 'movie lover'}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Discover trending films, search for your favorites, and keep track of the movies you want to revisit.
          </Typography>

          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              label="Search movies"
              variant="outlined"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Try Inception, Dune, or Spider-Man"
            />
            <Button type="submit" variant="contained" size="large" startIcon={<SearchRounded />} sx={{ minWidth: 170 }}>
              Search
            </Button>
          </Box>
        </Paper>

        {searchError && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {searchError}
          </Alert>
        )}

        {loadingTrending ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <MovieGrid movies={trendingMovies} title="Trending movies" emptyMessage="No trending movies available right now." />
        )}

        {hasSearched && (
          <Box>
            {loadingSearch ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <MovieGrid
                movies={searchResults}
                title={searchTerm ? `Search results for “${searchTerm}”` : 'Search results'}
                emptyMessage="No movies found for this search. Try another title."
              />
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
