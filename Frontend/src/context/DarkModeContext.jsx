import React, { createContext, useState, useEffect } from 'react';

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    try {
      const savedDarkMode = localStorage.getItem('darkMode');
      // Default to light mode on new session
      if (savedDarkMode !== null) {
        const darkMode = JSON.parse(savedDarkMode);
        setIsDarkMode(darkMode);
        applyDarkMode(darkMode);
      } else {
        // First time - set to light mode
        setIsDarkMode(false);
        applyDarkMode(false);
        localStorage.setItem('darkMode', JSON.stringify(false));
      }
    } catch (error) {
      console.error('Error loading dark mode preference:', error);
      setIsDarkMode(false);
      applyDarkMode(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const applyDarkMode = (isDark) => {
    const body = document.body;
    const html = document.documentElement;
    if (isDark) {
      body.classList.add('dark-mode');
      html.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
      html.classList.remove('dark-mode');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      applyDarkMode(newMode);
      return newMode;
    });
  };

  const setDarkMode = (mode) => {
    setIsDarkMode(mode);
    localStorage.setItem('darkMode', JSON.stringify(mode));
    applyDarkMode(mode);
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode, loading }}>
      {children}
    </DarkModeContext.Provider>
  );
};
