import { useContext, useState } from 'react';
import MobileDrawer from './MobileDrawer';
import { IconButton, Typography, Toolbar, Button, AppBar, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../reducers/auth';

const Header = () => {
  const { state: authState, dispatch } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openDrawer, setOpenDrawer] = useState(false);
  let navigate = useNavigate();

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  }

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        {
          isMobile && (
            <IconButton onClick={() => setOpenDrawer(!openDrawer)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
          )
        }
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1, textDecoration: 'none' }}
          component={RouterLink}
          to="/"
        >
          heapover<span style={{ "color": "#ff3300" }}>flow</span>
        </Typography>
        {
          isMobile ? (
            <MobileDrawer
              openDrawer={openDrawer}
              setOpenDrawer={setOpenDrawer}
            />
          ) : (
            <>
              {
                !authState.isAuthenticated ? (
                  <>
                    <Button component={RouterLink} to='/login' variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                      Login
                    </Button>
                    <Button component={RouterLink} to='/register' variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                      Register
                    </Button>
                  </>
                ) : (
                  <>
                    <Button component={RouterLink} to='/editProfile' variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                      My profile
                    </Button>
                    <Button onClick={logout} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                      Logout
                    </Button>
                  </>
                )
              }
            </>
          )}
      </Toolbar>
    </AppBar>
  )
}

export default Header;
