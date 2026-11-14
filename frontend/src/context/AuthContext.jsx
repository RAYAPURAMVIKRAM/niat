import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hacksphere_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('hacksphere_token') || null);
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState(true);

  // Check backend health
  const checkHealth = async () => {
    try {
      const res = await api.get('/health', { timeout: 4000 });
      if (res.data?.status === 'ok') {
        setBackendOnline(true);
      }
    } catch (e) {
      setBackendOnline(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  const saveAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('hacksphere_token', newToken);
    localStorage.setItem('hacksphere_user', JSON.stringify(newUser));
  };

  // 1-Click Instant Demo Login as Vikram (Lead Architect @ NIAT)
  const demoLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        college_email: 'vikram@niat.edu.in',
        password: 'password123',
      });
      if (res.data?.token && res.data?.user) {
        saveAuth(res.data.token, res.data.user);
        return { success: true, user: res.data.user };
      }
      throw new Error('Invalid demo login response');
    } catch (err) {
      console.warn('Demo login fallback:', err.message);
      // Client-side fallback if backend was cold
      const fallbackUser = {
        id: 'demo-vikram-niat',
        full_name: 'Rayapuram Vikram',
        college_name: 'NIAT x Yenepoya University',
        college_email: 'vikram@niat.edu.in',
        is_verified: true,
        id_card_status: 'verified',
        skills: ['Next.js', 'FastAPI', 'Agentic AI', 'Supabase', 'Python'],
        city: 'Bengaluru',
        gender: 'Male',
      };
      saveAuth('demo_jwt_token_vikram', fallbackUser);
      return { success: true, user: fallbackUser };
    } finally {
      setLoading(false);
    }
  };

  const login = async (college_email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { college_email, password });
      saveAuth(res.data.token, res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return {
        success: false,
        error: err?.response?.data?.message || err?.response?.data?.error || err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      saveAuth(res.data.token, res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      return {
        success: false,
        error: err?.response?.data?.message || err?.response?.data?.error || err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hacksphere_token');
    localStorage.removeItem('hacksphere_user');
  };

  const updateUser = (fields) => {
    const updated = { ...user, ...fields };
    setUser(updated);
    localStorage.setItem('hacksphere_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        backendOnline,
        demoLogin,
        login,
        register,
        logout,
        updateUser,
        checkHealth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
