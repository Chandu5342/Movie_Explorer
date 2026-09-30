import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
});

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const ensureApiKey = () => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDb API key missing. Add VITE_TMDB_API_KEY to your .env file.');
  }
};

const normalizeMovie = (movie) => ({
  ...movie,
  posterUrl: movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=Poster+Unavailable',
  releaseYear: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
});

export const getTrendingMovies = async () => {
  ensureApiKey();

  const response = await api.get('/trending/movie/day', {
    params: {
      api_key: TMDB_API_KEY,
    },
  });

  return (response.data.results || []).map(normalizeMovie);
};

export const getGenres = async () => {
  ensureApiKey();

  const response = await api.get('/genre/movie/list', {
    params: {
      api_key: TMDB_API_KEY,
    },
  });

  return response.data.genres || [];
};

export const searchMovies = async (query, page = 1, filters = {}) => {
  const safeQuery = query.trim();
  const hasFilters = Boolean(filters.genreId || filters.year || filters.rating);

  if (!safeQuery && !hasFilters) {
    return { results: [], total_pages: 0, page: 1 };
  }

  ensureApiKey();

  const params = {
    api_key: TMDB_API_KEY,
    page,
  };

  if (safeQuery) {
    params.query = safeQuery;
  }

  if (filters.genreId) {
    params.with_genres = filters.genreId;
  }

  if (filters.year) {
    params.primary_release_year = filters.year;
  }

  if (filters.rating) {
    params['vote_average.gte'] = Number(filters.rating);
  }

  const endpoint = safeQuery ? '/search/movie' : '/discover/movie';

  const response = await api.get(endpoint, { params });

  return {
    ...response.data,
    results: (response.data.results || []).map(normalizeMovie),
  };
};

export const getMovieDetails = async (movieId) => {
  ensureApiKey();

  const response = await api.get(`/movie/${movieId}`, {
    params: {
      api_key: TMDB_API_KEY,
    },
  });

  return response.data;
};

export const getMovieCredits = async (movieId) => {
  ensureApiKey();

  const response = await api.get(`/movie/${movieId}/credits`, {
    params: {
      api_key: TMDB_API_KEY,
    },
  });

  return response.data.cast || [];
};

export const getMovieVideos = async (movieId) => {
  ensureApiKey();

  const response = await api.get(`/movie/${movieId}/videos`, {
    params: {
      api_key: TMDB_API_KEY,
    },
  });

  return response.data.results || [];
};
