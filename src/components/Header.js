import { useContext, useState } from 'react';
import MobileDrawer from './MobileDrawer';
import { MenuItem, Menu, IconButton, Typography, Link, Toolbar, Button, AppBar, Avatar, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../reducers/auth';

const Header = () => {
  const { state: authState, dispatch } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openDrawer, setOpenDrawer] = useState(false);

  let navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    handleClose();
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  }

  const navigation = [{
    name: 'Contact', path: '/contact'
  },
  {
    name: 'Features', path: '/features'
  },
  {
    name: 'Support', path: '/support'
  },
  ];

  return <AppBar
    position="sticky"
    color="default"
    elevation={0}
    sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
  >
    <Toolbar sx={{ flexWrap: 'wrap' }}>
      {isMobile ? (
        <IconButton onClick={() => setOpenDrawer(!openDrawer)} sx={{ mr: 1 }}>
          <MenuIcon />
        </IconButton>) : (<></>)
      }
      <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, textDecoration: 'none' }} component={RouterLink} to="/">
        heapover<span style={{ "color": "#ff3300" }}>flow</span>
      </Typography>
      {isMobile ? (
        <MobileDrawer navigation={navigation}
          openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      ) : (
        <>
          <nav>
            {
              navigation.map(item =>
                <Link
                  key={item.name}
                  variant="button"
                  underline="none"
                  color="text.primary"
                  component={RouterLink}
                  to={item.path}
                  sx={{ my: 1, mx: 1.5 }}
                >
                  {item.name}
                </Link>
              )
            }
          </nav>
          {
            !authState.isAuthenticated && (
              <>
                <Button component={RouterLink} to='/login' variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                  Login
                </Button>
                <Button component={RouterLink} to='/register' variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                  Register
                </Button>
              </>
            )
          }

          {
            authState.isAuthenticated && (
              <>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main', cursor: 'pointer' }} onClick={handleClick}>
                </Avatar>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem onClick={handleClose}>My Profile</MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </>
            )
          }
        </>
      )}
    </Toolbar>
  </AppBar>
}

export default Header;
