import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import TerminalIcon from '@mui/icons-material/Terminal'; 
import CloseIcon from '@mui/icons-material/Close';
import './CyberNav.css';

const CyberNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Archive", href: "/archive" }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: '#050505', color: 'white', borderRight: '1px solid #00f3ff22' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton onClick={handleDrawerToggle} sx={{ color: '#00f3ff' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontFamily: 'Rajdhani', fontWeight: 700, color: '#00f3ff', letterSpacing: 3 }}>
          SYSTEM_NAV
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.href} 
              onClick={handleDrawerToggle}
              sx={{ '&:hover': { bgcolor: 'rgba(0, 243, 255, 0.1)' } }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ fontFamily: 'Rajdhani', fontSize: '1.2rem', letterSpacing: 1 }} 
                sx={{ textAlign: 'center' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem sx={{ mt: 2, justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            component={Link}
            to="/login"
            sx={{ 
              bgcolor: '#00f3ff', 
              color: 'black', 
              fontFamily: 'Rajdhani', 
              fontWeight: 'bold',
              width: '80%',
              '&:hover': { bgcolor: '#fff' }
            }}
          >
            LOGIN_
          </Button>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" className="nav-navbar" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ justifyContent: 'space-between', height: '90px' }}>
          
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
            <TerminalIcon sx={{ color: '#00f3ff', fontSize: 35 }} />
            <Box>
              <Typography
                variant="h5"
                sx={{ 
                  fontFamily: '"Rajdhani", sans-serif', 
                  fontWeight: 700, 
                  letterSpacing: '.15rem',
                  lineHeight: 1,
                  color: '#fff'
                }}
              >
                GAMER<span style={{ color: '#00f3ff' }}>LOG</span>
              </Typography>
              <Typography variant="caption" sx={{ color: '#888', fontFamily: 'Rajdhani', letterSpacing: 2 }}>
                VER_2.0.4
              </Typography>
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item, index) => (
                <div key={index} className="nav-link-container">
                  <Link to={item.href} className="nav-link">
                    <span>{item.label}</span>
                  </Link>
                </div>
              ))}
            </Box>
          )}

          {!isMobile ? (
            <Button component={Link} to="/login" className="nav-login-btn">
              LOGIN_SYSTEM
            </Button>
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon sx={{ color: '#00f3ff', fontSize: 30 }} />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar sx={{ height: '90px' }} />

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default CyberNavbar;