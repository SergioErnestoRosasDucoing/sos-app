import { useCallback, useState } from 'react';

const STORAGE_KEY = 'sos_auth';

function readStoredAuth() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { token: null, user: null };

  try {
    const parsed = JSON.parse(raw);
    if (parsed?.token && parsed?.user) return parsed;
  } catch {
    // fall through to clear the corrupted entry below
  }

  localStorage.removeItem(STORAGE_KEY);
  return { token: null, user: null };
}

export function useAuth() {
  const [{ token, user }, setAuth] = useState(readStoredAuth);

  const login = useCallback((newToken, newUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: newToken, user: newUser }));
    setAuth({ token: newToken, user: newUser });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth({ token: null, user: null });
  }, []);

  return { token, user, login, logout };
}
