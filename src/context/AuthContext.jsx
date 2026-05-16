import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import usersData from '../data/users.json';

const AuthContext = createContext(null);

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('love-story-auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.username && parsed.role) {
          setUser(parsed);
        }
      }
    } catch { /* ignore */ }
  }, []);

  const login = useCallback(async (username, password) => {
    const found = usersData.users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase(),
    );
    if (!found) {
      return { success: false, error: 'User not found' };
    }

    const hash = await sha256(password);
    if (hash !== found.passwordHash) {
      return { success: false, error: 'Incorrect password' };
    }

    const session = {
      username: found.username,
      role: found.role,
      displayName: found.displayName,
    };
    setUser(session);
    localStorage.setItem('love-story-auth', JSON.stringify(session));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('love-story-auth');
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
