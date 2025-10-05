import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  ListItemButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Work,
  People,
  Psychology,
  Assignment,
  Search,
  Add,
  AccountCircle,
} from '@mui/icons-material';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavigationItems = () => {
    if (user?.role === 'admin') {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Candidates', icon: <People />, path: '/dashboard/candidates' },
        { text: 'Recruiters', icon: <People />, path: '/dashboard/recruiters' },
        { text: 'AI Interviews', icon: <Psychology />, path: '/dashboard/interviews' },
        { text: 'All Applications', icon: <Assignment />, path: '/dashboard/applications' },
      ];
    } else if (user?.role === 'recruiter') {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'My Jobs', icon: <Work />, path: '/dashboard/jobs' },
        { text: 'Post New Job', icon: <Add />, path: '/dashboard/post-job' },
      ];
    } else if (user?.role === 'candidate') {
      return [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Browse Jobs', icon: <Search />, path: '/dashboard/browse-jobs' },
        { text: 'My Applications', icon: <Assignment />, path: '/dashboard/my-applications' },
      ];
    }
    return [];
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#d32f2f';
      case 'recruiter':
        return '#1976d2';
      case 'candidate':
        return '#2e7d32';
      default:
        return '#757575';
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ATS AI Interviewer
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Box textAlign="right">
              <Typography variant="body2">{user?.full_name}</Typography>
              <Typography variant="caption" sx={{ textTransform: 'uppercase' }}>
                {user?.role}
              </Typography>
            </Box>
            <IconButton
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <AccountCircle sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <Box sx={{ p: 2, bgcolor: getRoleColor(user?.role || ''), color: 'white' }}>
            <Typography variant="subtitle2">Role</Typography>
            <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
              {user?.role}
            </Typography>
          </Box>
          <Divider />
          <List>
            {navigationItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: drawerOpen ? '240px' : 0,
          transition: 'margin 0.3s',
        }}
      >
        <Outlet />
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem disabled>
          <Typography variant="body2">{user?.email}</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout;
