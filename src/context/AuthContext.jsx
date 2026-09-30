import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const AUTH_KEY = 'movieExplorerAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(AUTH_KEY);

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      localStorage.removeItem(AUTH_KEY);
      return null;
    }
  });

  const login = ({ username }) => {
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      throw new Error('Username is required.');
    }

    const nextUser = { username: cleanUsername };
    setUser(nextUser);
    localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return context;
}
