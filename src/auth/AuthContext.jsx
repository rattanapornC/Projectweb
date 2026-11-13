import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/backend';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('mh_token') || '');
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('mh_user') || 'null'); } catch { return null; } });
  const [busy, setBusy] = useState(false);
  function logout() { setToken(''); setUser(null); localStorage.removeItem('mh_token'); localStorage.removeItem('mh_user'); }
  useEffect(() => {
    if (token && !user) api('/api/me', { token }).then(u => { setUser(u); localStorage.setItem('mh_user', JSON.stringify(u)); }).catch(logout);
  }, []);
  async function auth(path, body) {
    setBusy(true);
    try { const data = await api(path, { method: 'POST', body }); setToken(data.token); setUser(data.member); localStorage.setItem('mh_token', data.token); localStorage.setItem('mh_user', JSON.stringify(data.member)); return true; }
    finally { setBusy(false); }
  }
  return <AuthContext.Provider value={{ token, user, logout, auth, busy }}>{children}</AuthContext.Provider>;
}
