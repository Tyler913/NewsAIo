import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
} from '@mui/icons-material';

const drawerWidth = 240;

function Layout({ children, darkMode, setDarkMode, fontScale, setFontScale }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In the future, save to electron settings
  };
  
  const increaseFontScale = () => {
    setFontScale(Math.min(2.0, fontScale + 0.1));
    // In the future, save to electron settings
  };
  
  const decreaseFontScale = () => {
    setFontScale(Math.max(0.5, fontScale - 0.1));
    // In the future, save to electron settings
  };
  
  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          NewsAIo
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem 
          button 
          selected={location.pathname === '/'}
          onClick={() => handleNavigation('/')}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        
        <ListItem 
          button 
          selected={location.pathname === '/settings'}
          onClick={() => handleNavigation('/settings')}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={toggleDarkMode}>
          <ListItemIcon>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText primary={darkMode ? "Light Mode" : "Dark Mode"} />
        </ListItem>
        
        <ListItem button onClick={increaseFontScale}>
          <ListItemIcon>
            <ZoomInIcon />
          </ListItemIcon>
          <ListItemText primary="Increase Font" />
        </ListItem>
        
        <ListItem button onClick={decreaseFontScale}>
          <ListItemIcon>
            <ZoomOutIcon />
          </ListItemIcon>
          <ListItemText primary="Decrease Font" />
        </ListItem>
      </List>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            NewsAIo
          </Typography>
          
          <IconButton color="inherit" onClick={toggleDarkMode}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          
          <IconButton color="inherit" onClick={decreaseFontScale}>
            <ZoomOutIcon />
          </IconButton>
          
          <IconButton color="inherit" onClick={increaseFontScale}>
            <ZoomInIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      {/* Drawer - responsive behavior */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileDrawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              backgroundColor: theme.palette.background.paper
            },
          }}
        >
          {drawer}
        </Drawer>
      )}
      
      {/* Main content area */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { md: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px',
          backgroundColor: theme.palette.background.default,
          minHeight: 'calc(100vh - 64px)'
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout; 