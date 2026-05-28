import { createContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../services/api.js';

const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

const getCookie = (name) => {
  const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return v ? v.pop() : null;
};

const setCookie = (name, value, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const deleteCookie = (name) => {
  document.cookie = name + '=; Max-Age=0; path=/';
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getCookie('authToken'));
  const [user, setUser] = useState(() => {
    const stored = getCookie('authUser');
    try {
      return stored ? JSON.parse(decodeURIComponent(stored)) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      setCookie('authToken', token, 7);
    } else {
      setAuthToken(null);
      deleteCookie('authToken');
    }
    setLoading(false);
  }, [token]);

  const login = async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    const accessToken = response.data.token;
    setToken(accessToken);
    const authUser = { email };
    setUser(authUser);
    setCookie('authUser', encodeURIComponent(JSON.stringify(authUser)), 7);
    return response;
  };

  const register = async ({ username, email, password }) => {
    return api.post('/auth/register', { username, email, password });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    deleteCookie('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
