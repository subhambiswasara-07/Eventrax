import { createContext, useEffect, useMemo, useState } from 'react';
import { loginRequest, registerRequest, verifyOtpRequest } from '../api/authApi';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'eventrax_token';
const USER_KEY = 'eventrax_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    } finally {
      setInitializing(false);
    }
  }, []);

  const persistSession = (token, nextUser) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  };

 
  const register = async ({ username, email, password }) => {
    const data = await registerRequest({ username, email, password });
    return data;
  };


  const login = async ({ email, password }) => {
    const data = await loginRequest({ email, password });
    persistSession(data.token, data.user);
    return data;
  };

  const verifyOtp = async ({ email, otp }) => {
    const data = await verifyOtpRequest({ email, otp });
    persistSession(data.token, data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      initializing,
      register,
      login,
      verifyOtp,
      logout,
    }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
