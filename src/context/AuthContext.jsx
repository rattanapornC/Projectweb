
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'mangahub_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem(TOKEN_KEY)
  );
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkLogin() {
      if (!token) {
        if (active) setLoading(false);
        return;
      }

      try {
        const data = await api('/api/me', { token });
        if (active) setMember(data);
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        if (active) {
          setToken(null);
          setMember(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    checkLogin();
    return () => { active = false; };
  }, [token]);

  async function login(email, password) {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    localStorage.setItem(TOKEN_KEY, data.token);
    setMember(data.member);
    setToken(data.token);
    return data.member;
  }

  async function register(displayName, email, password) {
    const data = await api('/api/auth/register', {
      method: 'POST',
      body: {
        display_name: displayName,
        email,
        password,
      },
    });

    localStorage.setItem(TOKEN_KEY, data.token);
    setMember(data.member);
    setToken(data.token);
    return data.member;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setMember(null);
  }

  return (
    <AuthContext.Provider
      value={{ member, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth ต้องใช้ภายใน AuthProvider');
  }
  return context;
}
