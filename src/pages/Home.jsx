import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { SearchRounded } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import MovieGrid from '../components/MovieGrid';
import { getGenres, getTrendingMovies, searchMovies as searchTmdbMovies } from '../services/tmdbApi';

const LAST_SEARCH_KEY = 'movieExplorerLastSearch';
const YEARS = Array.from({ length: 30 }, (_, index) => new Date().getFullYear() - index);
const RATING_OPTIONS = [
  { label: 'All ratings', value: '' },
  { label: '8.0+', value: '8' },
  { label: '7.0+', value: '7' },
  { label: '6.0+', value: '6' },
];

export default function HomePage() {
  const { user } = useAuth();
  const sentinelRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState(() => localStorage.getItem(LAST_SEARCH_KEY) || '');
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(Boolean(localStorage.getItem(LAST_SEARCH_KEY)));
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const triggerSearch = async (nextPage = 1, resetResults = true) => {
    const trimmedTerm = searchTerm.trim();
    const hasFilters = Boolean(selectedGenre || selectedYear || selectedRating);

    if (!trimmedTerm && !hasFilters) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    if (resetResults) {
      setLoadingSearch(true);
      setSearchError('');
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await searchTmdbMovies(trimmedTerm, nextPage, {
        genreId: selectedGenre,
        year: selectedYear,
        rating: selectedRating,
      });

      const results = response.results || [];

      if (resetResults) {
        setSearchResults(results);
      } else {
        setSearchResults((currentMovies) => [...currentMovies, ...results]);
      }

      setPage(response.page || nextPage);
      setTotalPages(response.total_pages || 1);
      setHasSearched(true);

      if (trimmedTerm) {
        localStorage.setItem(LAST_SEARCH_KEY, trimmedTerm);
      }
    } catch (error) {
      setSearchError(error.message || 'Something went wrong while searching for movies.');
      if (resetResults) {
        setSearchResults([]);
      }
    } finally {
      setLoadingSearch(false);
      setLoadingMore(false);
    }
  };

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

    const loadGenres = async () => {
      try {
        const response = await getGenres();
        setGenres(response);
      } catch (error) {
        setSearchError(error.message || 'Unable to load movie genres right now.');
      }
    };

    loadTrending();
    loadGenres();
  }, []);

  useEffect(() => {
    const savedSearch = localStorage.getItem(LAST_SEARCH_KEY);

    if (!savedSearch) {
      return;
    }

    const restoreLastSearch = async () => {
      setLoadingSearch(true);
      setHasSearched(true);

      try {
        const response = await searchTmdbMovies(savedSearch, 1, {
          genreId: selectedGenre,
          year: selectedYear,
          rating: selectedRating,
        });

        setSearchResults(response.results || []);
        setPage(response.page || 1);
        setTotalPages(response.total_pages || 1);
        setSearchError('');
      } catch (error) {
        setSearchError(error.message || 'Unable to load your last searched movie.');
      } finally {
        setLoadingSearch(false);
      }
    };

    restoreLastSearch();
  }, []);

  useEffect(() => {
    if (!hasSearched && !searchTerm.trim() && !selectedGenre && !selectedYear && !selectedRating) {
      return;
    }

    triggerSearch(1, true);
  }, [selectedGenre, selectedYear, selectedRating]);

  useEffect(() => {
    if (!sentinelRef.current || page >= totalPages || !hasSearched) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingSearch && !loadingMore) {
          triggerSearch(page + 1, false);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [hasSearched, page, totalPages, loadingSearch, loadingMore]);

  const handleSearch = async (event) => {
    event.preventDefault();

    const trimmedTerm = searchTerm.trim();

    if (!trimmedTerm && !selectedGenre && !selectedYear && !selectedRating) {
      setSearchError('Please enter a movie title or choose a filter.');
      return;
    }

    await triggerSearch(1, true);
  };

  const handleClearFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
    setSearchError('');
    setHasSearched(Boolean(searchTerm.trim()));
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

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select value={selectedGenre} label="Genre" onChange={(event) => setSelectedGenre(event.target.value)}>
                <MenuItem value="">All genres</MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select value={selectedYear} label="Year" onChange={(event) => setSelectedYear(event.target.value)}>
                <MenuItem value="">All years</MenuItem>
                {YEARS.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Rating</InputLabel>
              <Select value={selectedRating} label="Rating" onChange={(event) => setSelectedRating(event.target.value)}>
                {RATING_OPTIONS.map((option) => (
                  <MenuItem key={option.label} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="outlined" onClick={handleClearFilters} sx={{ minWidth: 180 }}>
              Clear filters
            </Button>
          </Stack>
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
              <>
                <MovieGrid
                  movies={searchResults}
                  title={searchTerm ? `Search results for “${searchTerm}”` : 'Filtered results'}
                  emptyMessage="No movies found for this search. Try another title or clear a filter."
                />

                {page < totalPages && !loadingMore && (
                  <Box ref={sentinelRef} sx={{ height: 20, mt: 3 }} />
                )}

                {loadingMore && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
