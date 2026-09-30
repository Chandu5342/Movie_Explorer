import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const MovieContext = createContext(null);
const FAVORITES_KEY = 'movieExplorerFavorites';

const readFavorites = () => {
  const savedFavorites = localStorage.getItem(FAVORITES_KEY);

  if (!savedFavorites) {
    return [];
  }

  try {
    return JSON.parse(savedFavorites);
  } catch (error) {
    localStorage.removeItem(FAVORITES_KEY);
    return [];
  }
};

export function MovieProvider({ children }) {
  const [favorites, setFavorites] = useState(() => readFavorites());

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movie) => {
    setFavorites((currentFavorites) => {
      const exists = currentFavorites.some((item) => item.id === movie.id);

      if (exists) {
        return currentFavorites;
      }

      return [movie, ...currentFavorites];
    });
  };

  const removeFavorite = (movieId) => {
    setFavorites((currentFavorites) =>
      currentFavorites.filter((movie) => movie.id !== movieId)
    );
  };

  const isFavorite = (movieId) =>
    favorites.some((movie) => movie.id === movieId);

  const value = useMemo(
    () => ({
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
    }),
    [favorites]
  );

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
}

export function useMovie() {
  const context = useContext(MovieContext);

  if (!context) {
    throw new Error('useMovie must be used inside a MovieProvider.');
  }

  return context;
}
