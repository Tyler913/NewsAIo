import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import SettingsPage from './components/SettingsPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [fontScale, setFontScale] = useState(1.0);
  
  // Load settings on startup
  useEffect(() => {
    // In the future, this will load from the Electron API
    const loadSettings = async () => {
      try {
        // Placeholder for electron API call
        // const settings = await window.electronAPI.getSettings();
        // setDarkMode(settings.darkMode);
        // setFontScale(settings.fontScale);
      } catch (error) {
        console.error("Failed to load settings:", error);
      }
    };
    
    loadSettings();
  }, []);
  
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontSize: 14 * fontScale,
    },
  });
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={
            <Layout 
              darkMode={darkMode} 
              setDarkMode={setDarkMode}
              fontScale={fontScale}
              setFontScale={setFontScale}
            >
              <HomePage />
            </Layout>
          } />
          <Route path="/settings" element={
            <Layout 
              darkMode={darkMode} 
              setDarkMode={setDarkMode}
              fontScale={fontScale}
              setFontScale={setFontScale}
            >
              <SettingsPage />
            </Layout>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 