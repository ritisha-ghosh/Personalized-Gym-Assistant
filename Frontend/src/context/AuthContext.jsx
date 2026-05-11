import React, { createContext, useState, useEffect } from 'react';
import { trackLogin } from '../utils/storageUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for logged-in user on refresh
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // Track login for today when page loads
        if (userData?.id) {
          trackLogin(userData.id);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, tokens) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      setUser(userData);
      
      // Track login date
      if (userData?.id) {
        trackLogin(userData.id);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  // ⭐ NEW: Update user data in context and localStorage
  // This is called whenever user profile is updated
  const updateUser = (updatedUserData) => {
    try {
      const newUserData = { ...user, ...updatedUserData };
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);
      console.log(`✅ User context updated:`, newUserData);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};